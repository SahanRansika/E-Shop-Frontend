import React, { useEffect, useState } from 'react';
import { 
  Package, Filter, Download, Search, 
  ShoppingBag, CheckCircle2, Truck, Clock, 
  ChevronDown, ExternalLink 
} from 'lucide-react';
import OrderCard from '../components/orders/OrderCard';
import type { Order } from '../types/types';
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
      const data = await orderService.getSellerOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders', icon: ShoppingBag },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'paid', label: 'Paid', icon: CheckCircle2 },
    { value: 'shipped', label: 'Shipped', icon: Truck },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  // Quick stats calculation
  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    inTransit: orders.filter(o => o.status === 'shipped').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-500 font-medium animate-pulse">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Purchase History</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage, track, and review your past purchases.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button icon={Download} variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
            Export Invoice
          </Button>
          <Button icon={ExternalLink} className="rounded-xl shadow-md shadow-blue-100">
            Help Center
          </Button>
        </div>
      </div>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center space-x-4">
          <div className="bg-blue-600 p-2 rounded-lg"><ShoppingBag className="text-white h-5 w-5" /></div>
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Orders</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center space-x-4">
          <div className="bg-emerald-600 p-2 rounded-lg"><CheckCircle2 className="text-white h-5 w-5" /></div>
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Delivered</p>
            <p className="text-xl font-bold text-gray-900">{stats.delivered}</p>
          </div>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-center space-x-4">
          <div className="bg-amber-600 p-2 rounded-lg"><Truck className="text-white h-5 w-5" /></div>
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">In Transit</p>
            <p className="text-xl font-bold text-gray-900">{stats.inTransit}</p>
          </div>
        </div>
      </div>

      {/* --- FILTERS & SEARCH --- */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer font-medium text-gray-700"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- ORDER CONTENT --- */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {orders.length === 0 ? "No orders placed yet" : "No matching orders"}
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            {orders.length === 0 
              ? "Looks like you haven't made your first purchase yet. Explore our products to get started!" 
              : "We couldn't find any orders matching your current search or filter criteria."}
          </p>
          {orders.length === 0 ? (
            <a 
              href="/products" 
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition transform hover:scale-105"
            >
              Browse Products
            </a>
          ) : (
            <button 
              onClick={() => {setSearch(''); setStatusFilter('all');}}
              className="text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
            </p>
            <span className="h-[1px] flex-1 bg-gray-100 mx-4 hidden sm:block"></span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOrders.map((order) => (
              <div key={order._id} className="transition-transform duration-300 hover:-translate-y-1">
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;