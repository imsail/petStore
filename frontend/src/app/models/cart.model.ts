import { Pet } from './pet.model';

export interface CartItem {
  pet: Pet;
  quantity: number;
}
