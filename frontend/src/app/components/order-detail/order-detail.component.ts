import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    @if (order) {
      <h2>Order #{{ order.id }}</h2>
      <div class="row">
        <div class="col-md-6">
          <p><strong>Customer:</strong> {{ order.customerName }}</p>
          <p><strong>Date:</strong> {{ order.orderDate | date:'medium' }}</p>
          <p><strong>Status:</strong> <span class="badge bg-secondary">{{ order.status }}</span></p>
          <p><strong>Total:</strong> \${{ order.total }}</p>
        </div>
        <div class="col-md-6">
          <h5>Update Status</h5>
          <div class="d-flex gap-2">
            <select class="form-select" [(ngModel)]="newStatus">
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button class="btn btn-primary" (click)="updateStatus()">Update</button>
          </div>
        </div>
      </div>
      <h5 class="mt-4">Items</h5>
      <table class="table">
        <thead>
          <tr><th>Pet</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          @for (item of order.items; track item.id) {
            <tr>
              <td><a [routerLink]="['/pets', item.petId]">{{ item.petName }}</a></td>
              <td>{{ item.quantity }}</td>
              <td>\${{ item.price }}</td>
              <td>\${{ (item.price * item.quantity).toFixed(2) }}</td>
            </tr>
          }
        </tbody>
      </table>
      <a class="btn btn-outline-secondary" routerLink="/orders">Back to Orders</a>
    }
  `
})
export class OrderDetailComponent implements OnInit {
  order?: Order;
  newStatus: OrderStatus = 'PENDING';

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.findById(id).subscribe(o => {
      this.order = o;
      this.newStatus = o.status;
    });
  }

  updateStatus(): void {
    if (this.order) {
      this.orderService.updateStatus(this.order.id, this.newStatus).subscribe(o => this.order = o);
    }
  }
}
