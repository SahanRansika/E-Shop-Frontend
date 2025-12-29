import { create } from 'zustand';
import type { User } from '../types/types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  // මෙන්න මේ පේළිය එක් කරන්න
  setAuth: (user: User, token: string) => void; 
  setUser: (user: User) => void;
  clearError: () => void;
}

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  // setAuth ශ්‍රිතය මෙලෙස ක්‍රියාත්මක කරන්න
  setAuth: (user: User, token: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      // මෙහිදී setAuth භාවිතා කළ හැක
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const err = error as ApiError;
      set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string, role?: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(name, email, password, role);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const err = error as ApiError;
      set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user: User) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },
}));