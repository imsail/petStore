export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  petId: number;
  petName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  total: number;
  status: OrderStatus;
  orderDate: string;
  items: OrderItem[];
}

export interface OrderItemCreate {
  petId: number;
  quantity: number;
}

export interface OrderCreate {
  customerId: number;
  items: OrderItemCreate[];
}
