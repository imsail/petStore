import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Pet } from '../../models/pet.model';
import { Category } from '../../models/category.model';
import { PagedResponse } from '../../models/paged-response.model';
import { PetService } from '../../services/pet.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Pets</h2>
      <a class="btn btn-primary" routerLink="/pets/new">Add Pet</a>
    </div>

    <div class="row mb-3">
      <div class="col-md-4">
        <input type="text" class="form-control" placeholder="Search pets..."
               [(ngModel)]="searchQuery" (keyup.enter)="onSearch()">
      </div>
      <div class="col-md-3">
        <select class="form-select" [(ngModel)]="selectedCategoryId" (change)="loadPets()">
          <option [ngValue]="undefined">All Categories</option>
          @for (cat of categories; track cat.id) {
            <option [ngValue]="cat.id">{{ cat.name }}</option>
          }
        </select>
      </div>
    </div>

    <div class="row">
      @for (pet of pets; track pet.id) {
        <div class="col-md-4 col-lg-3 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ pet.name }}</h5>
              <p class="card-text text-muted">{{ pet.type }} - {{ pet.breed }}</p>
              <p class="card-text">{{ pet.description }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold text-primary">\${{ pet.price }}</span>
                <span class="badge" [class]="'badge-' + pet.status.toLowerCase()">{{ pet.status }}</span>
              </div>
              <p class="text-muted small mt-1">Stock: {{ pet.stock }}</p>
            </div>
            <div class="card-footer d-flex gap-2">
              <a class="btn btn-sm btn-outline-primary" [routerLink]="['/pets', pet.id]">Details</a>
              @if (pet.status === 'AVAILABLE' && pet.stock > 0) {
                <button class="btn btn-sm btn-success" (click)="addToCart(pet)">Add to Cart</button>
              }
            </div>
          </div>
        </div>
      }
    </div>

    @if (totalPages > 1) {
      <nav>
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="currentPage === 0">
            <a class="page-link" (click)="goToPage(currentPage - 1)">Previous</a>
          </li>
          @for (p of pageNumbers; track p) {
            <li class="page-item" [class.active]="p === currentPage">
              <a class="page-link" (click)="goToPage(p)">{{ p + 1 }}</a>
            </li>
          }
          <li class="page-item" [class.disabled]="currentPage === totalPages - 1">
            <a class="page-link" (click)="goToPage(currentPage + 1)">Next</a>
          </li>
        </ul>
      </nav>
    }
  `
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  categories: Category[] = [];
  searchQuery = '';
  selectedCategoryId?: number;
  currentPage = 0;
  totalPages = 0;
  pageNumbers: number[] = [];

  constructor(
    private petService: PetService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.categoryService.findAll().subscribe(cats => this.categories = cats);
    this.loadPets();
  }

  loadPets(): void {
    this.petService.findAll(this.currentPage, 12, this.selectedCategoryId).subscribe(res => this.handleResponse(res));
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.petService.search(this.searchQuery, this.currentPage).subscribe(res => this.handleResponse(res));
    } else {
      this.loadPets();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadPets();
  }

  addToCart(pet: Pet): void {
    this.cartService.addToCart(pet);
  }

  private handleResponse(res: PagedResponse<Pet>): void {
    this.pets = res.content;
    this.totalPages = res.totalPages;
    this.pageNumbers = Array.from({ length: res.totalPages }, (_, i) => i);
  }
}
