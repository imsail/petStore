import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Categories</h2>
      <a class="btn btn-primary" routerLink="/categories/new">Add Category</a>
    </div>
    <table class="table table-striped">
      <thead>
        <tr><th>Name</th><th>Description</th><th></th></tr>
      </thead>
      <tbody>
        @for (cat of categories; track cat.id) {
          <tr>
            <td>{{ cat.name }}</td>
            <td>{{ cat.description }}</td>
            <td>
              <div class="d-flex gap-1">
                <a class="btn btn-sm btn-outline-primary" [routerLink]="['/categories', cat.id, 'edit']">Edit</a>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteCategory(cat.id)">Delete</button>
              </div>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categoryService.findAll().subscribe(c => this.categories = c);
  }

  deleteCategory(id: number): void {
    if (confirm('Delete this category?')) {
      this.categoryService.delete(id).subscribe(() => this.load());
    }
  }
}
