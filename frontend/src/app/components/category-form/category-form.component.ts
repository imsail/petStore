import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, CardModule, InputTextModule, TextareaModule],
  template: `
    <h2>{{ isEdit ? 'Edit' : 'Add' }} Category</h2>
    <p-card styleClass="form-card">
      <form (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label for="category-name">Name</label>
          <input pInputText id="category-name" [(ngModel)]="category.name" name="name" required fluid>
        </div>
        <div class="form-field">
          <label for="category-description">Description</label>
          <textarea pTextarea id="category-description" [(ngModel)]="category.description" name="description" rows="3" fluid></textarea>
        </div>
        <div class="form-actions">
          <button pButton type="submit" [label]="isEdit ? 'Update' : 'Create'"></button>
          <a pButton outlined severity="secondary" label="Cancel" routerLink="/categories"></a>
        </div>
      </form>
    </p-card>
  `
})
export class CategoryFormComponent implements OnInit {
  category: Category = { id: 0, name: '', description: '' };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.categoryService.findById(Number(id)).subscribe(c => this.category = c);
    }
  }

  onSubmit(): void {
    const obs = this.isEdit
      ? this.categoryService.update(this.category.id, this.category)
      : this.categoryService.create(this.category);
    obs.subscribe(() => this.router.navigate(['/categories']));
  }
}
