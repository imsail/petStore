import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { Order } from '../../models/order.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, ButtonModule, CardModule,
    InputTextModule, MessageModule, TableModule, TagModule
  ],
  template: `
    <h2>My Profile</h2>

    @if (editing) {
      <p-card header="Edit Profile" styleClass="form-card">
          <form (ngSubmit)="saveProfile()">
            <div class="form-field">
              <label for="profile-name">Name</label>
              <input pInputText id="profile-name" [(ngModel)]="profile.name" name="name" required fluid>
            </div>
            <div class="form-field">
              <label for="profile-email">Email</label>
              <input pInputText id="profile-email" type="email" [(ngModel)]="profile.email" name="email" required fluid>
            </div>
            <div class="form-field">
              <label for="profile-phone">Phone</label>
              <input pInputText id="profile-phone" [(ngModel)]="profile.phone" name="phone" fluid>
            </div>
            <div class="form-field">
              <label for="profile-address">Address</label>
              <input pInputText id="profile-address" [(ngModel)]="profile.address" name="address" fluid>
            </div>
            <div class="form-actions">
              <button pButton type="submit" label="Save"></button>
              <button pButton outlined severity="secondary" type="button" label="Cancel" (click)="editing = false"></button>
            </div>
          </form>
      </p-card>
    } @else if (profile) {
      <p-card [header]="profile.name" styleClass="form-card">
        <dl class="summary-list">
          <dt>Email</dt><dd>{{ profile.email }}</dd>
          <dt>Phone</dt><dd>{{ profile.phone || 'N/A' }}</dd>
          <dt>Address</dt><dd>{{ profile.address || 'N/A' }}</dd>
        </dl>
        <ng-template #footer>
          <button pButton outlined type="button" label="Edit Profile" (click)="editing = true"></button>
        </ng-template>
      </p-card>
    }

    <h4>My Orders</h4>
    @if (orders.length === 0) {
      <p-message class="message-block" severity="info" text="No orders yet." />
      <a pButton outlined label="Browse pets" routerLink="/pets"></a>
    } @else {
      <div class="table-wrap">
        <p-table [value]="orders" [tableStyle]="{ 'min-width': '40rem' }">
          <ng-template #header>
          <tr>
            <th>Order #</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
          </ng-template>
          <ng-template #body let-order>
            <tr>
              <td><a [routerLink]="['/orders', order.id]">{{ order.id }}</a></td>
              <td>\${{ order.total }}</td>
              <td><p-tag [value]="order.status" [severity]="orderSeverity(order.status)" /></td>
              <td>{{ order.orderDate | date:'short' }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
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

  orderSeverity(status: string): 'secondary' | 'info' | 'warn' | 'success' | 'danger' {
    switch (status) {
      case 'PENDING': return 'warn';
      case 'CONFIRMED': return 'info';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  }
}
