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
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, ButtonModule, CardModule,
    InputTextModule, PaginatorModule, SelectModule, TagModule
  ],
  template: `
    <div class="page-header">
      <h2>Pets</h2>
      <a pButton label="Add Pet" routerLink="/pets/new"></a>
    </div>

    <div class="toolbar-row">
        <input pInputText type="search" placeholder="Search pets..."
               [(ngModel)]="searchQuery" (keyup.enter)="onSearch()">
        <p-select [options]="categories" [(ngModel)]="selectedCategoryId" optionLabel="name" optionValue="id"
                  placeholder="All Categories" [showClear]="true" (onChange)="onCategoryChange()" />
        <button pButton outlined label="Search" type="button" (click)="onSearch()"></button>
    </div>

    <div class="card-grid">
      @for (pet of pets; track pet.id) {
          <p-card styleClass="pet-card" [header]="pet.name" [subheader]="pet.type + ' · ' + (pet.breed || 'Mixed breed')">
            <div class="pet-card-content">
              <p>{{ pet.description || 'No description available.' }}</p>
              <div class="price-row">
                <span class="price">\${{ pet.price }}</span>
                <p-tag [value]="pet.status" [severity]="petSeverity(pet.status)" />
              </div>
              <p class="muted small-text">Stock: {{ pet.stock }}</p>
            </div>
            <ng-template #footer>
              <div class="inline-actions">
              <a pButton outlined size="small" label="Details" [routerLink]="['/pets', pet.id]"></a>
              @if (pet.status === 'AVAILABLE' && pet.stock > 0) {
                <button pButton size="small" severity="success" label="Add to Cart" type="button" (click)="addToCart(pet)"></button>
              }
              </div>
            </ng-template>
          </p-card>
      }
    </div>

    @if (totalPages > 1) {
      <p-paginator [first]="currentPage * pageSize" [rows]="pageSize" [totalRecords]="totalRecords"
                   [showCurrentPageReport]="true" currentPageReportTemplate="{first} - {last} of {totalRecords}"
                   (onPageChange)="onPageChange($event)" />
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
  totalRecords = 0;
  readonly pageSize = 12;

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
    this.petService.findAll(this.currentPage, this.pageSize, this.selectedCategoryId).subscribe(res => this.handleResponse(res));
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadCurrentFilter();
  }

  onCategoryChange(): void {
    this.currentPage = 0;
    this.loadCurrentFilter();
  }

  onPageChange(event: { page?: number }): void {
    this.currentPage = event.page ?? 0;
    this.loadCurrentFilter();
  }

  private loadCurrentFilter(): void {
    if (this.searchQuery.trim()) {
      this.petService.search(this.searchQuery, this.currentPage, this.pageSize).subscribe(res => this.handleResponse(res));
    } else {
      this.loadPets();
    }
  }

  addToCart(pet: Pet): void {
    this.cartService.addToCart(pet);
  }

  private handleResponse(res: PagedResponse<Pet>): void {
    this.pets = res.content;
    this.totalPages = res.totalPages;
    this.totalRecords = res.totalElements;
  }

  petSeverity(status: string): 'success' | 'warn' | 'danger' {
    if (status === 'AVAILABLE') return 'success';
    if (status === 'PENDING') return 'warn';
    return 'danger';
  }
}
