import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart');
        setCart(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      setCart(prev => ({
        ...prev,
        products: prev.products.filter(p => p.product._id !== productId)
      }));
    } catch (err) {
      alert('Error removing item');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    try {
      await api.put('/cart', { productId, quantity });
      setCart(prev => ({
        ...prev,
        products: prev.products.map(p =>
          p.product._id === productId ? { ...p, quantity } : p
        )
      }));
    } catch (err) {
      alert('Error updating quantity');
    }
  };

  if (loading) return <p className="text-center py-20">Loading cart...</p>;
  if (!cart || cart.products.length === 0) return <p className="text-center py-20 text-2xl">Your cart is empty</p>;

  const total = cart.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cart.products.map(item => (
            <div key={item.product._id} className="border rounded-lg p-6 mb-6 flex items-center gap-6 shadow">
              <img src={item.product.image || '/placeholder.jpg'} alt={item.product.name} className="w-32 h-32 object-cover rounded" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">Rs. {item.product.price}</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="bg-gray-300 px-3 py-1 rounded">-</button>
                <span className="text-lg">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="bg-gray-300 px-3 py-1 rounded">+</button>
              </div>
              <button onClick={() => removeFromCart(item.product._id)} className="text-red-600 hover:underline">Remove</button>
            </div>
          ))}
        </div>
        <div className="border rounded-lg p-8 h-fit shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="flex justify-between mb-4">
            <span>Subtotal</span>
            <span>Rs. {total}</span>
          </div>
          <div className="flex justify-between mb-6 text-xl font-bold">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 text-lg">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;