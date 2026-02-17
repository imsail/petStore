import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/pets', pathMatch: 'full' },
  { path: 'pets', loadComponent: () => import('./components/pet-list/pet-list.component').then(m => m.PetListComponent) },
  { path: 'pets/new', loadComponent: () => import('./components/pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'pets/:id', loadComponent: () => import('./components/pet-detail/pet-detail.component').then(m => m.PetDetailComponent) },
  { path: 'pets/:id/edit', loadComponent: () => import('./components/pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'categories', loadComponent: () => import('./components/category-list/category-list.component').then(m => m.CategoryListComponent) },
  { path: 'categories/new', loadComponent: () => import('./components/category-form/category-form.component').then(m => m.CategoryFormComponent) },
  { path: 'categories/:id/edit', loadComponent: () => import('./components/category-form/category-form.component').then(m => m.CategoryFormComponent) },
  { path: 'customers', loadComponent: () => import('./components/customer-list/customer-list.component').then(m => m.CustomerListComponent) },
  { path: 'customers/new', loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent) },
  { path: 'customers/:id', loadComponent: () => import('./components/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent) },
  { path: 'customers/:id/edit', loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent) },
  { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent) },
  { path: 'orders', loadComponent: () => import('./components/order-list/order-list.component').then(m => m.OrderListComponent) },
  { path: 'orders/:id', loadComponent: () => import('./components/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
  { path: 'inventory', loadComponent: () => import('./components/inventory-dashboard/inventory-dashboard.component').then(m => m.InventoryDashboardComponent) },
];
