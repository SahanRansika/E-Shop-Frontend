import React, { useEffect, useState } from 'react';
import { 
  Package, TrendingUp, Users, DollarSign, 
  Plus, Edit, Trash2, BarChart3, Calendar
} from 'lucide-react';
import type { Product } from '../types';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ProductForm from '../components/products/ProductForm';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  pendingOrders: number;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsData = await productService.getAll();
      const myProducts = productsData.filter(p => p.seller._id === 'current-user-id'); // Replace with actual user ID
      setProducts(myProducts);

      // Fetch orders
      const ordersData = await orderService.getOrders();

      // Calculate stats
      setStats({
        totalProducts: myProducts.length,
        totalSales: ordersData.length,
        totalRevenue: ordersData.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: ordersData.filter(o => o.status === 'pending').length,
      });
    } catch (error: unknown) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (formData: FormData) => {
    try {
      await productService.create(formData);
      toast.success('Product created successfully!');
      setShowAddModal(false);
      fetchDashboardData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      toast.error(message);
    }
  };

  const handleUpdateProduct = async (formData: FormData) => {
    if (!editingProduct) return;

    try {
      const data = Object.fromEntries(formData.entries()) as Partial<Product>;
      await productService.update(editingProduct._id, data);
      toast.success('Product updated successfully!');
      setShowEditModal(false);
      setEditingProduct(null);
      fetchDashboardData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      toast.error(message);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.delete(productId);
      toast.success('Product deleted successfully!');
      fetchDashboardData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      toast.error(message);
    }
  };

  const statsCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      change: '+12%',
    },
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
      change: '+8%',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
      change: '+15%',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Users,
      color: 'bg-yellow-100 text-yellow-600',
      change: '-3%',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your products and track your sales</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-green-600">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">My Products</h2>
              <p className="text-gray-600">Manage your product listings</p>
            </div>
            <Button onClick={() => setShowAddModal(true)} icon={Plus}>Add Product</Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first product to sell.</p>
            <Button onClick={() => setShowAddModal(true)} icon={Plus}>Add Your First Product</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-700">Product</th>
                  <th className="text-left p-4 font-medium text-gray-700">Price</th>
                  <th className="text-left p-4 font-medium text-gray-700">Stock</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 flex items-center">
                      <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} className="h-10 w-10 object-cover rounded mr-3"/>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                      </div>
                    </td>
                    <td className="p-4"><span className="font-medium">${product.price.toFixed(2)}</span></td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' : 
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="p-4"><span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">Active</span></td>
                    <td className="p-4 flex space-x-2">
                      <button onClick={() => { setEditingProduct(product); setShowEditModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity & Sales Overview */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
            <Button variant="ghost" size="sm" icon={Calendar}>View All</Button>
          </div>
          <div className="space-y-4">
            {[1,2,3].map(item => (
              <div key={item} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Order #{1000+item}</p>
                  <p className="text-sm text-gray-500">2 items • ${(50+item*10).toFixed(2)}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">Paid</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
            <Button variant="ghost" size="sm" icon={BarChart3}>View Report</Button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Sales chart will appear here</p>
              <p className="text-sm text-gray-400 mt-2">Connect with analytics service to view detailed reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product" size="lg">
        <ProductForm onSubmit={handleCreateProduct} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingProduct(null); }} title="Edit Product" size="lg">
        {editingProduct && (
          <ProductForm 
            product={editingProduct} 
            onSubmit={handleUpdateProduct} 
            onCancel={() => { setShowEditModal(false); setEditingProduct(null); }} 
          />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
