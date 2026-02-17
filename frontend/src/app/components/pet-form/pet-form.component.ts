import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetCreate } from '../../models/pet.model';
import { Category } from '../../models/category.model';
import { PetService } from '../../services/pet.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>{{ isEdit ? 'Edit' : 'Add' }} Pet</h2>
    <form (ngSubmit)="onSubmit()" #petForm="ngForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" [(ngModel)]="pet.name" name="name" required>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Type</label>
          <input type="text" class="form-control" [(ngModel)]="pet.type" name="type" required>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Breed</label>
          <input type="text" class="form-control" [(ngModel)]="pet.breed" name="breed">
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label">Age</label>
          <input type="number" class="form-control" [(ngModel)]="pet.age" name="age" min="0">
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label">Price</label>
          <input type="number" class="form-control" [(ngModel)]="pet.price" name="price" required min="0.01" step="0.01">
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label">Stock</label>
          <input type="number" class="form-control" [(ngModel)]="pet.stock" name="stock" required min="0">
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label">Category</label>
          <select class="form-select" [(ngModel)]="pet.categoryId" name="categoryId">
            <option [ngValue]="null">None</option>
            @for (cat of categories; track cat.id) {
              <option [ngValue]="cat.id">{{ cat.name }}</option>
            }
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Image URL</label>
          <input type="text" class="form-control" [(ngModel)]="pet.imageUrl" name="imageUrl">
        </div>
        <div class="col-12 mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" [(ngModel)]="pet.description" name="description" rows="3"></textarea>
        </div>
      </div>
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Create' }}</button>
        <a class="btn btn-outline-secondary" routerLink="/pets">Cancel</a>
      </div>
    </form>
  `
})
export class PetFormComponent implements OnInit {
  pet: PetCreate = { name: '', type: '', breed: '', age: 0, price: 0, imageUrl: '', description: '', stock: 0, categoryId: null };
  categories: Category[] = [];
  isEdit = false;
  private editId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.findAll().subscribe(cats => this.categories = cats);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = Number(id);
      this.petService.findById(this.editId).subscribe(p => {
        this.pet = {
          name: p.name, type: p.type, breed: p.breed, age: p.age,
          price: p.price, imageUrl: p.imageUrl, description: p.description,
          stock: p.stock, categoryId: p.category?.id ?? null
        };
      });
    }
  }

  onSubmit(): void {
    const obs = this.isEdit
      ? this.petService.update(this.editId!, this.pet)
      : this.petService.create(this.pet);
    obs.subscribe(() => this.router.navigate(['/pets']));
  }
}
