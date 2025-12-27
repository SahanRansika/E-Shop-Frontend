import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, RotateCcw, Package, Heart, Share2 } from 'lucide-react';
import type{ Product } from '../types';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id!);
      setProduct(data);
    } catch (error) {
      toast.error('Failed to load product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success('Added to cart!');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity);
      // Redirect to checkout
      window.location.href = '/checkout';
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const images = [
    product.image || 'https://via.placeholder.com/600',
    'https://via.placeholder.com/600/2',
    'https://via.placeholder.com/600/3',
    'https://via.placeholder.com/600/4',
  ];

  const features = [
    { icon: <Truck className="h-5 w-5" />, text: 'Free shipping on orders over $50' },
    { icon: <Shield className="h-5 w-5" />, text: '2-year warranty' },
    { icon: <RotateCcw className="h-5 w-5" />, text: '30-day return policy' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          <div className="flex space-x-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`h-20 w-20 rounded-lg overflow-hidden border-2 transition ${
                  selectedImage === index 
                    ? 'border-blue-600' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mt-6">
            <Button variant="ghost" icon={Heart}>
              Add to Wishlist
            </Button>
            <Button variant="ghost" icon={Share2}>
              Share
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-gray-600">(4.5) • 128 reviews</span>
            </div>

            <p className="text-3xl font-bold text-blue-600 mb-6">
              ${product.price.toFixed(2)}
              <span className="text-sm text-gray-500 font-normal ml-2">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </p>

            <p className="text-gray-700 mb-8">
              {product.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  {feature.icon}
                </div>
                <span className="text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Seller Info */}
          <div className="border-t border-b py-6 mb-8">
            <p className="text-gray-600 mb-2">Sold by</p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="font-semibold text-gray-700">
                  {product.seller.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{product.seller.name}</p>
                <p className="text-sm text-gray-500">⭐ 4.8 Seller Rating</p>
              </div>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-6">
            <div>
              <p className="text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="h-10 w-16 text-center flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={!product || quantity >= product.stock}
                    className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">
                  {product.stock} available
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                fullWidth
                disabled={product.stock === 0}
              >
                Add to Cart
              </Button>
              
              <Button
                onClick={handleBuyNow}
                variant="primary"
                size="lg"
                fullWidth
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>

            {product.stock === 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">
                  This product is currently out of stock
                </p>
                <p className="text-red-600 text-sm mt-1">
                  You can add it to your wishlist to be notified when it's back in stock.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;