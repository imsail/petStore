import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, ButtonModule, CardModule,
    InputNumberModule, MessageModule, SelectModule, TableModule
  ],
  template: `
    <h2>Shopping Cart</h2>

    @if (cartService.items().length === 0) {
      <p-message class="message-block" severity="info" text="Your cart is empty." />
      <a pButton outlined label="Browse pets" routerLink="/pets"></a>
    } @else {
      <div class="table-wrap">
        <p-table [value]="cartService.items()" [tableStyle]="{ 'min-width': '48rem' }">
          <ng-template #header>
          <tr>
            <th>Pet</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
          </ng-template>
          <ng-template #body let-item>
            <tr>
              <td>{{ item.pet.name }}</td>
              <td>\${{ item.pet.price }}</td>
              <td>
                <p-inputNumber [ngModel]="item.quantity" (ngModelChange)="cartService.updateQuantity(item.pet.id, $event)"
                               [min]="1" [max]="item.pet.stock" [showButtons]="true" size="small" />
              </td>
              <td>\${{ (item.pet.price * item.quantity).toFixed(2) }}</td>
              <td><button pButton outlined size="small" severity="danger" label="Remove" type="button" (click)="cartService.removeFromCart(item.pet.id)"></button></td>
            </tr>
          </ng-template>
          <ng-template #footer>
          <tr>
            <td colspan="3"><strong>Total:</strong></td>
            <td><strong>\${{ cartService.total().toFixed(2) }}</strong></td>
            <td></td>
          </tr>
          </ng-template>
        </p-table>
      </div>

      <p-card header="Checkout" styleClass="form-card">
        @if (authService.isAdmin()) {
          <div class="form-field">
            <label for="checkout-customer">Select Customer</label>
            <p-select inputId="checkout-customer" class="full-width" [options]="customers" [(ngModel)]="selectedCustomerId"
                      optionLabel="name" optionValue="id" placeholder="Choose a customer...">
              <ng-template #selectedItem let-customer>{{ customer.name }} ({{ customer.email }})</ng-template>
              <ng-template #item let-customer>{{ customer.name }} ({{ customer.email }})</ng-template>
            </p-select>
          </div>
          <button pButton severity="success" label="Place Order" type="button" [disabled]="!selectedCustomerId" (click)="checkout()"></button>
        } @else {
          <p>Ordering as: <strong>{{ authService.currentUser()?.customerName }}</strong></p>
          <button pButton severity="success" label="Place Order" type="button" (click)="checkout()"></button>
        }
      </p-card>
    }
  `
})
export class CartComponent {
  customers: Customer[] = [];
  selectedCustomerId?: number;

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private customerService: CustomerService,
    public authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isAdmin()) {
      this.customerService.findAll().subscribe(c => this.customers = c);
    }
  }

  checkout(): void {
    const customerId = this.authService.isAdmin()
      ? this.selectedCustomerId
      : this.authService.currentUser()?.customerId;

    if (!customerId) return;

    const items = this.cartService.items().map(item => ({
      petId: item.pet.id,
      quantity: item.quantity
    }));
    this.orderService.create({ customerId, items }).subscribe(order => {
      this.cartService.clear();
      this.router.navigate(['/orders', order.id]);
    });
  }
}
