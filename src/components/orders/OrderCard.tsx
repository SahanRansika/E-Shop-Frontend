import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, DollarSign, Truck, CheckCircle } from 'lucide-react';
import type{ Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'shipped': return <Truck className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Order #{order._id.slice(-8).toUpperCase()}
            </h3>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </span>
        </div>

        {/* Order Items */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">Items ({order.products.length})</h4>
          <div className="space-y-3">
            {order.products.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center">
                <img
                  src={item.product.image || 'https://via.placeholder.com/50'}
                  alt={item.product.name}
                  className="h-12 w-12 object-cover rounded"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            
            {order.products.length > 3 && (
              <p className="text-sm text-gray-500">
                + {order.products.length - 3} more items
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t pt-4 mt-4 flex justify-end space-x-3">
          <Link
            to={`/orders/${order._id}`}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            View Details
          </Link>
          {order.status === 'pending' && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;