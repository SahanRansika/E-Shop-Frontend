export const APP_NAME = 'E-Shop';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_METHODS = {
  CARD: 'card',
  PAYHERE: 'payhere',
  CASH_ON_DELIVERY: 'cash_on_delivery',
} as const;

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'home', name: 'Home & Garden', icon: '🏠' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'toys', name: 'Toys', icon: '🧸' },
  { id: 'other', name: 'Other', icon: '📦' },
];

export const SHIPPING_COST = 10;
export const FREE_SHIPPING_THRESHOLD = 50;
export const TAX_RATE = 0.08; // 8%