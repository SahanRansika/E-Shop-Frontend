import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">E-Shop</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-600 transition">
              Products
            </Link>
            {isAuthenticated && user?.roles.includes('seller') && (
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-blue-600 transition" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{user?.name}</span>
                </div>
                <Link to="/orders" className="text-gray-600 hover:text-blue-600 transition">
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;