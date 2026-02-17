import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Orders</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        @for (order of orders; track order.id) {
          <tr>
            <td>{{ order.id }}</td>
            <td>{{ order.customerName }}</td>
            <td>\${{ order.total }}</td>
            <td><span class="badge bg-secondary">{{ order.status }}</span></td>
            <td>{{ order.orderDate | date:'short' }}</td>
            <td><a class="btn btn-sm btn-outline-primary" [routerLink]="['/orders', order.id]">View</a></td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.findAll().subscribe(o => this.orders = o);
  }
}
