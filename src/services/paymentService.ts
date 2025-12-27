import api from './api';

export interface InitiatePaymentPayload {
  orderId: string;
  amount: number;
}

export interface PaymentData {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  order_id: string;
  amount: number;
  currency: string;
  hash: string;
}

export interface VerifyPaymentResponse {
  paymentId: string;
  orderId: string;
  status: 'success' | 'failed' | 'pending';
  paidAt?: string;
}

export interface PaymentHistoryItem {
  _id: string;
  orderId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  createdAt: string;
}

export const paymentService = {
  async initiatePayment(data: InitiatePaymentPayload): Promise<PaymentData> {
    const response = await api.post<PaymentData>('/payments/initiate', data);
    return response.data;
  },

  async verifyPayment(paymentId: string): Promise<VerifyPaymentResponse> {
    const response = await api.get<VerifyPaymentResponse>(`/payments/verify/${paymentId}`);
    return response.data;
  },

  async getPaymentHistory(): Promise<PaymentHistoryItem[]> {
    const response = await api.get<PaymentHistoryItem[]>('/payments/history');
    return response.data;
  },
};
