import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  Supplier,
  SupplierService
} from '../../services/supplier';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css'
})
export class Suppliers implements OnInit {

  suppliers: Supplier[] = [];

  loading = true;
  error = '';

  showForm = false;
  editing = false;

  selectedId: number | null = null;

  supplier: Supplier = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  constructor(
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {

    this.loading = true;
    this.error = '';

    this.supplierService.getSuppliers().pipe(
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe({

      next: (data) => {
        this.suppliers = data;
      },

      error: (err) => {
        console.error(err);

        this.error =
          'Unable to load suppliers.';

      }

    });
  }

  openAddForm(): void {

    this.editing = false;
    this.selectedId = null;

    this.supplier = {
      name: '',
      email: '',
      phone: '',
      address: ''
    };

    this.showForm = true;
  }

  openEditForm(supplier: Supplier): void {

    this.editing = true;
    this.selectedId = supplier.id ?? null;

    this.supplier = {
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address
    };

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveSupplier(): void {

    if (!this.supplier.name.trim()) {
      alert('Please enter supplier name.');
      return;
    }

    if (
      this.editing &&
      this.selectedId !== null
    ) {

      this.supplierService
        .updateSupplier(
          this.selectedId,
          this.supplier
        )
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadSuppliers();
          },

          error: (err) => {
            console.error(err);
            alert('Unable to update supplier.');
          }

        });

    } else {

      this.supplierService
        .createSupplier(this.supplier)
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadSuppliers();
          },

          error: (err) => {
            console.error(err);
            alert('Unable to create supplier.');
          }

        });
    }
  }

  deleteSupplier(id: number | undefined): void {

    if (id === undefined) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this supplier?'
    );

    if (!confirmed) {
      return;
    }

    this.supplierService
      .deleteSupplier(id)
      .subscribe({

        next: () => {
          this.loadSuppliers();
        },

        error: (err) => {
          console.error(err);
          alert('Unable to delete supplier.');
        }

      });
  }
}
