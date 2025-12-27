import api from './api';
import type{ Product } from '../types';

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async create(productData: FormData): Promise<Product> {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};