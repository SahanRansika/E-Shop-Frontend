import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Shield, CreditCard, MapPin } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

interface PaymentData {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  order_id: string;
  amount: number;
  currency: string;
  hash: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'payhere'>('card');

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka',
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Truck className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to proceed to checkout.</p>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name === 'number') value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    if (e.target.name === 'expiry') value = value.replace(/\D/g, '').replace(/(.{2})/g, '$1/').slice(0, 5);
    if (e.target.name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    setCardDetails({ ...cardDetails, [e.target.name]: value });
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      return;
    }

    if (!address.street || !address.city || !address.zipCode) {
      toast.error('Please fill in all address fields');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error('Please fill in all card details');
        return;
      }
      if (cardDetails.number.replace(/\s/g, '').length !== 16) {
        toast.error('Invalid card number');
        return;
      }
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (paymentMethod === 'payhere') {
        const paymentData: PaymentData = await paymentService.initiatePayment({
          orderId: `ORDER_${Date.now()}`,
          amount: total,
        });

        window.location.href =
          `https://sandbox.payhere.lk/pay/checkout` +
          `?merchant_id=${paymentData.merchant_id}` +
          `&return_url=${paymentData.return_url}` +
          `&cancel_url=${paymentData.cancel_url}` +
          `&order_id=${paymentData.order_id}` +
          `&items=Order` +
          `&amount=${paymentData.amount}` +
          `&currency=${paymentData.currency}` +
          `&hash=${paymentData.hash}`;
      } else {
        setShowPaymentModal(true);
        clearCart();
      }
    } catch (error) {
      toast.error('Failed to process order');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Shipping Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <MapPin className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">Shipping Address</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Street" name="street" value={address.street} onChange={handleAddressChange} required />
          <Input label="City" name="city" value={address.city} onChange={handleAddressChange} required />
          <Input label="State" name="state" value={address.state} onChange={handleAddressChange} />
          <Input label="ZIP Code" name="zipCode" value={address.zipCode} onChange={handleAddressChange} required />
          <Input label="Country" name="country" value={address.country} onChange={handleAddressChange} disabled />
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">Payment Method</h2>
        </div>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
            <span>Credit/Debit Card</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" checked={paymentMethod === 'payhere'} onChange={() => setPaymentMethod('payhere')} />
            <span>PayHere</span>
          </label>
        </div>

        {paymentMethod === 'card' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Card Number" name="number" value={cardDetails.number} onChange={handleCardChange} />
            <Input label="Name" name="name" value={cardDetails.name} onChange={handleCardChange} />
            <Input label="Expiry" name="expiry" value={cardDetails.expiry} onChange={handleCardChange} />
            <Input label="CVV" name="cvv" value={cardDetails.cvv} onChange={handleCardChange} />
          </div>
        )}
      </div>

      <Button onClick={handlePlaceOrder} fullWidth loading={isProcessing}>
        {paymentMethod === 'payhere' ? 'Proceed to PayHere' : 'Place Order'}
      </Button>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          navigate('/orders');
        }}
        title="Order Confirmed!"
        size="sm"
      >
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Thank You for Your Order!</h3>
          <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
          <Button onClick={() => navigate('/orders')} fullWidth>
            View Orders
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;
