import api from './api';
import type { CartItem } from '../types';

/**
 * Cart API response type
 */
export interface CartResponse {
  products: CartItem[];
  total?: number;
}

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    const response = await api.get<CartResponse>('/cart');
    return response.data.products ?? [];
  },

  async addToCart(
    productId: string,
    quantity: number
  ): Promise<CartResponse> {
    const response = await api.post<CartResponse>('/cart', {
      productId,
      quantity,
    });
    return response.data;
  },

  async updateQuantity(
    productId: string,
    quantity: number
  ): Promise<CartResponse> {
    const response = await api.put<CartResponse>(`/cart/${productId}`, {
      quantity,
    });
    return response.data;
  },

  async removeFromCart(productId: string): Promise<void> {
    await api.delete(`/cart/${productId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },
};
