import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import type{ Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success('Added to cart!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${product._id}`}>
        <div className="h-48 overflow-hidden">
          <img
            src={product.image || 'https://via.placeholder.com/300x200'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.stock < 10 && product.stock > 0 && (
              <p className="text-sm text-orange-600">Only {product.stock} left!</p>
            )}
          </div>

          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-gray-600">4.5</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            Seller: {product.seller.name}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;