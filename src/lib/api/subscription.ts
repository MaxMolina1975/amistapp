import axios from 'axios';
import { SERVER_CONFIG } from '../../config';

const api = axios.create({
  baseURL: `${SERVER_CONFIG.BASE_URL}/api/subscription`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface SubscriptionDetails {
  isActive: boolean;
  expiresAt: string;
  availablePoints: number;
  plan: 'annual' | 'monthly';
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
}

export const subscriptionApi = {
  // Obtener detalles de la suscripción
  getDetails: () =>
    api.get<SubscriptionDetails>('/').then(res => res.data),

  // Procesar renovación
  renew: (paymentDetails: PaymentDetails) =>
    api.post<SubscriptionDetails>('/renew', paymentDetails).then(res => res.data),

  // Cancelar suscripción
  cancel: () =>
    api.post<void>('/cancel').then(res => res.data),

  // Obtener historial de pagos
  getPaymentHistory: () =>
    api.get<Array<{
      id: string;
      amount: number;
      date: string;
      status: 'success' | 'failed';
      last4: string;
    }>>('/payments').then(res => res.data)
};