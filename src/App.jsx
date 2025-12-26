// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer'; 

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
import SellerDashboard from './pages/SellerDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar }
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Seller Routes */}
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/add-product" element={<AddProduct />} />

            {/* Optional: 404 Page */}
            <Route path="*" element={
              <div className="container mx-auto py-20 text-center">
                <h1 className="text-5xl font-bold text-red-600">404</h1>
                <p className="text-2xl mt-4">Page Not Found</p>
                <a href="/" className="mt-8 inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700">
                  Go Home
                </a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;