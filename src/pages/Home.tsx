import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import ProductList from '../components/products/ProductList';
import type { Product } from '../types/types';
import { productService } from '../services/productService';
import Spinner from '../components/ui/Spinner';

// --- IMAGE URLs (Using Unsplash placeholders for demonstration) ---
// You should replace these with your actual local assets or CDN URLs later.
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";
const CTA_IMAGE_URL = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";
// ------------------------------------------------------------------

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Note: In a real app, you might have dedicated endpoints for 'featured' or 'new'
      const products = await productService.getAll();

      // Simulate featured products (e.g., first 4)
      setFeaturedProducts(products.slice(0, 4));

      // Simulate new arrivals (e.g., last 8, reversed to show newest first)
      setNewArrivals(products.slice(-8).reverse());
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
      <div className="flex justify-center items-center h-96"> {/* Increased height for better centering */}
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-12"> {/* Increased vertical spacing between sections */}

      {/* --- HERO SECTION WITH IMAGE --- */}
      {/*
        Changes:
        1. Added relative, bg-cover, bg-center styles.
        2. Added inline style for background image.
        3. Added specific height (h-[500px] md:h-[600px]) for visual impact.
        4. Added an absolute overlay div (bg-black/50) to ensure text readable.
        5. Wrapped content in a relative z-10 div to sit above overlay.
      */}
      <section
        className="relative bg-cover bg-center bg-no-repeat rounded-3xl overflow-hidden h-[500px] md:h-[600px] flex items-center"
        style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
      >
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>

        <div className="relative container mx-auto px-6 md:px-12 z-10">
          <div className="max-w-2xl animate-fade-in-up"> {/* Simple fade animation helper class implied */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Discover Your Next <br className="hidden md:block"/> Favorite Thing.
            </h1>
            <p className="text-xl text-blue-50 mb-10 leading-relaxed">
              Explore a curated collection of amazing products at unbeatable prices. Quality you can trust, delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 hover:scale-105 transform transition-all duration-200 shadow-lg"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-200"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-4 md:px-8 py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-blue-50 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed px-4">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Featured Products --- */}
      <section className="px-4">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 sm:mb-12 gap-4">
         <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-gray-600">Handpicked selections just for you.</p>
         </div>
          <Link
            to="/products"
            className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors group"
          >
            View All
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProductList
          products={featuredProducts}
          columns={4}
          emptyMessage="No featured products available"
        />
      </section>

      {/* --- New Arrivals --- */}
      <section className="px-4">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 sm:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">New Arrivals</h2>
            <p className="text-gray-600">The latest trends added to our store.</p>
          </div>
          <Link
            to="/products"
            className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors group"
          >
            View All
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProductList
          products={newArrivals}
          columns={4}
          emptyMessage="No new arrivals"
        />
      </section>

      {/* --- CTA SECTION WITH IMAGE --- */}
      {/*
        Changes:
        1. Used bg-cover, bg-center, relative.
        2. Added background image via inline style.
        3. Added a strong blue-tinted overlay (bg-blue-900/80) so it fits the brand.
        4. Changed text colors to white/blue-100 for contrast against the dark overlay.
        5. Increased padding for a more substantial look.
      */}
      <section
        className="relative bg-cover bg-center bg-no-repeat rounded-3xl overflow-hidden py-24 px-6 text-center text-white"
        style={{ backgroundImage: `url('${CTA_IMAGE_URL}')` }}
      >
        <div className="absolute inset-0 bg-blue-900/85 mix-blend-multiply"></div> {/* Blue tinted overlay */}

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of successful sellers on E-Shop. List your products today and reach millions of eager customers worldwide.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Register as Seller
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;