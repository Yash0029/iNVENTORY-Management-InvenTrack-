import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  Inventory,
  InventoryService
} from '../../services/inventory';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class InventoryPage implements OnInit {

  inventory: Inventory[] = [];

  loading = true;
  error = '';

  showForm = false;
  editing = false;

  selectedId: number | null = null;

  inventoryForm: Inventory = {
    productId: 0,
    warehouseId: 0,
    quantity: 0,
    minimumStock: 0
  };

  constructor(
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {

    this.loading = true;
    this.error = '';

    this.inventoryService.getInventory().pipe(
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe({

      next: (data) => {
        this.inventory = data;
      },

      error: (err) => {
        console.error(err);

        this.error =
          'Unable to load inventory.';

      }

    });
  }

  openAddForm(): void {

    this.editing = false;
    this.selectedId = null;

    this.inventoryForm = {
      productId: 0,
      warehouseId: 0,
      quantity: 0,
      minimumStock: 0
    };

    this.showForm = true;
  }

  openEditForm(item: Inventory): void {

    this.editing = true;
    this.selectedId = item.id ?? null;

    this.inventoryForm = {
      productId: item.productId,
      warehouseId: item.warehouseId,
      quantity: item.quantity,
      minimumStock: item.minimumStock
    };

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveInventory(): void {

    if (
      this.inventoryForm.productId <= 0 ||
      this.inventoryForm.warehouseId <= 0 ||
      this.inventoryForm.quantity < 0 ||
      this.inventoryForm.minimumStock < 0
    ) {
      alert(
        'Please enter valid inventory details.'
      );

      return;
    }

    if (
      this.editing &&
      this.selectedId !== null
    ) {

      this.inventoryService
        .updateInventory(
          this.selectedId,
          this.inventoryForm
        )
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadInventory();
          },

          error: (err) => {
            console.error(err);
            alert(
              'Unable to update inventory.'
            );
          }

        });

    } else {

      this.inventoryService
        .createInventory(
          this.inventoryForm
        )
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadInventory();
          },

          error: (err) => {
            console.error(err);
            alert(
              'Unable to create inventory.'
            );
          }

        });
    }
  }

  deleteInventory(
    id: number | undefined
  ): void {

    if (id === undefined) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this inventory record?'
    );

    if (!confirmed) {
      return;
    }

    this.inventoryService
      .deleteInventory(id)
      .subscribe({

        next: () => {
          this.loadInventory();
        },

        error: (err) => {
          console.error(err);
          alert(
            'Unable to delete inventory.'
          );
        }

      });
  }

  isLowStock(item: Inventory): boolean {
    return item.quantity <= item.minimumStock;
  }

}
