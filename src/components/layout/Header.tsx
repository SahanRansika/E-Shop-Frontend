import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, User, LogOut, Package, Menu, X, 
  LayoutDashboard, ShoppingBag, ShieldCheck, Users 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debugging: Meeka dala check karanna console eke roles penawada kiyala
  // console.log("Header User Roles:", user?.roles);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Roles check karana logic eka thawa sarala kara
  const isAdmin = user?.roles?.includes('admin');
  const isSeller = user?.roles?.includes('seller');
  const canAccessDashboard = isAdmin || isSeller;

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              E<span className="text-blue-600">Shop</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            <Link to="/" className={`text-sm font-bold transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>Home</Link>
            <Link to="/products" className={`text-sm font-bold transition-colors ${isActive('/products') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>Shop</Link>
            
            {/* Dashboard: Admin saha Seller dennatama */}
            {isAuthenticated && canAccessDashboard && (
              <Link to="/dashboard" className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}

            {/* Sellers Management: Admin ta witharayi */}
            {isAuthenticated && isAdmin && (
              <Link to="/admin/sellers" className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${isActive('/admin/sellers') ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'}`}>
                <Users className="h-4 w-4" />
                <span>Sellers</span>
              </Link>
            )}
          </nav>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <Link to="/cart" className="relative p-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="hidden md:block h-8 w-[1px] bg-gray-100 mx-1"></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/orders" className="hidden lg:flex items-center space-x-1.5 text-sm font-bold text-gray-500 hover:text-blue-600 transition">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
                
                {/* Profile Badge */}
                <div className="flex items-center gap-2 bg-gray-50 pr-4 pl-1.5 py-1.5 rounded-2xl border border-gray-100">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                    {isAdmin ? <ShieldCheck size={18} /> : <User size={18} />}
                  </div>
                  <div className="flex flex-col -space-y-1">
                    <span className="text-xs font-black text-gray-800 truncate max-w-[80px]">{user?.name}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                      {isAdmin ? 'Admin' : (isSeller ? 'Seller' : 'User')}
                    </span>
                  </div>
                </div>

                <button onClick={handleLogout} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 transition">Sign In</Link>
                <Link to="/register" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">Join Now</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 space-y-4 shadow-xl animate-in slide-in-from-top">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-gray-800">Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-gray-800">Shop</Link>
          {isAuthenticated && (
            <>
              <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-gray-800">My Orders</Link>
              {canAccessDashboard && (
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-blue-600">Dashboard</Link>
              )}
              {isAdmin && (
                <Link to="/admin/sellers" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-purple-600">Sellers Management</Link>
              )}
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 mt-4 text-red-600 font-bold border border-red-100 rounded-2xl bg-red-50">
                <LogOut size={20} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;