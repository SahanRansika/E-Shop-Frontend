import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full rounded-lg" />
          ) : (
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-xl">No Image</span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-3xl text-blue-600 mt-4">Rs. {product.price}</p>
          <p className="text-gray-600 mt-6">{product.description}</p>
          <p className="mt-4">Stock: {product.stock}</p>
          <button className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;