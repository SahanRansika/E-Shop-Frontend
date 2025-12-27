  import React from 'react';
  import { Link } from 'react-router-dom';
  import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
  import { useCartStore } from '../store/cartStore';
  import CartItem from '../components/cart/CartItem';
  import CartSummary from '../components/cart/CartSummary';

  const Cart: React.FC = () => {
    const { items, clearCart } = useCartStore();

    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart!</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Start Shopping
          </Link>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    {items.length} {items.length === 1 ? 'item' : 'items'} in cart
                  </h2>
                  <button
                    onClick={clearCart}
                    className="flex items-center text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <CartSummary />
            
            <div className="mt-6 space-y-4">
              <Link
                to="/checkout"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              
              <Link
                to="/products"
                className="block w-full border border-blue-600 text-blue-600 text-center py-3 rounded-lg hover:bg-blue-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Cart;