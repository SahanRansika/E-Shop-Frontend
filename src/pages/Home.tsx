import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import ProductList from '../components/products/ProductList';
import type{ Product } from '../types';
import { productService } from '../services/productService';
import Spinner from '../components/ui/Spinner';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await productService.getAll();
      
      // Simulate featured products (first 4)
      setFeaturedProducts(products.slice(0, 4));
      
      // Simulate new arrivals (last 8)
      setNewArrivals(products.slice(-8));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Free Shipping',
      description: 'Free delivery on orders over $50',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Payment',
      description: '100% secure payment processing',
    },
    {
      icon: <RefreshCw className="h-8 w-8" />,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: 'Quality Guarantee',
      description: 'Premium quality products',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to E-Shop
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover amazing products at unbeatable prices. Quality you can trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
          <Link
            to="/products"
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <ProductList 
          products={featuredProducts}
          columns={4}
          emptyMessage="No featured products available"
        />
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">New Arrivals</h2>
          <Link
            to="/products"
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <ProductList 
          products={newArrivals}
          columns={4}
          emptyMessage="No new arrivals"
        />
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to Start Selling?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of sellers who are growing their business with E-Shop.
          Create your seller account today and reach millions of customers.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Register as Seller
        </Link>
      </section>
    </div>
  );
};

export default Home;