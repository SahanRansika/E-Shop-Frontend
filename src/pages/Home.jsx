import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold">Welcome to E-Shop</h1>
        <p className="text-xl mt-4">Best products at best prices</p>
        <Link to="/shop" className="mt-8 inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100">
          Shop Now
        </Link>
      </div>
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        {/* Products list here - you can fetch or add static */}
      </div>
    </div>
  );
};

export default Home;