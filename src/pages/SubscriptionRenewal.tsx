import React, { useState } from 'react';
import { Crown, AlertTriangle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';
import { CreditCardForm } from '../components/subscription/CreditCardForm';
import { SubscriptionDetails } from '../components/subscription/SubscriptionDetails';

export function SubscriptionRenewal() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Get from API
  const subscription = {
    isActive: true,
    expiresAt: '2025-03-20',
    availablePoints: 850
  };

  const handlePaymentSubmit = async (paymentData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
  }) => {
    try {
      setIsProcessing(true);
      setError(null);

      // TODO: Implement payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular éxito
      setShowPaymentModal(false);
      // TODO: Actualizar datos de suscripción
    } catch (err) {
      setError('Error al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Suscripción</h1>
        <p className="text-gray-600">Gestiona tu suscripción y beneficios</p>
      </header>

      {error && (
        <Alert 
          variant="error" 
          className="mb-6"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <SubscriptionDetails
        subscription={subscription}
        onRenew={() => setShowPaymentModal(true)}
      />

      <Modal
        isOpen={showPaymentModal}
        onClose={() => !isProcessing && setShowPaymentModal(false)}
        title="Renovar Suscripción"
      >
        <div className="p-4">
          <div className="bg-violet-50 p-4 rounded-lg mb-6">
            <div className="flex items-center text-violet-600 font-medium mb-2">
              <Crown className="w-5 h-5 mr-2" />
              <span>Plan Anual</span>
            </div>
            <p className="text-sm text-violet-600">
              Tu suscripción se renovará por 12 meses adicionales
            </p>
          </div>

          <CreditCardForm
            onSubmit={handlePaymentSubmit}
            isLoading={isProcessing}
          />

          <div className="mt-6 flex items-start space-x-2 text-sm text-gray-500">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
            <p>
              Los pagos son procesados de forma segura. Tu información de tarjeta no será almacenada.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}