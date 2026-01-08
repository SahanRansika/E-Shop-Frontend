import api from './api';
import type { Product } from '../types/types';

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
    const response = await api.post('/products', productData);
    return response.data;
  },
  async update(id: string, productData: FormData | Partial<Product>): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};