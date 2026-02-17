import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/pets">Pet Store</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/pets" routerLinkActive="active">Pets</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categories" routerLinkActive="active">Categories</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/customers" routerLinkActive="active">Customers</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/orders" routerLinkActive="active">Orders</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/inventory" routerLinkActive="active">Inventory</a>
            </li>
          </ul>
          <a class="btn btn-outline-light" routerLink="/cart">
            Cart
            @if (cartService.itemCount() > 0) {
              <span class="badge bg-danger ms-1">{{ cartService.itemCount() }}</span>
            }
          </a>
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent {
  constructor(public cartService: CartService) {}
}
