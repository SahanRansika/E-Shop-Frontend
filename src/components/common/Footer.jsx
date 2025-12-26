import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-12 mt-auto">
      <div className="container mx-auto px-6 text-center">
        <p className="text-xl font-bold mb-4">E-Shop</p>
        <p className="text-gray-300 mb-6">Your trusted online shopping destination</p>
        <div className="flex justify-center space-x-8 mb-8">
          <a href="/" className="hover:text-blue-300 transition">Home</a>
          <a href="/shop" className="hover:text-blue-300 transition">Shop</a>
          <a href="/about" className="hover:text-blue-300 transition">About</a>
          <a href="/contact" className="hover:text-blue-300 transition">Contact</a>
        </div>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} E-Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;