import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type{ CartItem as CartItemType } from '../../types/types';
import { useCartStore } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      alert(`Only ${item.product.stock} items available`);
      return;
    }
    updateQuantity(item.product._id, newQuantity);
  };

  const handleRemove = () => {
    if (window.confirm('Remove this item from cart?')) {
      removeItem(item.product._id);
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition">
      <div className="flex items-center">
        {/* Product Image */}
        <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
          <img
            src={item.product.image || 'https://via.placeholder.com/100'}
            alt={item.product.name}
            className="h-20 w-20 object-cover rounded-lg"
          />
        </Link>

        {/* Product Details */}
        <div className="ml-4 flex-grow">
          <div className="flex justify-between">
            <div>
              <Link 
                to={`/products/${item.product._id}`}
                className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition"
              >
                {item.product.name}
              </Link>
              <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                {item.product.description}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-lg font-bold text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                {item.quantity > 1 && (
                  <span className="text-gray-500 text-sm ml-2">
                    (${item.product.price.toFixed(2)} each)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-600 transition self-start"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <span className="text-lg font-semibold w-8 text-center">
                {item.quantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.product.stock}
                className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="text-right">
              <span className="text-sm text-gray-500">
                Stock: {item.product.stock}
              </span>
              {item.product.stock < 10 && (
                <p className="text-sm text-orange-600">
                  Only {item.product.stock} left!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;