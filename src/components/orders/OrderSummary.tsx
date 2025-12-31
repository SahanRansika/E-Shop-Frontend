import React from 'react';
import { Package, Truck, User, CreditCard } from 'lucide-react';
import type{ Order } from '../../types/types';
import { formatCurrency } from '../../utils/formatters';

interface OrderSummaryProps {
  order: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const subtotal = order.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const getStatusSteps = () => {
    const steps = [
      { id: 'pending', label: 'Order Placed', icon: Package },
      { id: 'paid', label: 'Payment', icon: CreditCard },
      { id: 'shipped', label: 'Shipped', icon: Truck },
      { id: 'delivered', label: 'Delivered', icon: User },
    ];
    
    return steps.map((step, index) => {
      const isCompleted = steps.findIndex(s => s.id === order.status) >= index;
      const isCurrent = step.id === order.status;
      
      return (
        <div key={step.id} className="flex flex-col items-center">
          <div className={`
            h-12 w-12 rounded-full flex items-center justify-center mb-2
            ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
            ${isCurrent ? 'ring-4 ring-green-200' : ''}
          `}>
            <step.icon className="h-6 w-6" />
          </div>
          <span className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
            {step.label}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

      {/* Order Status Steps */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {getStatusSteps()}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(['pending', 'paid', 'shipped', 'delivered'].indexOf(order.status) + 1) * 25}%` }}
          />
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-4">Order Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium capitalize">
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-4">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className={shipping === 0 ? 'text-green-600' : ''}>
                {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-8">
        <h3 className="font-semibold text-gray-700 mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.products.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <img
                  src={item.product.image || 'https://via.placeholder.com/60'}
                  alt={item.product.name}
                  className="h-16 w-16 object-cover rounded"
                />
                <div className="ml-4">
                  <p className="font-medium text-gray-800">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(item.product.price)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;