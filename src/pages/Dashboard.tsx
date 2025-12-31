import React, { useEffect, useState } from 'react';
import { 
  Package, TrendingUp, Users, DollarSign, 
  Plus, Edit, Trash2, Loader2, Camera, X
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
    
    if (imageFile) {
      data.append('image', imageFile); // මෙහි නම 'image' විය යුතුමයි
      console.log("✅ Image attached to FormData:", imageFile.name);
    } else {
      console.log("⚠️ No image file to attach");
    }
    
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
              if(file) { 
                setImageFile(file); 
                setPreview(URL.createObjectURL(file)); 
                console.log("📸 Image selected:", file.name);
              }
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, totalRevenue: 0, pendingOrders: 0 });

  useEffect(() => {
    if (user?.id) fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAll();
      const myProducts = allProducts.filter(p =>
        typeof p.seller === 'string' ? p.seller === user?.id : p.seller._id === user?.id
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

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin" size={40}/></div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500">Managing inventory for {user?.name}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={Plus}>Add Product</Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Products" value={stats.totalProducts} icon={Package} color="text-blue-600" />
        <StatCard label="Total Sales" value={stats.totalSales} icon={TrendingUp} color="text-green-600" />
        <StatCard label="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} color="text-purple-600" />
        <StatCard label="Pending Orders" value={stats.pendingOrders} icon={Users} color="text-yellow-600" />
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Product</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Price</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Stock</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img 
                    src={p.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='9' cy='9' r='2'%3E%3C/circle%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'%3E%3C/path%3E%3C/svg%3E"} 
                    className="h-12 w-12 rounded-xl object-cover bg-gray-100 border"
                    alt={p.name}
                  />
                  <span className="font-semibold text-gray-800">{p.name}</span>
                </td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">{p.category}</span></td>
                <td className="px-6 py-4 font-medium text-gray-900">${p.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-600">{p.stock} units</td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button onClick={() => {setEditingProduct(p); setShowEditModal(true)}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18}/></button>
                  <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <Icon className={`${color} mb-3`} size={28} />
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
  </div>
);

export default Dashboard;