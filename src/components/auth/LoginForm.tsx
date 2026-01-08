import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore'; 
import { Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Login function eka void unath prashnayak nathi wenna mehema karamu:
      await login(email, password);
      
      toast.success('Login Successful!');

      // Store eke aluth state eka kelinma gannawa
      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        // Roles thiyenawada kiyala check kirima
        const isAdmin = currentUser.roles.includes('admin');
        const isSeller = currentUser.roles.includes('seller');

        if (isAdmin || isSeller) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) clearError();
            }}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="name@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-sm font-bold text-gray-700">Password</label>
          <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Forgot?</button>
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) clearError();
            }}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;