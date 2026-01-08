import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import SellerManagement from './pages/SellerManagement';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products" element={<Shop />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        
        {/* Protected Routes */}
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* --- PayHere Redirect Routes (අලුතින් එක් කරන ලදී) --- */}
        <Route
          path="order-success"
          element={
            <ProtectedRoute>
              <Orders /> {/* ගෙවීමෙන් පසු Orders පිටුවට යොමු කරයි */}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="payment-failed"
          element={
            <ProtectedRoute>
              <Checkout /> {/* අසාර්ථක වුවහොත් නැවත Checkout එකට යොමු කරයි */}
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/sellers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SellerManagement />
            </ProtectedRoute>
          }
        />
        
        {/* Error handling */}
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        
      </Route>
    </Routes>
  );
}

export default App;