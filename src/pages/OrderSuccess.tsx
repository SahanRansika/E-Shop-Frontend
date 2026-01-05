import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 p-10 text-center border border-white">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-200 blur-2xl opacity-50 rounded-full"></div>
            <div className="relative bg-green-500 p-5 rounded-full shadow-lg shadow-green-200">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-3 italic">AWESOME!</h1>
        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
          Your payment was successful and your order is on the way!
        </p>
        
        <div className="bg-blue-50/50 rounded-3xl p-6 mb-10 border border-blue-100/50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Order Reference</span>
            <span className="font-mono font-bold text-blue-700 bg-white px-3 py-1 rounded-xl text-sm shadow-sm border border-blue-100">
              #{orderId?.slice(-8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Status</span>
            <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="group w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            <Package className="w-5 h-5 group-hover:animate-bounce" /> View My Orders
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-white text-gray-500 border-2 border-gray-100 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;