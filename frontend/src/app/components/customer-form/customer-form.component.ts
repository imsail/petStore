import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerCreate } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>{{ isEdit ? 'Edit' : 'Add' }} Customer</h2>
    <form (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" [(ngModel)]="customer.name" name="name" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" [(ngModel)]="customer.email" name="email" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Phone</label>
        <input type="text" class="form-control" [(ngModel)]="customer.phone" name="phone">
      </div>
      <div class="mb-3">
        <label class="form-label">Address</label>
        <textarea class="form-control" [(ngModel)]="customer.address" name="address" rows="3"></textarea>
      </div>
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Create' }}</button>
        <a class="btn btn-outline-secondary" routerLink="/customers">Cancel</a>
      </div>
    </form>
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
