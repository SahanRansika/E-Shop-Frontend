import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore'; 
import { useAuthStore } from '../store/authStore'; 
import { paymentService } from '../services/paymentService';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ShoppingBag, MapPin, CreditCard, ChevronRight } from 'lucide-react';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, clearCart } = useCartStore(); 
  const { user } = useAuthStore();

  // පාරිභෝගිකයාගේ ලිපිනය (Form එකක් හරහා මෙය ලබාගත හැක)
  const [address, setAddress] = useState({
    street: "No 1, Main Street",
    city: "Colombo",
    zipCode: "10100"
  });

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const handlePayHereCheckout = async () => {
    // 1. Validation
    if (!user) {
      toast.error('Please login to proceed');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const currentTotal = calculateTotal();
    setIsProcessing(true);

    try {
      // 2. Backend එකේ නව Order එකක් සෑදීම
      const orderResponse = await api.post('/orders', {
        products: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        total: currentTotal,
        address: address 
      });

      const newOrder = orderResponse.data;

      // 3. Backend එකෙන් PayHere Hash එක සහ Credentials ලබා ගැනීම
      const paymentData = await paymentService.initiatePayment({
        orderId: newOrder._id, 
        amount: currentTotal,
      });

      // 4. PayHere Sandbox වෙත යොමු කිරීමට Form එකක් සෑදීම
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payhere.lk/pay/checkout';

      const dataToPost = {
        merchant_id: paymentData.merchant_id,
        return_url: paymentData.return_url,
        cancel_url: paymentData.cancel_url,
        notify_url: paymentData.notify_url,
        order_id: paymentData.order_id,
        items: `Order #${newOrder._id}`,
        currency: paymentData.currency,
        amount: paymentData.amount, 
        hash: paymentData.hash,     
        first_name: user.name || "Customer",
        last_name: "", 
        email: user.email || "customer@example.com",
        address: address.street,
        city: address.city,
        country: "Sri Lanka",
      };

      // Hidden Inputs එකතු කිරීම
      Object.entries(dataToPost).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      
      // Cart එක Clear කිරීම (පේමන්ට් එකට යන්න පෙර)
      clearCart();
      
      form.submit(); // PayHere වෙත Redirect කිරීම

    } catch (error: any) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.message || 'Payment initialization failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShoppingBag className="text-blue-600" /> Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* වම් පස - Order විස්තර සහ ලිපිනය */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" /> Shipping Address
            </h2>
            <div className="text-gray-600 text-sm">
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p>{address.street},</p>
              <p>{address.city} {address.zipCode}</p>
              <p>Sri Lanka</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-500" /> Payment Method
            </h2>
            <div className="flex items-center justify-between p-3 border rounded-xl bg-blue-50 border-blue-200">
              <span className="text-sm font-medium text-blue-700">PayHere Gateway (LKR)</span>
              <img src="https://www.payhere.lk/downloads/images/payhere_long_banner.png" alt="PayHere" className="h-6" />
            </div>
          </div>
        </div>

        {/* දකුණු පස - මිල ගණන් විස්තරය */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.product._id} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{item.product.name} × {item.quantity}</span>
                <span className="font-semibold text-gray-800">Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>Rs. {calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
              <span>Total</span>
              <span>Rs. {calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handlePayHereCheckout} 
            disabled={isProcessing} 
            className={`w-full mt-8 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
              isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isProcessing ? 'Processing...' : (
              <>
                Confirm and Pay <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <p className="text-[10px] text-gray-400 mt-4 text-center uppercase tracking-widest">
            Secure Payment Powered by PayHere
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;