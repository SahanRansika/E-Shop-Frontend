import api from './api';
import type { Product } from '../types/types';

export const productService = {
  // සියලුම Product ලබා ගැනීම
  async getAll(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  },

  // ID එක අනුව තනි Product ලබා ගැනීම
  async getById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // අලුත් Product සෑදීම
  async create(productData: FormData): Promise<Product> {
    // කිසිදු Header එකක් අවශ්‍ය නැත. Axios විසින් FormData දුටු විට එය ස්වයංක්‍රීයව හසුරුවයි.
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Product update කිරීම
  async update(id: string, productData: FormData | Partial<Product>): Promise<Product> {
    // මෙහිදී ද headers ඉවත් කරන්න. Axios විසින් දත්ත වල ස්වභාවය අනුව Content-Type එක තීරණය කරයි.
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  // Product මකා දැමීම
  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};