import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pet } from '../../models/pet.model';
import { PetService } from '../../services/pet.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (pet) {
      <div class="row">
        <div class="col-md-8">
          <h2>{{ pet.name }}</h2>
          <span class="badge mb-3" [class]="'badge-' + pet.status.toLowerCase()">{{ pet.status }}</span>
          <table class="table">
            <tr><th>Type</th><td>{{ pet.type }}</td></tr>
            <tr><th>Breed</th><td>{{ pet.breed }}</td></tr>
            <tr><th>Age</th><td>{{ pet.age }}</td></tr>
            <tr><th>Price</th><td>\${{ pet.price }}</td></tr>
            <tr><th>Stock</th><td>{{ pet.stock }}</td></tr>
            <tr><th>Category</th><td>{{ pet.category?.name }}</td></tr>
            <tr><th>Description</th><td>{{ pet.description }}</td></tr>
          </table>
          <div class="d-flex gap-2">
            @if (pet.status === 'AVAILABLE' && pet.stock > 0) {
              <button class="btn btn-success" (click)="addToCart()">Add to Cart</button>
            }
            <a class="btn btn-outline-primary" [routerLink]="['/pets', pet.id, 'edit']">Edit</a>
            <button class="btn btn-outline-danger" (click)="deletePet()">Delete</button>
            <a class="btn btn-outline-secondary" routerLink="/pets">Back</a>
          </div>
        </div>
      </div>
    }
  `
})
export class PetDetailComponent implements OnInit {
  pet?: Pet;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.petService.findById(id).subscribe(pet => this.pet = pet);
  }

  addToCart(): void {
    if (this.pet) this.cartService.addToCart(this.pet);
  }

  deletePet(): void {
    if (this.pet && confirm('Delete this pet?')) {
      this.petService.delete(this.pet.id).subscribe(() => this.router.navigate(['/pets']));
    }
  }
}
