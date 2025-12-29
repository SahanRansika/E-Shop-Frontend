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

// --- Dashboard Stats Interface ---
interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  pendingOrders: number;
}

// --- Inline Product Form Component ---
// මෙමගින් Category එක සහ Image එක handle කරයි
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
      <input type="text" placeholder="Product Name" className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
      <select className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
        <option value="">Select Category</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-4">
        <input type="number" placeholder="Price" className="w-full p-2.5 border rounded-xl outline-none" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        <input type="number" placeholder="Stock" className="w-full p-2.5 border rounded-xl outline-none" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
      </div>
      <textarea placeholder="Description" className="w-full p-2.5 border rounded-xl outline-none" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <Loader2 className="animate-spin" size={20}/> : (product ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0, totalSales: 0, totalRevenue: 0, pendingOrders: 0,
  });
  // Backend එක දුවන URL එක (උදා: http://localhost:5000)
  const BACKEND_URL = 'http://localhost:5000';

  useEffect(() => {
     if (user?.id) fetchDashboardData();
     }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Products ලබා ගැනීම
      const allProducts = await productService.getAll();
      const myProducts = allProducts.filter(p =>
        typeof p.seller === 'string' ? p.seller === user?.id : p.seller._id === user?.id
      );
      setProducts(myProducts);
      
      // 2. Orders ලබා ගැනීම (Try-Catch එකක් ඇතුළත)
      try {
        const ordersData = await orderService.getOrders();
        setStats({
          totalProducts: myProducts.length,
          totalSales: ordersData.length,
          totalRevenue: ordersData.reduce((sum, order) => sum + (order.total || 0), 0),
          pendingOrders: ordersData.filter(o => o.status === 'pending').length,
        });
      } catch (orderError) {
        console.error('Orders load error:', orderError);
        // Orders පමණක් fail වූ විට stats බිංදුව ලෙස තබමු
        setStats(prev => ({ ...prev, totalProducts: myProducts.length }));
      }
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
        setLoading(false);
      }
  };

  const handleCreateProduct = async (formData: FormData) => {
    try {
      await productService.create(formData);
      toast.success('Product added!');
      setShowAddModal(false);
      fetchDashboardData();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Error'); }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-500">Welcome, {user?.name}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={Plus}>Add Product</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Products', val: stats.totalProducts, icon: Package, col: 'text-blue-600' },
          { label: 'Sales', val: stats.totalSales, icon: TrendingUp, col: 'text-green-600' },
          { label: 'Revenue', val: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, col: 'text-purple-600' },
          { label: 'Pending', val: stats.pendingOrders, icon: Users, col: 'text-yellow-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <s.icon className={`${s.col} mb-2`} size={24} />
            <p className="text-gray-500 text-sm">{s.label}</p>
            <h3 className="text-2xl font-bold">{s.val}</h3>
          </div>
        ))}
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-600">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                <img 
                // p.image හි 'uploads/filename.jpg' ලෙස ඇත්නම්:
                  src={`${BACKEND_URL}/${p.image}`} 
                  className="h-10 w-10 rounded-lg object-cover bg-gray-100"
                  alt={p.name}
                  onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  // placeholder.com වෙනුවට පින්තූරයක් නොමැති විට පෙන්වන SVG එකක් මෙලෙස ලබා දෙන්න
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='9' cy='9' r='2'%3E%3C/circle%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'%3E%3C/path%3E%3C/svg%3E";
                  }}
                />
                  <span className="font-semibold">{p.name}</span>
                </td>
                <td className="px-6 py-4"><span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">{p.category}</span></td>
                <td className="px-6 py-4 font-medium">${p.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">{p.stock} units</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => {setEditingProduct(p); setShowEditModal(true)}} className="p-2 text-blue-600"><Edit size={18}/></button>
                  <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-red-600"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product">
        <ProductFormInline onSubmit={handleCreateProduct} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Product">
        {editingProduct && <ProductFormInline product={editingProduct} onSubmit={handleUpdateProduct} onCancel={() => setShowEditModal(false)} />}
      </Modal>
    </div>
  );
};

export default Dashboard;