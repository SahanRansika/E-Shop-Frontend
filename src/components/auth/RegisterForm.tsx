import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'buyer' | 'seller';
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err: unknown) {
      // Narrow unknown to Error
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Account Type</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {formData.role === 'seller'
              ? 'As a seller, you can list and manage your products.'
              : 'As a buyer, you can browse and purchase products.'}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Creating Account...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
