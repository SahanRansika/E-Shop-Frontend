import React, { useState } from 'react';
import type { Product } from '../../types';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

interface ProductFormState {
  name: string;
  description: string;
  price: number;
  stock: number;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProductFormState>({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'stock'
          ? Number(value) || 0
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (formData.stock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price.toString());
      data.append('stock', formData.stock.toString());

      if (imageFile) {
        data.append('image', imageFile);
      }

      await onSubmit(data);
      toast.success(product ? 'Product updated!' : 'Product created!');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Operation failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Product Image</label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {isSubmitting
              ? product
                ? 'Updating...'
                : 'Creating...'
              : product
              ? 'Update Product'
              : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
