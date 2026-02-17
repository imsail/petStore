import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>{{ isEdit ? 'Edit' : 'Add' }} Category</h2>
    <form (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" [(ngModel)]="category.name" name="name" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" [(ngModel)]="category.description" name="description" rows="3"></textarea>
      </div>
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Create' }}</button>
        <a class="btn btn-outline-secondary" routerLink="/categories">Cancel</a>
      </div>
    </form>
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
