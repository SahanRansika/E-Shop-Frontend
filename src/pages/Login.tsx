import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; 
import { authService } from '../services/authService';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock, Loader2 } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore(); // Auth Store එකෙන් දත්ත Update කිරීම

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      
      // වැදගත්ම කොටස: Token එක නිවැරදි නමින් Save කිරීම
      localStorage.setItem('accessToken', response.accessToken); 
      
      // Store එක update කිරීම
      setAuth(response.user, response.accessToken);

      toast.success('සාර්ථකව ඇතුළු වුණා!');
      
      // Seller කෙනෙක් නම් Dashboard එකටත්, නැත්නම් Home එකටත් යොමු කිරීම
      if (response.user.roles.includes('seller')) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login අසාර්ථකයි. නැවත උත්සාහ කරන්න.');
    } finally {
      setLoading(false);
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
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;