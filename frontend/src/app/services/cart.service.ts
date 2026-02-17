import { Injectable, signal, computed } from '@angular/core';
import { Pet } from '../models/pet.model';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly itemCount = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));
  readonly total = computed(() => this._items().reduce((sum, item) => sum + item.pet.price * item.quantity, 0));

  addToCart(pet: Pet, quantity = 1): void {
    const current = this._items();
    const existing = current.find(item => item.pet.id === pet.id);
    if (existing) {
      this._items.set(current.map(item =>
        item.pet.id === pet.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      this._items.set([...current, { pet, quantity }]);
    }
  }

  updateQuantity(petId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(petId);
      return;
    }
    this._items.set(this._items().map(item =>
      item.pet.id === petId ? { ...item, quantity } : item
    ));
  }

  removeFromCart(petId: number): void {
    this._items.set(this._items().filter(item => item.pet.id !== petId));
  }

  clear(): void {
    this._items.set([]);
  }
}
