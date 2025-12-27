import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Frown } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mb-6">
          <Frown className="h-10 w-10" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Back Home
          </Link>
          
          <Link
            to="/products"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            <Search className="h-5 w-5 mr-2" />
            Browse Products
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;