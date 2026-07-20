import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { Order } from '../../models/order.model';
import { CustomerService } from '../../services/customer.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, MessageModule, TableModule, TagModule],
  template: `
    @if (customer) {
      <h2>{{ customer.name }}</h2>
      <p-card styleClass="form-card">
        <dl class="summary-list">
          <dt>Email</dt><dd>{{ customer.email }}</dd>
          <dt>Phone</dt><dd>{{ customer.phone || 'N/A' }}</dd>
          <dt>Address</dt><dd>{{ customer.address || 'N/A' }}</dd>
        </dl>
        <ng-template #footer>
          <a pButton outlined label="Edit" [routerLink]="['/customers', customer.id, 'edit']"></a>
        </ng-template>
      </p-card>

      <h4>Orders</h4>
      @if (orders.length === 0) {
        <p-message class="message-block" severity="info" text="No orders yet." />
      } @else {
        <div class="table-wrap">
          <p-table [value]="orders" stripedRows [tableStyle]="{ 'min-width': '42rem' }">
            <ng-template #header>
            <tr><th>ID</th><th>Total</th><th>Status</th><th>Date</th><th></th></tr>
            </ng-template>
            <ng-template #body let-o>
              <tr>
                <td>{{ o.id }}</td>
                <td>\${{ o.total }}</td>
                <td><p-tag [value]="o.status" [severity]="orderSeverity(o.status)" /></td>
                <td>{{ o.orderDate | date:'short' }}</td>
                <td><a pButton outlined size="small" label="View" [routerLink]="['/orders', o.id]"></a></td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      }
      <a pButton outlined severity="secondary" label="Back" routerLink="/customers"></a>
    }
  `
})
export class CustomerDetailComponent implements OnInit {
  customer?: Customer;
  orders: Order[] = [];

  constructor(private route: ActivatedRoute, private customerService: CustomerService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.customerService.findById(id).subscribe(c => this.customer = c);
    this.customerService.getOrders(id).subscribe(o => this.orders = o);
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
