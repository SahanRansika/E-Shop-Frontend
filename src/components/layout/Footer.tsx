import React from 'react';
import { 
  Package, Mail, Phone, MapPin, Facebook, 
  Twitter, Instagram, Youtube, Send, 
  CreditCard, ShieldCheck, Globe 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-20 border-t border-gray-800">
      {/* --- NEWSLETTER SECTION --- */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-white mb-1">Join our newsletter</h3>
              <p className="text-gray-400">Get the latest updates on new arrivals and upcoming sales.</p>
            </div>
            <div className="w-full max-w-md">
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-900/20">
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Socials */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group w-fit">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                E<span className="text-blue-500">Shop</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Your premier destination for high-quality electronics, fashion, and home goods. We deliver quality you can trust to your doorstep.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-800/50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              {['About Us', 'Our Services', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-blue-400 transition-colors flex items-center group">
                    <span className="h-[2px] w-0 bg-blue-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Shop Categories</h3>
            <ul className="space-y-4">
              {['Electronics', 'Men\'s Fashion', 'Women\'s Fashion', 'Home & Garden', 'Gadgets'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="hover:text-blue-400 transition-colors flex items-center group">
                    <span className="h-[2px] w-0 bg-blue-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Trust */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 text-blue-500 mt-1 shrink-0" />
                <span>123 Commerce Way, Tech Park, Colombo 07, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <span>support@eshop.com</span>
              </li>
            </ul>
            
            {/* Trust Badges */}
            <div className="pt-4 flex gap-4">
               <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500">
                  <ShieldCheck className="h-4 w-4" /> 100% Secure
               </div>
               <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500">
                  <Globe className="h-4 w-4" /> Global Shipping
               </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-gray-500 text-center md:text-left">
              <p>&copy; {currentYear} <span className="text-gray-300 font-bold">E-Shop</span>. All rights reserved.</p>
              <p className="mt-1 flex items-center justify-center md:justify-start">
                Made with <span className="text-rose-500 mx-1">❤</span> in Sri Lanka
              </p>
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <CreditCard className="h-8 w-8" />
              <div className="h-6 w-[1px] bg-gray-700"></div>
              <span className="text-xs font-bold tracking-widest uppercase">Visa</span>
              <span className="text-xs font-bold tracking-widest uppercase">Mastercard</span>
              <span className="text-xs font-bold tracking-widest uppercase">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;