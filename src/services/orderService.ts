import api from './api';
import type { Order } from '../types/types';

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
  // 1. පාරිභෝගිකයාට තමන්ගේ සියලුම ඇණවුම් ලබා ගැනීම
  async getOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  // 2. ID එක අනුව ඇණවුමක විස්තර ලබා ගැනීම
  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // 3. නව ඇණවුමක් සෑදීම
  async createOrder(orderData: CreateOrderPayload): Promise<Order> {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  // 4. ඇණවුමක් අවලංගු කිරීම
  async cancelOrder(id: string): Promise<void> {
    // Backend එකේ router.put('/:id/cancel') ඇති බැවින් මෙහි put භාවිතා කරයි
    await api.put(`/orders/${id}/cancel`);
  },

  /**
   * --- විකුණුම්කරු (Seller) සඳහා පමණි ---
   */

  // 5. Seller හට අදාළ සියලුම ඇණවුම් ලබා ගැනීම
  // Backend එකේ router.get('/seller/all') සමඟ ගැලපීමට URL එක වෙනස් කරන ලදී
  async getSellerOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders/seller/all');
    return response.data;
  },

  // 6. ඇණවුමක තත්ත්වය (Status) යාවත්කාලීන කිරීම
  // Backend එකේ router.patch('/:id/status') ඇති බැවින් මෙහි patch භාවිතා කරයි
  async updateOrderStatus(
    id: string,
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  ): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },
};