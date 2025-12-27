import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

export const useAuth = () => {
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('accessToken');

    if (token && !user) {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, [setUser, user]);

  const refreshUser = () => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  };

  return {
    refreshUser,
  };
};
