import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Customers</h2>
      <a class="btn btn-primary" routerLink="/customers/new">Add Customer</a>
    </div>
    <table class="table table-striped">
      <thead>
        <tr><th>Name</th><th>Email</th><th>Phone</th><th></th></tr>
      </thead>
      <tbody>
        @for (c of customers; track c.id) {
          <tr>
            <td><a [routerLink]="['/customers', c.id]">{{ c.name }}</a></td>
            <td>{{ c.email }}</td>
            <td>{{ c.phone }}</td>
            <td>
              <div class="d-flex gap-1">
                <a class="btn btn-sm btn-outline-primary" [routerLink]="['/customers', c.id, 'edit']">Edit</a>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteCustomer(c.id)">Delete</button>
              </div>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.customerService.findAll().subscribe(c => this.customers = c);
  }

  deleteCustomer(id: number): void {
    if (confirm('Delete this customer?')) {
      this.customerService.delete(id).subscribe(() => this.load());
    }
  }
}
