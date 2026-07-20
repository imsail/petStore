import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pet } from '../../models/pet.model';
import { PetService } from '../../services/pet.service';
import { CartService } from '../../services/cart.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, TagModule],
  template: `
    @if (pet) {
      <h2>{{ pet.name }}</h2>
      <p-card styleClass="form-card" [subheader]="pet.type + ' · ' + (pet.breed || 'Mixed breed')">
          <p-tag [value]="pet.status" [severity]="petSeverity(pet.status)" />
          <dl class="summary-list pet-summary">
            <dt>Age</dt><dd>{{ pet.age }}</dd>
            <dt>Price</dt><dd>\${{ pet.price }}</dd>
            <dt>Stock</dt><dd>{{ pet.stock }}</dd>
            <dt>Category</dt><dd>{{ pet.category.name || 'None' }}</dd>
            <dt>Description</dt><dd>{{ pet.description || 'No description available.' }}</dd>
          </dl>
          <ng-template #footer>
          <div class="form-actions">
            @if (pet.status === 'AVAILABLE' && pet.stock > 0) {
              <button pButton severity="success" label="Add to Cart" type="button" (click)="addToCart()"></button>
            }
            <a pButton outlined label="Edit" [routerLink]="['/pets', pet.id, 'edit']"></a>
            <button pButton outlined severity="danger" label="Delete" type="button" (click)="deletePet()"></button>
            <a pButton outlined severity="secondary" label="Back" routerLink="/pets"></a>
          </div>
          </ng-template>
      </p-card>
    }
  `,
  styles: [`.pet-summary { margin-top: 1.5rem; }`]
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

  petSeverity(status: string): 'success' | 'warn' | 'danger' {
    if (status === 'AVAILABLE') return 'success';
    if (status === 'PENDING') return 'warn';
    return 'danger';
  }
}
