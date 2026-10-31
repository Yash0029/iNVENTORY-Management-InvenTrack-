import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  StockTransfer,
  StockTransferService
} from '../../services/stock-transfer';

@Component({
  selector: 'app-stock-transfers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './stock-transfers.html',
  styleUrl: './stock-transfers.css'
})
export class StockTransfers implements OnInit {

  transfers: StockTransfer[] = [];

  loading = true;
  error = '';

  showForm = false;
  editing = false;

  selectedId: number | null = null;

  transfer: StockTransfer = {
    productId: 0,
    fromWarehouseId: 0,
    toWarehouseId: 0,
    quantity: 0,
    status: 'Pending'
  };

  constructor(
    private stockTransferService: StockTransferService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTransfers();
  }

  loadTransfers(): void {

    this.loading = true;
    this.error = '';

    this.stockTransferService
      .getStockTransfers().pipe(
        finalize(() => { this.loading = false; this.cdr.markForCheck(); })
      )
      .subscribe({

        next: (data) => {
          this.transfers = data;
        },

        error: (err) => {
          console.error(err);
          this.error =
            'Unable to load stock transfers.';
        }

      });
  }

  openAddForm(): void {

    this.editing = false;
    this.selectedId = null;

    this.transfer = {
      productId: 0,
      fromWarehouseId: 0,
      toWarehouseId: 0,
      quantity: 0,
      status: 'Pending'
    };

    this.showForm = true;
  }

  openEditForm(
    transfer: StockTransfer
  ): void {

    this.editing = true;
    this.selectedId = transfer.id ?? null;

    this.transfer = {
      productId: transfer.productId,
      fromWarehouseId: transfer.fromWarehouseId,
      toWarehouseId: transfer.toWarehouseId,
      quantity: transfer.quantity,
      status: transfer.status
    };

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveTransfer(): void {

    if (
      this.transfer.productId <= 0 ||
      this.transfer.fromWarehouseId <= 0 ||
      this.transfer.toWarehouseId <= 0 ||
      this.transfer.quantity <= 0
    ) {

      alert(
        'Please enter valid transfer details.'
      );

      return;
    }

    if (
      this.transfer.fromWarehouseId ===
      this.transfer.toWarehouseId
    ) {

      alert(
        'Source and destination warehouses must be different.'
      );

      return;
    }

    if (
      this.editing &&
      this.selectedId !== null
    ) {

      this.stockTransferService
        .updateStockTransfer(
          this.selectedId,
          this.transfer
        )
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadTransfers();
          },

          error: (err) => {
            console.error(err);
            alert(
              'Unable to update stock transfer.'
            );
          }

        });

    } else {

      this.stockTransferService
        .createStockTransfer(
          this.transfer
        )
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadTransfers();
          },

          error: (err) => {
            console.error(err);
            alert(
              'Unable to create stock transfer.'
            );
          }

        });
    }
  }

  deleteTransfer(
    id: number | undefined
  ): void {

    if (id === undefined) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this stock transfer?'
    );

    if (!confirmed) {
      return;
    }

    this.stockTransferService
      .deleteStockTransfer(id)
      .subscribe({

        next: () => {
          this.loadTransfers();
        },

        error: (err) => {
          console.error(err);
          alert(
            'Unable to delete stock transfer.'
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
