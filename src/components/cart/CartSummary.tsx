import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { ShoppingBag, Tag, Truck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartSummary: React.FC = () => {
  const { items } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  // රු. 5000 ට වැඩි නම් Free Shipping
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 350;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100 p-8 border border-gray-100">
      <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center">
        <ShoppingBag className="h-6 w-6 mr-2 text-blue-600" />
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-gray-600">
          <span className="font-medium">Subtotal</span>
          <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        
        <div className="flex justify-between items-center text-gray-600">
          <span className="flex items-center font-medium">
            <Truck className="h-4 w-4 mr-2 text-gray-400" />
            Shipping
          </span>
          <span className={shipping === 0 ? 'text-green-600 font-black' : 'font-bold text-gray-900'}>
            {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
          </span>
        </div>
        
        <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-black text-blue-600">
              Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {subtotal < 5000 && subtotal > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-start">
            <Tag className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <p className="text-sm text-blue-700 font-medium">
              තව Rs. {(5000 - subtotal).toLocaleString()} ක භාණ්ඩ ඇනවුම් කර නොමිලේ ප්‍රවාහන පහසුකම් (Free Shipping) ලබා ගන්න!
            </p>
          </div>
        </div>
      )}

      <button 
        onClick={() => navigate('/checkout')}
        disabled={items.length === 0}
        className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:bg-gray-200 disabled:shadow-none"
      >
        Checkout Now
        <ArrowRight size={20} />
      </button>

      <div className="mt-8">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Secure Payments via PayHere</p>
        <div className="flex justify-center grayscale opacity-70">
           <img src="https://www.payhere.lk/downloads/images/payhere_short_banner.png" alt="PayHere" className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default CartSummary;