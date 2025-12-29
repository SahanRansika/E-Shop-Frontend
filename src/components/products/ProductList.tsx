import React from 'react';
import ProductCard from './ProductCard';
import type{ Product } from '../../types/types';
import { Grid, Package } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  title?: string;
  emptyMessage?: string;
  columns?: 1 | 2 | 3 | 4;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  title, 
  emptyMessage = "No products found",
  columns = 4 
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Grid className="h-5 w-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <span className="text-gray-600">{products.length} products</span>
        </div>
      )}
      
      <div className={`grid gap-6 ${gridClasses[columns]}`}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;