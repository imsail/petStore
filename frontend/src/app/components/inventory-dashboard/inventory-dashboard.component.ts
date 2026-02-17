import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface InventoryDashboard {
  totalPets: number;
  availablePets: number;
  pendingPets: number;
  soldPets: number;
  lowStockCount: number;
  lowStockPets: any[];
}

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Inventory Dashboard</h2>

    @if (dashboard) {
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-center bg-primary text-white">
            <div class="card-body">
              <h3>{{ dashboard.totalPets }}</h3>
              <p class="mb-0">Total Pets</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center bg-success text-white">
            <div class="card-body">
              <h3>{{ dashboard.availablePets }}</h3>
              <p class="mb-0">Available</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center bg-warning">
            <div class="card-body">
              <h3>{{ dashboard.pendingPets }}</h3>
              <p class="mb-0">Pending</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center bg-danger text-white">
            <div class="card-body">
              <h3>{{ dashboard.soldPets }}</h3>
              <p class="mb-0">Sold</p>
            </div>
          </div>
        </div>
      </div>

      @if (dashboard.lowStockPets.length > 0) {
        <h4 class="text-warning">Low Stock Alerts ({{ dashboard.lowStockCount }})</h4>
        <table class="table table-striped">
          <thead>
            <tr><th>Pet</th><th>Type</th><th>Current Stock</th><th>Update Stock</th></tr>
          </thead>
          <tbody>
            @for (pet of dashboard.lowStockPets; track pet.id) {
              <tr>
                <td><a [routerLink]="['/pets', pet.id]">{{ pet.name }}</a></td>
                <td>{{ pet.type }}</td>
                <td><span class="text-danger fw-bold">{{ pet.stock }}</span></td>
                <td>
                  <div class="input-group input-group-sm" style="width: 180px">
                    <input type="number" class="form-control" [(ngModel)]="stockUpdates[pet.id]" min="0">
                    <button class="btn btn-outline-primary" (click)="updateStock(pet.id)">Update</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="alert alert-success">All pets are well stocked!</div>
      }
    }
  `
})
export class InventoryDashboardComponent implements OnInit {
  dashboard?: InventoryDashboard;
  stockUpdates: Record<number, number> = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.http.get<InventoryDashboard>('/api/inventory').subscribe(d => {
      this.dashboard = d;
      d.lowStockPets.forEach((p: any) => this.stockUpdates[p.id] = p.stock);
    });
  }

  updateStock(petId: number): void {
    this.http.patch('/api/inventory/pets/' + petId + '/stock', { stock: this.stockUpdates[petId] })
      .subscribe(() => this.load());
  }
}
