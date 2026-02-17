import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderCreate } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly url = '/api/orders';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }

  findById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  create(order: OrderCreate): Observable<Order> {
    return this.http.post<Order>(this.url, order);
  }

  updateStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.url}/${id}/status`, { status });
  }
}
