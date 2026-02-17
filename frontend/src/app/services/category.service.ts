import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly url = '/api/categories';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  findById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.url, category);
  }

  update(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.url}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
