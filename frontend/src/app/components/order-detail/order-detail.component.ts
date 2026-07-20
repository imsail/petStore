import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonModule, CardModule, SelectModule, TableModule, TagModule],
  template: `
    @if (order) {
      <h2>Order #{{ order.id }}</h2>
      <div class="detail-grid">
        <p-card header="Order Summary">
          <dl class="summary-list">
            <dt>Customer</dt><dd>{{ order.customerName }}</dd>
            <dt>Date</dt><dd>{{ order.orderDate | date:'medium' }}</dd>
            <dt>Status</dt><dd><p-tag [value]="order.status" [severity]="orderSeverity(order.status)" /></dd>
            <dt>Total</dt><dd>\${{ order.total }}</dd>
          </dl>
        </p-card>
        <p-card header="Update Status">
          <h5>Update Status</h5>
          <div class="toolbar-row">
            <p-select class="full-width" [options]="statusOptions" [(ngModel)]="newStatus" optionLabel="label" optionValue="value" />
            <button pButton label="Update" type="button" (click)="updateStatus()"></button>
          </div>
        </p-card>
      </div>
      <h4>Items</h4>
      <div class="table-wrap">
        <p-table [value]="order.items" [tableStyle]="{ 'min-width': '38rem' }">
          <ng-template #header>
          <tr><th>Pet</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
          </ng-template>
          <ng-template #body let-item>
            <tr>
              <td><a [routerLink]="['/pets', item.petId]">{{ item.petName }}</a></td>
              <td>{{ item.quantity }}</td>
              <td>\${{ item.price }}</td>
              <td>\${{ (item.price * item.quantity).toFixed(2) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
      <a pButton outlined severity="secondary" label="Back to Orders" routerLink="/orders"></a>
    }
  `
})
export class OrderDetailComponent implements OnInit {
  order?: Order;
  newStatus: OrderStatus = 'PENDING';
  readonly statusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

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
