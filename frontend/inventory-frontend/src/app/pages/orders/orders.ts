import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  Order,
  OrderService
} from '../../services/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  orders: Order[] = [];

  loading = true;
  error = '';

  showForm = false;
  editing = false;

  selectedId: number | null = null;

  order: Order = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    totalAmount: 0,
    status: 'Pending'
  };

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.orderService.getOrders().pipe(
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe({

      next: (data) => {
        this.orders = data;
      },

      error: (err) => {
        console.error(err);
        this.error = 'Unable to load orders.';
      }

    });
  }

  openAddForm(): void {
    this.editing = false;
    this.selectedId = null;

    this.order = {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      totalAmount: 0,
      status: 'Pending'
    };

    this.showForm = true;
  }

  openEditForm(order: Order): void {
    this.editing = true;
    this.selectedId = order.id ?? null;

    this.order = {
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      totalAmount: order.totalAmount,
      status: order.status
    };

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveOrder(): void {

    if (!this.order.customerName.trim()) {
      alert('Please enter customer name.');
      return;
    }

    if (this.order.totalAmount < 0) {
      alert('Order amount cannot be negative.');
      return;
    }

    if (
      this.editing &&
      this.selectedId !== null
    ) {

      this.orderService
        .updateOrder(
          this.selectedId,
          this.order
        )
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadOrders();
          },

          error: (err) => {
            console.error(err);
            alert('Unable to update order.');
          }

        });

    } else {

      this.orderService
        .createOrder(this.order)
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadOrders();
          },

          error: (err) => {
            console.error(err);
            alert('Unable to create order.');
          }

        });
    }
  }

  deleteOrder(id: number | undefined): void {

    if (id === undefined) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this order?'
    );

    if (!confirmed) {
      return;
    }

    this.orderService
      .deleteOrder(id)
      .subscribe({

        next: () => {
          this.loadOrders();
        },

        error: (err) => {
          console.error(err);
          alert('Unable to delete order.');
        }

      });
  }

  getStatusClass(status: string): string {
    return status
      .toLowerCase()
      .replace(/\s+/g, '-');
  }
}
