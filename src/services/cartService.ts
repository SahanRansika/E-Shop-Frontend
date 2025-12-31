import api from './api';
import type { CartItem } from '../types/types';

/**
 * Cart API response type
 */
export interface CartResponse {
  products: CartItem[];
  total?: number;
}

export const cartService = {
  // Cart එක load කරන function එක
  async getCart(): Promise<CartItem[]> {
    const response = await api.get<CartResponse>('/cart', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.products ?? [];
  },

  // Cart එකට product එකක් add කරන function එක
  async addToCart(
    productId: string,
    quantity: number
  ): Promise<CartResponse> {
    const response = await api.post<CartResponse>(
      '/cart',
      {
        productId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Cart එකේ quantity update කරන function එක
  async updateQuantity(
    productId: string,
    quantity: number
  ): Promise<CartResponse> {
    const response = await api.put<CartResponse>(
      `/cart/${productId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Cart එකේ product එක remove කරන function එක
  async removeFromCart(productId: string): Promise<void> {
    await api.delete(`/cart/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  // Cart එක clear කරන function එක
  async clearCart(): Promise<void> {
    await api.delete('/cart', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};
