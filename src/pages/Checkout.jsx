import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    try {
      // First get cart to calculate total
      const cartRes = await api.get('/cart');
      const total = cartRes.data.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      // Create order
      const orderRes = await api.post('/orders', {
        products: cartRes.data.products.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        total
      });

      const orderId = orderRes.data._id;

      // Initiate PayHere payment
      const payRes = await api.post('/payments/initiate', { orderId, amount: total });

      // Redirect to PayHere (sandbox for testing)
      const payhereUrl = `https://sandbox.payhere.lk/pay/checkout?${new URLSearchParams({
        merchant_id: payRes.data.merchantId,
        return_url: payRes.data.returnUrl,
        cancel_url: payRes.data.cancelUrl,
        notify_url: payRes.data.notifyUrl,
        order_id: orderId,
        items: 'E-Shop Order',
        currency: 'LKR',
        amount: total.toFixed(2),
        hash: payRes.data.hash
      }).toString()}`;

      window.location.href = payhereUrl;
    } catch (err) {
      console.error(err);
      alert('Payment initiation failed');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-12">Checkout</h1>
      <div className="border rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>
        <p className="mb-8 text-gray-600">You will be redirected to PayHere (sandbox mode) to complete the payment securely.</p>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-lg text-xl hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay with PayHere'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;