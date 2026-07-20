import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetCreate } from '../../models/pet.model';
import { Category } from '../../models/category.model';
import { PetService } from '../../services/pet.service';
import { CategoryService } from '../../services/category.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, ButtonModule, CardModule,
    InputNumberModule, InputTextModule, SelectModule, TextareaModule
  ],
  template: `
    <h2>{{ isEdit ? 'Edit' : 'Add' }} Pet</h2>
    <p-card styleClass="form-card">
      <form (ngSubmit)="onSubmit()" #petForm="ngForm">
        <div class="form-grid">
        <div class="form-field">
          <label for="pet-name">Name</label>
          <input pInputText id="pet-name" [(ngModel)]="pet.name" name="name" required fluid>
        </div>
        <div class="form-field">
          <label for="pet-type">Type</label>
          <input pInputText id="pet-type" [(ngModel)]="pet.type" name="type" required fluid>
        </div>
        <div class="form-field">
          <label for="pet-breed">Breed</label>
          <input pInputText id="pet-breed" [(ngModel)]="pet.breed" name="breed" fluid>
        </div>
        <div class="form-field">
          <label for="pet-age">Age</label>
          <p-inputNumber inputId="pet-age" [(ngModel)]="pet.age" name="age" [min]="0" [showButtons]="true" styleClass="full-width" />
        </div>
        <div class="form-field">
          <label for="pet-price">Price</label>
          <p-inputNumber inputId="pet-price" [(ngModel)]="pet.price" name="price" mode="currency" currency="USD" [min]="0.01" styleClass="full-width" />
        </div>
        <div class="form-field">
          <label for="pet-stock">Stock</label>
          <p-inputNumber inputId="pet-stock" [(ngModel)]="pet.stock" name="stock" [min]="0" [showButtons]="true" styleClass="full-width" />
        </div>
        <div class="form-field">
          <label for="pet-category">Category</label>
          <p-select inputId="pet-category" class="full-width" [options]="categories" [(ngModel)]="pet.categoryId"
                    name="categoryId" optionLabel="name" optionValue="id" placeholder="None" [showClear]="true" />
        </div>
        <div class="form-field form-field--full">
          <label for="pet-image">Image URL</label>
          <input pInputText id="pet-image" [(ngModel)]="pet.imageUrl" name="imageUrl" fluid>
        </div>
        <div class="form-field form-field--full">
          <label for="pet-description">Description</label>
          <textarea pTextarea id="pet-description" [(ngModel)]="pet.description" name="description" rows="3" fluid></textarea>
        </div>
        </div>
        <div class="form-actions">
          <button pButton type="submit" [label]="isEdit ? 'Update' : 'Create'" [disabled]="petForm.invalid"></button>
          <a pButton outlined severity="secondary" label="Cancel" routerLink="/pets"></a>
        </div>
      </form>
    </p-card>
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
