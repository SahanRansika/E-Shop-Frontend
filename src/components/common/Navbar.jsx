import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold hover:text-blue-200 transition">
          E-Shop
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8 text-lg">
          <Link to="/" className="hover:text-blue-200 transition">
            Home
          </Link>
          <Link to="/shop" className="hover:text-blue-200 transition">
            Shop
          </Link>
          <Link to="/cart" className="hover:text-blue-200 transition">
            Cart
          </Link>

          {/* User-specific links */}
          {user ? (
            <>
              {/* Orders link for all logged-in users */}
              <Link to="/orders" className="hover:text-blue-200 transition">
                Orders
              </Link>

              {/* Seller-specific links */}
              {user.roles.includes('seller') && (
                <>
                  <Link to="/seller/add-product" className="hover:text-blue-200 transition">
                    Add Product
                  </Link>
                  <Link to="/seller/dashboard" className="hover:text-blue-200 transition">
                    Seller Dashboard
                  </Link>
                </>
              )}

              {/* User info & Logout */}
              <div className="flex items-center space-x-4 border-l pl-8 border-blue-500">
                <span className="text-sm">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest links */}
              <Link to="/login" className="hover:text-blue-200 transition">
                Login
              </Link>
              <Link to="/register" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;