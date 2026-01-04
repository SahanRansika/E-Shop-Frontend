import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { ShoppingBag, Tag, Truck } from 'lucide-react';

const CartSummary: React.FC = () => {
  const { items } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  // Logic: රු. 5000 ට අඩු නම් shipping රු. 350, නැත්නම් FREE
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 350;
  
  // Tax අවශ්‍ය නැතිනම් මෙය 0 කරන්න, දැනට රු. 150 ක Exercise Book එකට අනුව Tax ඉවත් කර මුළු එකතුව පමණක් පෙන්වමු
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <ShoppingBag className="h-5 w-5 mr-2" />
        Order Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">LKR {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center">
            <Truck className="h-4 w-4 mr-1" />
            Shipping
          </span>
          <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-semibold text-gray-900'}>
            {shipping === 0 ? 'FREE' : `LKR ${shipping.toFixed(2)}`}
          </span>
        </div>
        
        {/* අවශ්‍ය නම් පමණක් Tax පෙන්වන්න, නැතිනම් මෙම කොටස ඉවත් කරන්න */}
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-blue-600">LKR {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {subtotal < 5000 && subtotal > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-blue-600 mr-2" />
            <p className="text-sm text-blue-700">
              Add LKR {(5000 - subtotal).toFixed(2)} more for free shipping!
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="flex items-center text-sm text-gray-500">
          <input type="checkbox" id="terms" className="mr-2 cursor-pointer" />
          <label htmlFor="terms" className="cursor-pointer">
            I agree to the terms and conditions
          </label>
        </div>
        
        <div className="text-sm text-gray-500">
          <p className="mb-2 font-medium">We Accept PayHere (Visa/Master):</p>
          <div className="flex flex-wrap gap-2">
             <img src="https://www.payhere.lk/downloads/images/payhere_short_banner.png" alt="PayHere" className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;