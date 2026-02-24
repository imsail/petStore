import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthUser, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AuthUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');
  readonly isCustomer = computed(() => this._currentUser()?.role === 'CUSTOMER');

  constructor(private http: HttpClient) {
    this.checkSession();
  }

  login(request: LoginRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>('/api/auth/login', request).pipe(
      tap(user => this._currentUser.set(user))
    );
  }

  register(request: RegisterRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>('/api/auth/register', request);
  }

  logout(): Observable<unknown> {
    return this.http.post('/api/auth/logout', {}).pipe(
      tap(() => this._currentUser.set(null))
    );
  }

  checkSession(): void {
    this.http.get<AuthUser>('/api/auth/me').pipe(
      catchError(() => of(null))
    ).subscribe(user => this._currentUser.set(user));
  }
}
