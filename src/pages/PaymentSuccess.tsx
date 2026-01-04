import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti'; // npm install react-confetti

const PaymentSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Confetti recycle={false} numberOfPieces={500} />
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-green-100">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Success!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        <div className="space-y-3">
          <Link 
            to="/orders" 
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={20} /> View My Orders
          </Link>
          
          <Link 
            to="/" 
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            Continue Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;