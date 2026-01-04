import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/payment';

interface InitiatePaymentRequest {
  orderId: string;
  // මෙතන string | number ලෙස වෙනස් කළා එවිට .toFixed(2) අගය යැවිය හැකියි
  amount: string | number; 
}

interface InitiatePaymentResponse {
  merchant_id: string;
  order_id: string;
  amount: string; // PayHere expects string with 2 decimals
  currency: string;
  hash: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
}

export const paymentService = {
  initiatePayment: async (
    data: InitiatePaymentRequest
  ): Promise<InitiatePaymentResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/initiate`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            // Auth token එකක් තිබේ නම් එයද මෙහි ඇතුළත් කරන්න
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ initiatePayment error:', error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error('Unable to initiate payment');
    }
  },
};