import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomerCreate } from '../models/customer.model';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly url = '/api/customers';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url);
  }

  findById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/${id}`);
  }

  create(customer: CustomerCreate): Observable<Customer> {
    return this.http.post<Customer>(this.url, customer);
  }

  update(id: number, customer: CustomerCreate): Observable<Customer> {
    return this.http.put<Customer>(`${this.url}/${id}`, customer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getOrders(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/${id}/orders`);
  }
}
