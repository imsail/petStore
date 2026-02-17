import { Category } from './category.model';

export type PetStatus = 'AVAILABLE' | 'PENDING' | 'SOLD';

export interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  price: number;
  status: PetStatus;
  imageUrl: string;
  description: string;
  stock: number;
  category: Category;
}

export interface PetCreate {
  name: string;
  type: string;
  breed: string;
  age: number;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
  categoryId: number | null;
}
