import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Shopping Cart</h2>

    @if (cartService.items().length === 0) {
      <div class="alert alert-info">Your cart is empty. <a routerLink="/pets">Browse pets</a></div>
    } @else {
      <table class="table">
        <thead>
          <tr>
            <th>Pet</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (item of cartService.items(); track item.pet.id) {
            <tr>
              <td>{{ item.pet.name }}</td>
              <td>\${{ item.pet.price }}</td>
              <td style="width: 120px">
                <input type="number" class="form-control form-control-sm" [ngModel]="item.quantity"
                       (ngModelChange)="cartService.updateQuantity(item.pet.id, $event)" min="1" [max]="item.pet.stock">
              </td>
              <td>\${{ (item.pet.price * item.quantity).toFixed(2) }}</td>
              <td><button class="btn btn-sm btn-outline-danger" (click)="cartService.removeFromCart(item.pet.id)">Remove</button></td>
            </tr>
          }
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-end fw-bold">Total:</td>
            <td class="fw-bold">\${{ cartService.total().toFixed(2) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div class="card p-3 mb-3">
        <h5>Checkout</h5>
        <div class="mb-3">
          <label class="form-label">Select Customer</label>
          <select class="form-select" [(ngModel)]="selectedCustomerId">
            <option [ngValue]="undefined">Choose a customer...</option>
            @for (c of customers; track c.id) {
              <option [ngValue]="c.id">{{ c.name }} ({{ c.email }})</option>
            }
          </select>
        </div>
        <button class="btn btn-success" [disabled]="!selectedCustomerId" (click)="checkout()">Place Order</button>
      </div>
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
    private router: Router
  ) {
    this.customerService.findAll().subscribe(c => this.customers = c);
  }

  checkout(): void {
    if (!this.selectedCustomerId) return;
    const items = this.cartService.items().map(item => ({
      petId: item.pet.id,
      quantity: item.quantity
    }));
    this.orderService.create({ customerId: this.selectedCustomerId, items }).subscribe(order => {
      this.cartService.clear();
      this.router.navigate(['/orders', order.id]);
    });
  }
}
