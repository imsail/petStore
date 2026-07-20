import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BadgeModule, ButtonModule, ToolbarModule],
  template: `
    <header>
      <p-toolbar styleClass="app-header">
        <ng-template #start>
          <nav class="header-nav" aria-label="Main navigation">
            <a class="brand" routerLink="/pets">Pet Store</a>
            <a pButton text label="Pets" routerLink="/pets" routerLinkActive="active-link"></a>
            <a pButton text label="Categories" routerLink="/categories" routerLinkActive="active-link"></a>
            @if (authService.isAdmin()) {
              <a pButton text label="Customers" routerLink="/customers" routerLinkActive="active-link"></a>
              <a pButton text label="Orders" routerLink="/orders" routerLinkActive="active-link"></a>
              <a pButton text label="Inventory" routerLink="/inventory" routerLinkActive="active-link"></a>
            }
          </nav>
        </ng-template>
        <ng-template #end>
          <div class="header-actions">
            @if (authService.isLoggedIn()) {
              <a pButton outlined routerLink="/cart">
                <span pButtonLabel>Cart</span>
                @if (cartService.itemCount() > 0) {
                  <p-badge [value]="cartService.itemCount().toString()" severity="danger" />
                }
              </a>
              @if (authService.isCustomer()) {
                <a pButton outlined label="Profile" routerLink="/profile"></a>
              }
              <span class="user-email">{{ authService.currentUser()?.email }}</span>
              <button pButton outlined label="Logout" type="button" (click)="logout()"></button>
            } @else {
              <a pButton outlined label="Login" routerLink="/login"></a>
              <a pButton label="Register" routerLink="/register"></a>
            }
          </div>
        </ng-template>
      </p-toolbar>
    </header>
  `,
  styles: [`
    :host { display: block; }
    :host ::ng-deep .app-header { border-radius: 0; border-width: 0 0 1px; padding: 0.75rem max(1rem, calc((100vw - 1200px) / 2)); }
    :host ::ng-deep .app-header .p-toolbar-start { flex: 1 1 auto; }
    .header-nav, .header-actions { display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; }
    .brand { color: var(--p-primary-color); font-size: 1.25rem; font-weight: 800; margin-right: 0.75rem; }
    .brand:hover { text-decoration: none; }
    .user-email { color: var(--p-text-muted-color); font-size: 0.875rem; padding: 0 0.35rem; }
    :host ::ng-deep .active-link { background: var(--p-primary-50); }
    @media (max-width: 800px) {
      :host ::ng-deep .app-header { align-items: flex-start; gap: 0.75rem; }
      :host ::ng-deep .app-header .p-toolbar-end { width: 100%; }
      .header-actions { width: 100%; }
      .user-email { margin-left: auto; }
    }
  `]
})
export class HeaderComponent {
  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
