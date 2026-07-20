import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';

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
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, CardModule, InputNumberModule, MessageModule, TableModule],
  template: `
    <h2>Inventory Dashboard</h2>

    @if (dashboard) {
      <div class="metric-grid">
        <p-card styleClass="metric-card"><strong>{{ dashboard.totalPets }}</strong><span>Total Pets</span></p-card>
        <p-card styleClass="metric-card metric-card--success"><strong>{{ dashboard.availablePets }}</strong><span>Available</span></p-card>
        <p-card styleClass="metric-card metric-card--warn"><strong>{{ dashboard.pendingPets }}</strong><span>Pending</span></p-card>
        <p-card styleClass="metric-card metric-card--danger"><strong>{{ dashboard.soldPets }}</strong><span>Sold</span></p-card>
      </div>

      @if (dashboard.lowStockPets.length > 0) {
        <h4>Low Stock Alerts ({{ dashboard.lowStockCount }})</h4>
        <div class="table-wrap">
          <p-table [value]="dashboard.lowStockPets" stripedRows [tableStyle]="{ 'min-width': '44rem' }">
            <ng-template #header>
            <tr><th>Pet</th><th>Type</th><th>Current Stock</th><th>Update Stock</th></tr>
            </ng-template>
            <ng-template #body let-pet>
              <tr>
                <td><a [routerLink]="['/pets', pet.id]">{{ pet.name }}</a></td>
                <td>{{ pet.type }}</td>
                <td><strong>{{ pet.stock }}</strong></td>
                <td>
                  <div class="stock-editor">
                    <p-inputNumber [(ngModel)]="stockUpdates[pet.id]" [min]="0" [showButtons]="true" />
                    <button pButton outlined size="small" label="Update" type="button" (click)="updateStock(pet.id)"></button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      } @else {
        <p-message severity="success" text="All pets are well stocked!" />
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
