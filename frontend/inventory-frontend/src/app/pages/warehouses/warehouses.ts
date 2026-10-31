import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  Warehouse,
  WarehouseService
} from '../../services/warehouse';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './warehouses.html',
  styleUrl: './warehouses.css'
})
export class Warehouses implements OnInit {

  warehouses: Warehouse[] = [];

  loading = true;
  error = '';

  showForm = false;
  editing = false;

  selectedId: number | null = null;

  warehouse: Warehouse = {
    name: '',
    location: '',
    manager: ''
  };

  constructor(
    private warehouseService: WarehouseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {

    this.loading = true;
    this.error = '';

    this.warehouseService.getWarehouses().pipe(
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe({

      next: (data) => {
        this.warehouses = data;
      },

      error: (err) => {
        console.error(err);

        this.error =
          'Unable to load warehouses.';

      }

    });
  }

  openAddForm(): void {

    this.editing = false;
    this.selectedId = null;

    this.warehouse = {
      name: '',
      location: '',
      manager: ''
    };

    this.showForm = true;
  }

  openEditForm(warehouse: Warehouse): void {

    this.editing = true;
    this.selectedId = warehouse.id ?? null;

    this.warehouse = {
      name: warehouse.name,
      location: warehouse.location,
      manager: warehouse.manager
    };

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveWarehouse(): void {

    if (!this.warehouse.name.trim()) {
      alert('Please enter warehouse name.');
      return;
    }

    if (
      this.editing &&
      this.selectedId !== null
    ) {

      this.warehouseService
        .updateWarehouse(
          this.selectedId,
          this.warehouse
        )
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadWarehouses();
          },

          error: (err) => {
            console.error(err);
            alert('Unable to update warehouse.');
          }

        });

    } else {

      this.warehouseService
        .createWarehouse(this.warehouse)
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadWarehouses();
          },

          error: (err) => {
            console.error(err);
            alert('Unable to create warehouse.');
          }

        });
    }
  }

  deleteWarehouse(id: number | undefined): void {

    if (id === undefined) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this warehouse?'
    );

    if (!confirmed) {
      return;
    }

    this.warehouseService
      .deleteWarehouse(id)
      .subscribe({

        next: () => {
          this.loadWarehouses();
        },

        error: (err) => {
          console.error(err);
          alert('Unable to delete warehouse.');
        }

      });
  }
}
