import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Menu, X, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Helper to highlight active links
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Products', path: '/products', icon: null },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              E<span className="text-blue-600">Shop</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors ${
                  isActive(link.path) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && user?.roles.includes('seller') && (
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-1 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-5">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-full transition">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons / User Profile */}
            <div className="hidden md:block h-8 w-[1px] bg-gray-200 mx-2"></div>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/orders" 
                  className="flex items-center space-x-1 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
                <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-bold text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition shadow-md shadow-blue-200 hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-semibold text-gray-700 py-2 border-b border-gray-50"
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold text-gray-700 py-2 border-b border-gray-50">
                  My Orders
                </Link>
                {user?.roles.includes('seller') && (
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold text-gray-700 py-2 border-b border-gray-50">
                    Seller Dashboard
                  </Link>
                )}
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-gray-500 font-medium">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 font-bold"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-3 font-bold text-gray-700 border border-gray-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-3 font-bold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;