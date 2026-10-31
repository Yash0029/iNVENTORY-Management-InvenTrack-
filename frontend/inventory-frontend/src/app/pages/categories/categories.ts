import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  Category,
  CategoryService
} from '../../services/category';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {

  categories: Category[] = [];

  loading = true;
  error = '';

  showForm = false;
  editing = false;

  selectedId: number | null = null;

  category: Category = {
    name: '',
    description: ''
  };

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {

    this.loading = true;
    this.error = '';

    this.categoryService.getCategories().pipe(
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe({

      next: (data) => {
        this.categories = data;
      },

      error: (err) => {
        console.error(err);

        this.error =
          'Unable to load categories.';

      }

    });
  }

  openAddForm(): void {

    this.editing = false;
    this.selectedId = null;

    this.category = {
      name: '',
      description: ''
    };

    this.showForm = true;
  }

  openEditForm(category: Category): void {

    this.editing = true;
    this.selectedId = category.id ?? null;

    this.category = {
      name: category.name,
      description: category.description
    };

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveCategory(): void {

    if (!this.category.name.trim()) {
      alert('Please enter a category name.');
      return;
    }

    if (
      this.editing &&
      this.selectedId !== null
    ) {

      this.categoryService
        .updateCategory(
          this.selectedId,
          this.category
        )
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadCategories();
          },

          error: (err) => {
            console.error(err);
            alert('Unable to update category.');
          }

        });

    } else {

      this.categoryService
        .createCategory(this.category)
        .subscribe({

          next: () => {
            this.closeForm();
            this.loadCategories();
          },

          error: (err) => {
            console.error(err);
            alert('Unable to create category.');
          }

        });
    }
  }

  deleteCategory(id: number | undefined): void {

    if (id === undefined) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this category?'
    );

    if (!confirmed) {
      return;
    }

    this.categoryService
      .deleteCategory(id)
      .subscribe({

        next: () => {
          this.loadCategories();
        },

        error: (err) => {
          console.error(err);
          alert('Unable to delete category.');
        }

      });
  }
}
