import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Truck, Shield, RotateCcw, Package, Heart, Plus, Minus, Check, BadgeCheck, ArrowLeft } from 'lucide-react';
import type { Product } from '../types/types';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (id) fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id!);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('භාණ්ඩයේ තොරතුරු ලබා ගැනීමට නොහැකි විය.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.name} කාර්ට් එකට එක් කළා!`, {
        icon: '🛒',
        style: { borderRadius: '12px', background: '#333', color: '#fff' },
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity);
      navigate('/checkout');
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] space-y-4">
      <Spinner size="lg" />
      <p className="text-gray-400 animate-pulse font-medium">Fetching product details...</p>
    </div>
  );

  if (!product) return (
    <div className="text-center py-24 px-4">
      <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package className="h-12 w-12 text-gray-300" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">භාණ්ඩය සොයාගත නොහැක</h2>
      <Link to="/products" className="inline-flex items-center text-blue-600 font-bold hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-8">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* --- LEFT: PRODUCT IMAGE --- */}
        <div className="lg:col-span-6">
          <div className="sticky top-28">
            <div className="relative aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm group">
              <img
                src={product.image || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
              />
              <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors">
                <Heart className="h-6 w-6 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT: PRODUCT INFO --- */}
        <div className="lg:col-span-6">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <BadgeCheck className="h-4 w-4" /> Verified Seller
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < 4 ? 'fill-current' : 'text-gray-200'}`} />)}
                </div>
                <span className="text-sm font-bold text-gray-400">Trusted Product</span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-gray-900">${product.price.toFixed(2)}</span>
              <div className="mb-1.5">
                {product.stock > 0 ? (
                  <span className="flex items-center text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                    <Check className="h-4 w-4 mr-1" /> In Stock
                  </span>
                ) : (
                  <span className="text-red-500 font-bold text-sm bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
                )}
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed text-lg">{product.description}</p>

            {/* Seller Trust Box */}
            <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {product.seller?.name ? product.seller.name.charAt(0) : 'S'}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Sold by</p>
                  <p className="font-extrabold text-gray-900">{product.seller?.name || 'Unknown Seller'}</p>
                </div>
              </div>
              <button className="text-sm font-bold text-blue-600 hover:underline">View Store</button>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Quantity</label>
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-white rounded-xl transition-all"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="w-12 text-center font-black text-xl">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-white rounded-xl transition-all"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-gray-400">{product.stock} items left</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                variant="outline"
                className="py-5 rounded-2xl border-2 font-bold hover:bg-gray-50 disabled:opacity-50"
                disabled={product.stock === 0}
              >
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow} 
                size="lg" 
                variant="primary"
                className="py-5 rounded-2xl font-bold shadow-xl shadow-blue-200 disabled:opacity-50"
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-1 gap-3 pt-6">
              {[
                { icon: Truck, text: 'Fast Delivery', sub: 'Receive within 3-5 days' },
                { icon: Shield, text: 'Secure Payment', sub: '100% encrypted checkout' },
                { icon: RotateCcw, text: 'Easy Returns', sub: '30-day money-back guarantee' }
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50">
                  <f.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{f.text}</p>
                    <p className="text-xs text-gray-400">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;