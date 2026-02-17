import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet, PetCreate, PetStatus } from '../models/pet.model';
import { PagedResponse } from '../models/paged-response.model';

@Injectable({ providedIn: 'root' })
export class PetService {
  private readonly url = '/api/pets';

  constructor(private http: HttpClient) {}

  findAll(page = 0, size = 12, categoryId?: number, status?: PetStatus): Observable<PagedResponse<Pet>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (categoryId) params = params.set('categoryId', categoryId);
    if (status) params = params.set('status', status);
    return this.http.get<PagedResponse<Pet>>(this.url, { params });
  }

  findById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.url}/${id}`);
  }

  search(query: string, page = 0, size = 12): Observable<PagedResponse<Pet>> {
    const params = new HttpParams().set('q', query).set('page', page).set('size', size);
    return this.http.get<PagedResponse<Pet>>(`${this.url}/search`, { params });
  }

  create(pet: PetCreate): Observable<Pet> {
    return this.http.post<Pet>(this.url, pet);
  }

  update(id: number, pet: PetCreate): Observable<Pet> {
    return this.http.put<Pet>(`${this.url}/${id}`, pet);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
