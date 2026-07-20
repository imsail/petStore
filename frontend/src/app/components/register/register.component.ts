import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, CardModule, InputTextModule, MessageModule],
  template: `
    <p-card styleClass="auth-card">
      <ng-template #header><h2>Register</h2></ng-template>
      @if (error) {
        <p-message class="message-block" severity="error" [text]="error" />
      }
      <form (ngSubmit)="register()">
        <div class="form-field">
          <label for="register-name">Name</label>
          <input pInputText id="register-name" [(ngModel)]="name" name="name" required fluid>
        </div>
        <div class="form-field">
          <label for="register-email">Email</label>
          <input pInputText id="register-email" type="email" [(ngModel)]="email" name="email" required fluid>
        </div>
        <div class="form-field">
          <label for="register-password">Password</label>
          <input pInputText id="register-password" type="password" [(ngModel)]="password" name="password" required minlength="6" fluid>
        </div>
        <div class="form-field">
          <label for="register-phone">Phone</label>
          <input pInputText id="register-phone" [(ngModel)]="phone" name="phone" fluid>
        </div>
        <div class="form-field">
          <label for="register-address">Address</label>
          <input pInputText id="register-address" [(ngModel)]="address" name="address" fluid>
        </div>
        <button pButton fluid type="submit" label="Register" [disabled]="!name || !email || !password"></button>
      </form>
      <p class="auth-footer">Already have an account? <a routerLink="/login">Login</a></p>
    </p-card>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  phone = '';
  address = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.error = '';
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.error = err.error?.message || 'Registration failed'
    });
  }
}
