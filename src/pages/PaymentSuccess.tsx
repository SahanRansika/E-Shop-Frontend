import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <div className="bg-green-100 p-6 rounded-full mb-6">
        <CheckCircle className="w-16 h-16 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <div className="space-x-4">
        <Link 
          to="/orders" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          View My Orders
        </Link>
        <Link 
          to="/" 
          className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;