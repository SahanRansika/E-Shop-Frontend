import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      {product.image ? (
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded" />
      ) : (
        <div className="bg-gray-200 h-64 rounded flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
      <p className="text-gray-600 mt-2">Rs. {product.price}</p>
      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
      <Link to={`/product/${product._id}`} className="block mt-4 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;