import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TableModule],
  template: `
    <div class="page-header">
      <h2>Categories</h2>
      <a pButton label="Add Category" routerLink="/categories/new"></a>
    </div>
    <div class="table-wrap">
      <p-table [value]="categories" stripedRows [tableStyle]="{ 'min-width': '42rem' }">
        <ng-template #header>
        <tr><th>Name</th><th>Description</th><th></th></tr>
        </ng-template>
        <ng-template #body let-cat>
          <tr>
            <td>{{ cat.name }}</td>
            <td>{{ cat.description }}</td>
            <td class="table-actions">
              <div class="inline-actions">
                <a pButton outlined size="small" label="Edit" [routerLink]="['/categories', cat.id, 'edit']"></a>
                <button pButton outlined size="small" severity="danger" label="Delete" type="button" (click)="deleteCategory(cat.id)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
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
