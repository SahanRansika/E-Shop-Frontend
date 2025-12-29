import api from './api';
import type { AuthResponse, User } from '../types/types';

export const authService = {
  async register(name: string, email: string, password: string, role?: string): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  isSeller(): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes('seller') || false;
  },
};