import React, { useEffect, useState } from 'react';
import { Package, Filter, Download, Search } from 'lucide-react';
import OrderCard from '../components/orders/OrderCard';
import type{ Order } from '../types';
import { orderService } from '../services/orderService';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    
    if (search) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.products.some(item =>
          item.product.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [search, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          
          <Button icon={Download} variant="outline">
            Export
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID or product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
          <p className="text-gray-600 mb-6">
            {orders.length === 0 
              ? "You haven't placed any orders yet." 
              : "No orders match your filters."}
          </p>
          {orders.length === 0 && (
            <a href="/products" className="btn-primary">
              Start Shopping
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;