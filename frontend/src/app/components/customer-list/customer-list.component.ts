import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TableModule],
  template: `
    <div class="page-header">
      <h2>Customers</h2>
      <a pButton label="Add Customer" routerLink="/customers/new"></a>
    </div>
    <div class="table-wrap">
      <p-table [value]="customers" stripedRows [tableStyle]="{ 'min-width': '48rem' }">
        <ng-template #header>
        <tr><th>Name</th><th>Email</th><th>Phone</th><th></th></tr>
        </ng-template>
        <ng-template #body let-c>
          <tr>
            <td><a [routerLink]="['/customers', c.id]">{{ c.name }}</a></td>
            <td>{{ c.email }}</td>
            <td>{{ c.phone }}</td>
            <td class="table-actions">
              <div class="inline-actions">
                <a pButton outlined size="small" label="Edit" [routerLink]="['/customers', c.id, 'edit']"></a>
                <button pButton outlined size="small" severity="danger" label="Delete" type="button" (click)="deleteCustomer(c.id)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
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
