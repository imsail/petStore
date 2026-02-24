export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  customerId: number | null;
  customerName: string | null;
}
