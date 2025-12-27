import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { ShoppingBag, Tag, Truck } from 'lucide-react';

const CartSummary: React.FC = () => {
  const { items } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <ShoppingBag className="h-5 w-5 mr-2" />
        Order Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 flex items-center">
            <Truck className="h-4 w-4 mr-1" />
            Shipping
          </span>
          <span className={shipping === 0 ? 'text-green-600' : 'font-semibold'}>
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {subtotal < 50 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-blue-600 mr-2" />
            <p className="text-sm text-blue-700">
              Add ${(50 - subtotal).toFixed(2)} more for free shipping!
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="flex items-center text-sm text-gray-500">
          <input type="checkbox" id="terms" className="mr-2" />
          <label htmlFor="terms">
            I agree to the terms and conditions
          </label>
        </div>
        
        <div className="text-sm text-gray-500">
          <p className="mb-1">Payment methods:</p>
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">Visa</span>
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">MasterCard</span>
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">PayHere</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;