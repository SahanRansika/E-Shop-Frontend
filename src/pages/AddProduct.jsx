import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    try {
      await api.post('/products', formData);
      alert('Product added successfully!');
      navigate('/shop');
    } catch (err) {
      alert('Error adding product');
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <input type="text" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded mb-4" required />
        <textarea placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} className="w-full p-3 border rounded mb-4" required />
        <input type="number" placeholder="Price" onChange={e => setForm({...form, price: e.target.value})} className="w-full p-3 border rounded mb-4" required />
        <input type="number" placeholder="Stock" onChange={e => setForm({...form, stock: e.target.value})} className="w-full p-3 border rounded mb-4" required />
        <input type="file" onChange={e => setForm({...form, image: e.target.files[0]})} className="mb-6" />
        <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;