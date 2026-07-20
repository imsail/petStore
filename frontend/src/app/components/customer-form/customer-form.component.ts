import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerCreate } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, CardModule, InputTextModule, TextareaModule],
  template: `
    <h2>{{ isEdit ? 'Edit' : 'Add' }} Customer</h2>
    <p-card styleClass="form-card">
      <form (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <div class="form-field">
            <label for="customer-name">Name</label>
            <input pInputText id="customer-name" [(ngModel)]="customer.name" name="name" required fluid>
          </div>
          <div class="form-field">
            <label for="customer-email">Email</label>
            <input pInputText id="customer-email" type="email" [(ngModel)]="customer.email" name="email" required fluid>
          </div>
          <div class="form-field">
            <label for="customer-phone">Phone</label>
            <input pInputText id="customer-phone" [(ngModel)]="customer.phone" name="phone" fluid>
          </div>
          <div class="form-field form-field--full">
            <label for="customer-address">Address</label>
            <textarea pTextarea id="customer-address" [(ngModel)]="customer.address" name="address" rows="3" fluid></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button pButton type="submit" [label]="isEdit ? 'Update' : 'Create'"></button>
          <a pButton outlined severity="secondary" label="Cancel" routerLink="/customers"></a>
        </div>
      </form>
    </p-card>
  `
})
export class CustomerFormComponent implements OnInit {
  customer: CustomerCreate = { name: '', email: '', phone: '', address: '' };
  isEdit = false;
  private editId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = Number(id);
      this.customerService.findById(this.editId).subscribe(c => {
        this.customer = { name: c.name, email: c.email, phone: c.phone, address: c.address };
      });
    }
  }

  onSubmit(): void {
    const obs = this.isEdit
      ? this.customerService.update(this.editId!, this.customer)
      : this.customerService.create(this.customer);
    obs.subscribe(() => this.router.navigate(['/customers']));
  }
}
