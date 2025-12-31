import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../../types/types';
import Button from '../ui/Button';
import { useCartStore } from '../../store/cartStore';
import { cartService } from '../../services/cartService';
import { useAuthStore } from '../../store/authStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const BACKEND_URL = 'http://localhost:5000';
  const fallbackImage = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=400&auto=format&fit=crop";
  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `${BACKEND_URL}/${product.image}`)
    : fallbackImage;

  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = async () => {
    try {
      // 1️⃣ Local cart update
      addItem(product, 1);
      console.log('✅ Added to local cart:', useCartStore.getState().items);

      // 2️⃣ Backend sync if logged in
      if (isAuthenticated) {
        const res = await cartService.addToCart(product._id, 1);
        console.log('✅ Added to backend cart:', res);
      }

    } catch (err) {
      console.error('❌ Failed to add to cart:', err);
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 flex flex-col h-full">
      
      {/* Product Image Section */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = fallbackImage;
          }}
        />
        
        {/* Hover Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-gray-700 transition-colors">
            <Eye size={20} />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-blue-600 shadow-sm uppercase">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-gray-400 block mb-1 font-medium tracking-wider uppercase">Price</span>
            <span className="text-2xl font-black text-blue-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <Button 
            variant="primary" 
            size="sm" 
            icon={ShoppingCart} 
            className="rounded-2xl px-4"
            onClick={handleAddToCart}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
