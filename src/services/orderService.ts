import api from './api';
import type { Order } from '../types';

/**
 * Address type (adjust fields if backend differs)
 */
export interface OrderAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country?: string;
}

export interface CreateOrderPayload {
  products: Array<{
    product: string;
    quantity: number;
  }>;
  total: number;
  address: OrderAddress;
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async createOrder(orderData: CreateOrderPayload): Promise<Order> {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  async cancelOrder(id: string): Promise<void> {
    await api.put(`/orders/${id}/cancel`);
  },

  // For sellers
  async getSellerOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders/seller');
    return response.data;
  },

  async updateOrderStatus(
    id: string,
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  ): Promise<Order> {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },
};
