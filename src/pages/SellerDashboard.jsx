import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SellerDashboard = () => {
  const { user } = useAuth();

  if (!user || !user.roles.includes('seller')) {
    return <p className="text-center py-20 text-2xl text-red-600">Access Denied. Sellers only.</p>;
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Seller Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <Link to="/seller/add-product" className="bg-blue-600 text-white p-12 rounded-lg text-center hover:bg-blue-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
          <p>Create a new product listing</p>
        </Link>
        <Link to="/seller/products" className="bg-green-600 text-white p-12 rounded-lg text-center hover:bg-green-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
          <p>View and edit your products</p>
        </Link>
        <Link to="/orders" className="bg-purple-600 text-white p-12 rounded-lg text-center hover:bg-purple-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">View Orders</h2>
          <p>See customer orders</p>
        </Link>
      </div>
    </div>
  );
};

export default SellerDashboard;