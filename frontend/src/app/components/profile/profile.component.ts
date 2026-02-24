import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>My Profile</h2>

    @if (editing) {
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Edit Profile</h5>
          <form (ngSubmit)="saveProfile()">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" [(ngModel)]="profile.name" name="name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" [(ngModel)]="profile.email" name="email" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Phone</label>
              <input type="text" class="form-control" [(ngModel)]="profile.phone" name="phone">
            </div>
            <div class="mb-3">
              <label class="form-label">Address</label>
              <input type="text" class="form-control" [(ngModel)]="profile.address" name="address">
            </div>
            <button type="submit" class="btn btn-primary me-2">Save</button>
            <button type="button" class="btn btn-secondary" (click)="editing = false">Cancel</button>
          </form>
        </div>
      </div>
    } @else if (profile) {
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">{{ profile.name }}</h5>
          <p><strong>Email:</strong> {{ profile.email }}</p>
          <p><strong>Phone:</strong> {{ profile.phone || 'N/A' }}</p>
          <p><strong>Address:</strong> {{ profile.address || 'N/A' }}</p>
          <button class="btn btn-outline-primary" (click)="editing = true">Edit Profile</button>
        </div>
      </div>
    }

    <h4>My Orders</h4>
    @if (orders.length === 0) {
      <div class="alert alert-info">No orders yet. <a routerLink="/pets">Browse pets</a></div>
    } @else {
      <table class="table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          @for (order of orders; track order.id) {
            <tr>
              <td><a [routerLink]="['/orders', order.id]">{{ order.id }}</a></td>
              <td>\${{ order.total }}</td>
              <td><span class="badge" [class]="statusClass(order.status)">{{ order.status }}</span></td>
              <td>{{ order.orderDate | date:'short' }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `
})
export class ProfileComponent implements OnInit {
  profile: Customer = { id: 0, name: '', email: '', phone: '', address: '' };
  orders: Order[] = [];
  editing = false;

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit(): void {
    this.http.get<Customer>('/api/me/profile').subscribe(p => this.profile = p);
    this.http.get<Order[]>('/api/me/orders').subscribe(o => this.orders = o);
  }

  saveProfile(): void {
    this.http.put<Customer>('/api/me/profile', {
      name: this.profile.name,
      email: this.profile.email,
      phone: this.profile.phone,
      address: this.profile.address
    }).subscribe(p => {
      this.profile = p;
      this.editing = false;
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'CONFIRMED': return 'bg-info';
      case 'SHIPPED': return 'bg-primary';
      case 'DELIVERED': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
