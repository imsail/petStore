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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, CardModule, InputTextModule, MessageModule],
  template: `
    <p-card styleClass="auth-card">
      <ng-template #header><h2>Login</h2></ng-template>
      @if (error) {
        <p-message class="message-block" severity="error" [text]="error" />
      }
      <form (ngSubmit)="login()">
        <div class="form-field">
          <label for="login-email">Email</label>
          <input pInputText id="login-email" type="email" [(ngModel)]="email" name="email" required fluid>
        </div>
        <div class="form-field">
          <label for="login-password">Password</label>
          <input pInputText id="login-password" type="password" [(ngModel)]="password" name="password" required fluid>
        </div>
        <button pButton fluid type="submit" label="Login" [disabled]="!email || !password"></button>
      </form>
      <p class="auth-footer">Don't have an account? <a routerLink="/register">Register</a></p>
    </p-card>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.error = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/pets']),
      error: (err) => this.error = err.status === 401 ? 'Invalid email or password' : 'Login failed'
    });
  }
}
