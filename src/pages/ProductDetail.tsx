import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, BadgeCheck } from 'lucide-react';
import type { Product } from '../types/types';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { cartService } from '../services/cartService';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await productService.getById(id);
          setProduct(data);
        }
      } catch (error) {
        toast.error('භාණ්ඩයේ තොරතුරු ලබා ගත නොහැක');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleConfirmAdd = async () => {
    if (product) {
      addItem(product, quantity);
      if (isAuthenticated) await cartService.addToCart(product._id, quantity);
      toast.success("සාර්ථකව එක් කළා!");
      navigate('/'); // නැවත මුල් පිටුවට යැවීම
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product) return <div className="p-20 text-center">Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 mb-8 font-bold">
        <ArrowLeft size={20} className="mr-2"/> Back to Shop
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-3xl border shadow-sm">
          <img src={product.image} alt={product.name} className="w-full h-auto object-contain rounded-2xl"/>
        </div>
        <div className="space-y-6">
          <BadgeCheck className="text-blue-600" size={32}/>
          <h1 className="text-4xl font-black text-gray-900">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
          <p className="text-gray-500 text-lg leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-4 bg-gray-100 w-fit p-1 rounded-2xl">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 bg-white rounded-xl shadow-sm"><Minus size={18}/></button>
            <span className="w-8 text-center font-bold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="p-2 bg-white rounded-xl shadow-sm"><Plus size={18}/></button>
          </div>
          <Button onClick={handleConfirmAdd} size="lg" className="w-full py-5 rounded-2xl">
            Confirm & Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;