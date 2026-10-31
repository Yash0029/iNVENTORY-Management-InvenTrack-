import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth';

import {
  Product,
  ProductService
} from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  products: Product[] = [];

  loading = true;
  error = '';

  showForm = false;
  editing = false;

  selectedId: number | null = null;

  product: Product = {
    name: '',
    sku: '',
    description: '',
    price: 0,
    minimumStock: 0
  };

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  get canManageProducts(): boolean { return ['ADMIN', 'INVENTORY_MANAGER'].includes(this.authService.currentUser()?.role || ''); }

  loadProducts(): void {

    this.loading = true;
    this.error = '';

    this.productService.getProducts().pipe(
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe({

      next: (data) => {
        this.products = data;
      },

      error: (err) => {
        console.error(err);

        this.error =
          'Unable to load products.';

      }

    });
  }

  openAddForm(): void {

    this.editing = false;
    this.selectedId = null;

    this.product = {
      name: '',
      sku: '',
      description: '',
      price: 0,
      minimumStock: 0
    };

    this.showForm = true;
  }

  openEditForm(product: Product): void {

    this.editing = true;
    this.selectedId = product.id ?? null;

    this.product = {
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price,
      minimumStock: product.minimumStock
    };

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveProduct(): void {

    if (
      !this.product.name ||
      !this.product.sku ||
      this.product.price < 0 ||
      this.product.minimumStock < 0
    ) {
      alert('Please fill all required fields correctly.');
      return;
    }

    if (this.editing && this.selectedId !== null) {

      this.productService
        .updateProduct(
          this.selectedId,
          this.product
        )
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadProducts();
          },

          error: (err) => {
            console.error(err);
            alert('Unable to update product.');
          }

        });

    } else {

      this.productService
        .createProduct(this.product)
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadProducts();
          },

          error: (err) => {
            console.error(err);
            alert('Unable to create product.');
          }

        });

    }
  }

  deleteProduct(id: number | undefined): void {

    if (id === undefined) {
      return;
    }

    const confirmed =
      confirm(
        'Are you sure you want to delete this product?'
      );

    if (!confirmed) {
      return;
    }

    this.productService
      .deleteProduct(id)
      .subscribe({

        next: () => {
          this.loadProducts();
        },

        error: (err) => {
          console.error(err);
          if (err.status === 403) alert('You do not have permission to delete products. Ask an administrator to assign the Inventory Manager or Admin role.');
          else if (err.status === 409) alert(err.error?.message || 'This product cannot be deleted because inventory records exist.');
          else alert('Unable to delete product.');
        }

      });
  }

}
