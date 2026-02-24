import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/pets', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'pets', loadComponent: () => import('./components/pet-list/pet-list.component').then(m => m.PetListComponent) },
  { path: 'pets/new', loadComponent: () => import('./components/pet-form/pet-form.component').then(m => m.PetFormComponent), canActivate: [adminGuard] },
  { path: 'pets/:id', loadComponent: () => import('./components/pet-detail/pet-detail.component').then(m => m.PetDetailComponent) },
  { path: 'pets/:id/edit', loadComponent: () => import('./components/pet-form/pet-form.component').then(m => m.PetFormComponent), canActivate: [adminGuard] },
  { path: 'categories', loadComponent: () => import('./components/category-list/category-list.component').then(m => m.CategoryListComponent) },
  { path: 'categories/new', loadComponent: () => import('./components/category-form/category-form.component').then(m => m.CategoryFormComponent), canActivate: [adminGuard] },
  { path: 'categories/:id/edit', loadComponent: () => import('./components/category-form/category-form.component').then(m => m.CategoryFormComponent), canActivate: [adminGuard] },
  { path: 'customers', loadComponent: () => import('./components/customer-list/customer-list.component').then(m => m.CustomerListComponent), canActivate: [adminGuard] },
  { path: 'customers/new', loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent), canActivate: [adminGuard] },
  { path: 'customers/:id', loadComponent: () => import('./components/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent), canActivate: [adminGuard] },
  { path: 'customers/:id/edit', loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent), canActivate: [adminGuard] },
  { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent), canActivate: [authGuard] },
  { path: 'orders', loadComponent: () => import('./components/order-list/order-list.component').then(m => m.OrderListComponent), canActivate: [adminGuard] },
  { path: 'orders/:id', loadComponent: () => import('./components/order-detail/order-detail.component').then(m => m.OrderDetailComponent), canActivate: [authGuard] },
  { path: 'inventory', loadComponent: () => import('./components/inventory-dashboard/inventory-dashboard.component').then(m => m.InventoryDashboardComponent), canActivate: [adminGuard] },
];
