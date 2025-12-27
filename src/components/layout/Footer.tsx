import React from 'react';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">E-Shop</span>
            </div>
            <p className="text-gray-400">
              Your one-stop shop for all your needs. Quality products, best prices.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=electronics" className="text-gray-400 hover:text-white transition">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=clothing" className="text-gray-400 hover:text-white transition">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/products?category=books" className="text-gray-400 hover:text-white transition">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/products?category=home" className="text-gray-400 hover:text-white transition">
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link to="/products?category=sports" className="text-gray-400 hover:text-white transition">
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">123 Street, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">info@eshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with ❤️ for e-commerce enthusiasts</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;