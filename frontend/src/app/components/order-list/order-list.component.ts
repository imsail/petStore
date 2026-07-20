import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TableModule, TagModule],
  template: `
    <h2>Orders</h2>
    <div class="table-wrap">
      <p-table [value]="orders" stripedRows [tableStyle]="{ 'min-width': '52rem' }">
        <ng-template #header>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
          <th></th>
        </tr>
        </ng-template>
        <ng-template #body let-order>
          <tr>
            <td>{{ order.id }}</td>
            <td>{{ order.customerName }}</td>
            <td>\${{ order.total }}</td>
            <td><p-tag [value]="order.status" [severity]="orderSeverity(order.status)" /></td>
            <td>{{ order.orderDate | date:'short' }}</td>
            <td><a pButton outlined size="small" label="View" [routerLink]="['/orders', order.id]"></a></td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.findAll().subscribe(o => this.orders = o);
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
