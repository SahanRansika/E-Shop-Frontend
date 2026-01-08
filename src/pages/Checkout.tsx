import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore'; 
import { useAuthStore } from '../store/authStore'; 
import { paymentService } from '../services/paymentService';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ShoppingBag, MapPin, ChevronRight, Phone, Loader2, Package, Lock } from 'lucide-react';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, clearCart } = useCartStore(); 
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: user?.name || "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    zipCode: ""
  });

  // --- Pricing Calculations ---
  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // Rs. 5000 ta wadi nam Free, natham Rs. 350
    return subtotal > 5000 || subtotal === 0 ? 0 : 350;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handlePayHereCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.street || !formData.city) {
      toast.error('Please enter delivery details');
      return;
    }

    setIsProcessing(true);

    try {
      const finalAmount = calculateTotal();

      // 1. Backend Order eka sadehima
      const orderResponse = await api.post('/orders', {
        products: items.map(item => ({ 
          product: item.product._id, 
          quantity: item.quantity 
        })),
        total: finalAmount, 
        address: { 
          street: formData.street, 
          city: formData.city, 
          phone: formData.phone,
          zipCode: formData.zipCode 
        }
      });

      const newOrder = orderResponse.data;

      // 2. Hash eka laba ganima
      const paymentData = await paymentService.initiatePayment({
        orderId: newOrder._id, 
        amount: finalAmount, 
      });

      // 3. PayHere Form eka sehdima
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payhere.lk/pay/checkout';

      const dataToPost = {
        merchant_id: paymentData.merchant_id,
        return_url: `${window.location.origin}/order-success?orderId=${newOrder._id}`,
        cancel_url: `${window.location.origin}/payment-failed`,
        notify_url: paymentData.notify_url, 
        order_id: paymentData.order_id,
        items: "E-Shop Order",
        currency: "LKR",
        amount: paymentData.amount,
        hash: paymentData.hash,
        first_name: formData.firstName.split(' ')[0],
        last_name: formData.firstName.split(' ')[1] || "User", // Buyer -> User
        email: user?.email || "",
        phone: formData.phone,
        address: formData.street,
        city: formData.city,
        country: "Sri Lanka",
      };

      Object.entries(dataToPost).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      clearCart(); 
      form.submit(); 

    } catch (error: any) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.message || 'Payment initialization failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50/50">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200">
          <ChevronRight className="w-6 h-6 rotate-180 text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <ShoppingBag className="text-blue-600 w-8 h-8" /> Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-4">
              <MapPin className="w-5 h-5 text-blue-600" /> Delivery Information
            </h2>
            <form id="checkout-form" className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handlePayHereCheckout}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Customer Name</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">City</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-600">Street Address</label>
                <input type="text" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3.5 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="07XXXXXXXX" required />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" /> Order Summary
            </h2>
            
            <div className="space-y-4 mb-6 max-h-[240px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-3 items-center">
                  <img 
                    src={(item.product as any).image || (item.product as any).images?.[0] || 'https://via.placeholder.com/50'} 
                    className="w-12 h-12 rounded-lg object-cover bg-gray-50"
                    alt={item.product.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} x Rs. {item.product.price}</p>
                  </div>
                  <p className="text-sm font-bold">Rs. {item.product.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>Rs. {calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className={calculateShipping() === 0 ? "text-green-600 font-bold" : ""}>
                  {calculateShipping() === 0 ? "Free" : `Rs. ${calculateShipping().toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t mt-2">
                <span>Total</span>
                <span className="text-blue-600">Rs. {calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <button 
              form="checkout-form" 
              type="submit" 
              disabled={isProcessing || items.length === 0} 
              className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <>Confirm and Pay <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              <Lock className="w-3 h-3" /> Secure User Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;