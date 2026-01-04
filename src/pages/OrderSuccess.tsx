import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti'; // npm install canvas-confetti (optional)

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  useEffect(() => {
    // සාර්ථක වූ විට අලංකාර ලෙස Confetti පෙන්වීමට
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
        
        <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left border border-gray-100">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Order ID:</span>
            <span className="font-mono font-bold text-blue-600 text-sm">#{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Status:</span>
            <span className="text-green-600 font-bold text-sm uppercase">Confirmed</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/orders')}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Package className="w-5 h-5" /> View My Orders
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            <Home className="w-5 h-5" /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;