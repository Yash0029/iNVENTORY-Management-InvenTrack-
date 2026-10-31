import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  Fulfillment,
  FulfillmentService
} from '../../services/fulfillment';

@Component({
  selector: 'app-fulfillment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './fulfillment.html',
  styleUrl: './fulfillment.css'
})
export class FulfillmentPage implements OnInit {

  fulfillments: Fulfillment[] = [];

  loading = true;
  error = '';

  showForm = false;
  editing = false;

  selectedId: number | null = null;

  fulfillment: Fulfillment = {
    orderId: 0,
    status: 'Pending',
    assignedTo: ''
  };

  constructor(
    private fulfillmentService: FulfillmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFulfillments();
  }

  loadFulfillments(): void {
    this.loading = true;
    this.error = '';

    this.fulfillmentService
      .getFulfillments().pipe(
        finalize(() => { this.loading = false; this.cdr.markForCheck(); })
      )
      .subscribe({
        next: (data) => {
          this.fulfillments = data;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Unable to load fulfillments.';
        }
      });
  }

  openAddForm(): void {
    this.editing = false;
    this.selectedId = null;

    this.fulfillment = {
      orderId: 0,
      status: 'Pending',
      assignedTo: ''
    };

    this.showForm = true;
  }

  openEditForm(
    fulfillment: Fulfillment
  ): void {

    this.editing = true;
    this.selectedId = fulfillment.id ?? null;

    this.fulfillment = {
      orderId: fulfillment.orderId,
      status: fulfillment.status,
      assignedTo: fulfillment.assignedTo
    };

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveFulfillment(): void {

    if (this.fulfillment.orderId <= 0) {
      alert('Please enter a valid order ID.');
      return;
    }

    if (!this.fulfillment.assignedTo.trim()) {
      alert('Please enter the assigned person.');
      return;
    }

    if (
      this.editing &&
      this.selectedId !== null
    ) {

      this.fulfillmentService
        .updateFulfillment(
          this.selectedId,
          this.fulfillment
        )
        .subscribe({
          next: () => {
            this.closeForm();
            this.loadFulfillments();
          },
          error: (err) => {
            console.error(err);
            alert(
              'Unable to update fulfillment.'
            );
          }
        });

    } else {

      this.fulfillmentService
        .createFulfillment(
          this.fulfillment
        )
        .subscribe({
          next: () => {
            this.closeForm();
            this.loadFulfillments();
          },
          error: (err) => {
            console.error(err);
            alert(
              'Unable to create fulfillment.'
            );
          }
        });
    }
  }

  deleteFulfillment(
    id: number | undefined
  ): void {

    if (id === undefined) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this fulfillment?'
    );

    if (!confirmed) {
      return;
    }

    this.fulfillmentService
      .deleteFulfillment(id)
      .subscribe({
        next: () => {
          this.loadFulfillments();
        },
        error: (err) => {
          console.error(err);
          alert(
            'Unable to delete fulfillment.'
          );
        }
      });
  }

  getStatusClass(
    status: string
  ): string {

    return status
      .toLowerCase()
      .replace(/\s+/g, '-');
  }
}
