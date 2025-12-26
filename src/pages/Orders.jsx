import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center py-20">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-center py-20 text-2xl">No orders yet</p>;

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">My Orders</h1>
      <div className="space-y-8">
        {orders.map(order => (
          <div key={order._id} className="border rounded-lg p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order #{order._id.slice(-8)}</h2>
              <span className={`px-4 py-2 rounded-full text-white ${order.status === 'paid' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600 mb-4">Total: Rs. {order.total}</p>
            <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Items:</h3>
              {order.products.map(item => (
                <div key={item.product._id} className="flex justify-between py-2">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>Rs. {item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;