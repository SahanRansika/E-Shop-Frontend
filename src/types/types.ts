export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
  seller: {
    _id: string;
    name: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}