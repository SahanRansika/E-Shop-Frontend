import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, TrendingUp, Users, DollarSign, 
  Plus, Edit, Trash2, Loader2, Camera, X, LayoutDashboard, AlertCircle
} from 'lucide-react'; 
import type { Product } from '../types/types';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const ProductFormInline: React.FC<{
  product?: any;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}> = ({ product, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    category: product?.category || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(product?.image || '');

  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Health & Beauty', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price.toString());
    data.append('stock', formData.stock.toString());
    data.append('category', formData.category);
    if (imageFile) data.append('image', imageFile);
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-xl bg-gray-50 relative">
        {preview ? (
          <div className="relative w-full h-32">
            <img src={preview} className="w-full h-full object-contain" alt="Preview" />
            <button type="button" onClick={() => {setPreview(''); setImageFile(null)}} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"><X size={14}/></button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center">
            <Camera className="text-gray-400 mb-2" size={28} />
            <span className="text-xs text-gray-500">Upload Product Image</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if(file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
            }} />
          </label>
        )}
      </div>
      <input type="text" placeholder="Product Name" className="w-full p-2.5 border rounded-xl outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
      <select className="w-full p-2.5 border rounded-xl bg-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
        <option value="">Select Category</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-4">
        <input type="number" placeholder="Price" className="w-full p-2.5 border rounded-xl" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        <input type="number" placeholder="Stock" className="w-full p-2.5 border rounded-xl" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
      </div>
      <textarea placeholder="Description" className="w-full p-2.5 border rounded-xl" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <Loader2 className="animate-spin" size={20}/> : (product ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, totalRevenue: 0, pendingOrders: 0 });

  useEffect(() => {
    // Role Verification: Admin ho Seller nethnam eliyata danna
    if (user) {
      const hasAccess = user.roles.includes('admin') || user.roles.includes('seller');
      if (!hasAccess) {
        toast.error("Unauthorized! Only Sellers and Admins can access Dashboard.");
        navigate('/');
        return;
      }
      fetchDashboardData();
    }
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAll();
      const myProducts = allProducts.filter(p =>
        typeof p.seller === 'string' ? p.seller === user?.id : (p.seller as any)._id === user?.id
      );
      setProducts(myProducts);
      
      try {
        const ordersData = await orderService.getOrders();
        setStats({
          totalProducts: myProducts.length,
          totalSales: ordersData.length,
          totalRevenue: ordersData.reduce((sum, order) => sum + (order.total || 0), 0),
          pendingOrders: ordersData.filter(o => o.status === 'pending').length,
        });
      } catch (err) {
        setStats(prev => ({ ...prev, totalProducts: myProducts.length }));
      }
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (formData: FormData) => {
    try {
      await productService.create(formData);
      toast.success('Product created!');
      setShowAddModal(false);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create');
    }
  };

  const handleUpdateProduct = async (formData: FormData) => {
    if (!editingProduct) return;
    try {
      await productService.update(editingProduct._id, formData);
      toast.success('Updated!');
      setShowEditModal(false);
      fetchDashboardData();
    } catch (error) { toast.error('Update failed'); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      toast.success('Deleted');
      fetchDashboardData();
    } catch (error) { toast.error('Delete failed'); }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" /> 
            {user?.roles.includes('admin') ? 'Admin Dashboard' : 'Seller Dashboard'}
          </h1>
          <p className="text-gray-500">Managing inventory for <span className="font-semibold text-gray-700">{user?.name}</span></p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={Plus} className="shadow-lg shadow-blue-100">Add New Product</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="My Products" value={stats.totalProducts} icon={Package} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Total Sales" value={stats.totalSales} icon={TrendingUp} color="text-green-600" bg="bg-green-50" />
        <StatCard label="Revenue" value={`Rs. ${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="Pending Orders" value={stats.pendingOrders} icon={Users} color="text-yellow-600" bg="bg-yellow-50" />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Product Inventory</h3>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{products.length} Products Found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Product Details</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Category</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Price</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Stock</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img 
                      src={p.image || "https://via.placeholder.com/50"} 
                      className="h-12 w-12 rounded-xl object-cover bg-gray-100 border"
                      alt={p.name}
                    />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">ID: {p._id.slice(-6)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">Rs. {p.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="font-medium">{p.stock} units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => {setEditingProduct(p); setShowEditModal(true)}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit size={18}/></button>
                    <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-20 text-center text-gray-400">
              <AlertCircle className="mx-auto mb-2 opacity-20" size={48} />
              <p>No products added yet.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product">
        <ProductFormInline onSubmit={handleCreateProduct} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Product">
        {editingProduct && <ProductFormInline product={editingProduct} onSubmit={handleUpdateProduct} onCancel={() => setShowEditModal(false)} />}
      </Modal>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bg }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
    <div className={`${bg} ${color} p-4 rounded-2xl`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
      <h3 className="text-xl font-black text-gray-900">{value}</h3>
    </div>
  </div>
);

export default Dashboard;