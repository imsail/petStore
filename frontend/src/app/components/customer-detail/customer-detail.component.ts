import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { Order } from '../../models/order.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (customer) {
      <h2>{{ customer.name }}</h2>
      <div class="card mb-4">
        <div class="card-body">
          <p><strong>Email:</strong> {{ customer.email }}</p>
          <p><strong>Phone:</strong> {{ customer.phone }}</p>
          <p><strong>Address:</strong> {{ customer.address }}</p>
          <a class="btn btn-outline-primary" [routerLink]="['/customers', customer.id, 'edit']">Edit</a>
        </div>
      </div>

      <h4>Orders</h4>
      @if (orders.length === 0) {
        <p class="text-muted">No orders yet.</p>
      } @else {
        <table class="table table-striped">
          <thead>
            <tr><th>ID</th><th>Total</th><th>Status</th><th>Date</th><th></th></tr>
          </thead>
          <tbody>
            @for (o of orders; track o.id) {
              <tr>
                <td>{{ o.id }}</td>
                <td>\${{ o.total }}</td>
                <td><span class="badge bg-secondary">{{ o.status }}</span></td>
                <td>{{ o.orderDate | date:'short' }}</td>
                <td><a class="btn btn-sm btn-outline-primary" [routerLink]="['/orders', o.id]">View</a></td>
              </tr>
            }
          </tbody>
        </table>
      }
      <a class="btn btn-outline-secondary" routerLink="/customers">Back</a>
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
}
