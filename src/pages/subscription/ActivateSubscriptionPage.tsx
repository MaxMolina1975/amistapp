import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Check, 
  ArrowLeft, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { CreditCardForm } from '../../components/subscription/CreditCardForm';
import { subscriptionApi, PaymentDetails } from '../../lib/api/subscription';

const PLANS = [
  {
    id: 'annual',
    name: 'Plan Anual',
    description: 'Acceso completo a todas las funciones por 12 meses',
    price: 99900,
    priceString: '$999.00',
    period: 'anual',
    popular: true,
    features: [
      'Puntos ilimitados para distribuir',
      'Gestión de múltiples cursos',
      'Reportes y estadísticas avanzadas',
      'Soporte prioritario',
      'Actualizaciones gratuitas'
    ]
  },
  {
    id: 'monthly',
    name: 'Plan Mensual',
    description: 'Flexibilidad con facturación mensual',
    price: 14900,
    priceString: '$149.00',
    period: 'mensual',
    popular: false,
    features: [
      'Puntos ilimitados para distribuir',
      'Gestión de múltiples cursos',
      'Reportes básicos',
      'Soporte estándar',
      'Actualizaciones gratuitas'
    ]
  }
];

export function ActivateSubscriptionPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Seleccionar un plan
  const handleSelectPlan = (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan);
  };

  // Iniciar proceso de pago
  const handleContinue = () => {
    setShowPaymentForm(true);
  };

  // Volver atrás
  const handleGoBack = () => {
    if (showPaymentForm) {
      setShowPaymentForm(false);
    } else {
      navigate(-1);
    }
  };

  // Procesar pago
  const handlePaymentSubmit = async (paymentData: PaymentDetails) => {
    try {
      setLoading(true);
      setError(null);

      // Procesamiento de pago a través de la API
      await subscriptionApi.renew(paymentData);
      
      // Mostrar mensaje de éxito
      setSuccess(true);
      
      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate('/subscription/active');
      }, 3000);
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      setError('Error al procesar el pago. Por favor, verifica los datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <button 
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            onClick={handleGoBack}
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {showPaymentForm ? 'Volver a los planes' : 'Volver'}
          </button>

          <h1 className="text-2xl font-bold text-gray-800">
            {showPaymentForm ? 'Finalizar Compra' : 'Activar Suscripción'}
          </h1>
          <p className="text-gray-600">
            {showPaymentForm 
              ? 'Completa tus datos de pago para activar tu suscripción' 
              : 'Elige el plan que mejor se adapte a tus necesidades'}
          </p>
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

        {success ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">¡Suscripción activada con éxito!</h2>
            <p className="text-gray-600 mb-6">
              Gracias por suscribirte a Amistapp. Ya puedes disfrutar de todas las funciones premium.
            </p>
            <Button
              onClick={() => navigate('/subscription/active')}
              className="px-6"
            >
              Ver mi suscripción
            </Button>
          </div>
        ) : showPaymentForm ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detalles de pago */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos de Pago</h2>
                
                <CreditCardForm 
                  onSubmit={handlePaymentSubmit}
                  isLoading={loading}
                />
                
                <div className="mt-6 flex items-start space-x-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p>
                    Tus datos de pago están seguros y encriptados. No almacenamos tu información de tarjeta.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Resumen del pedido */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen del Pedido</h2>
                
                <div className="bg-violet-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center text-violet-700 font-medium mb-1">
                    <Crown className="w-5 h-5 mr-2" />
                    <span>{selectedPlan.name}</span>
                  </div>
                  <p className="text-sm text-violet-600">{selectedPlan.description}</p>
                </div>
                
                <div className="border-t border-b border-gray-100 py-4 my-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{selectedPlan.priceString}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>
                
                <div className="flex justify-between mb-6">
                  <span className="text-gray-800 font-semibold">Total</span>
                  <span className="text-xl font-bold text-violet-700">{selectedPlan.priceString}</span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Al completar la compra, aceptas nuestros <a href="#" className="text-violet-600 hover:underline">Términos y Condiciones</a> y <a href="#" className="text-violet-600 hover:underline">Política de Privacidad</a>.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`
                  bg-white rounded-xl overflow-hidden shadow-sm border 
                  ${selectedPlan.id === plan.id 
                    ? 'border-violet-400 ring-2 ring-violet-100' 
                    : 'border-gray-100'
                  }
                  transition-all cursor-pointer
                `}
                onClick={() => handleSelectPlan(plan)}
              >
                {plan.popular && (
                  <div className="bg-violet-600 text-white text-xs font-medium text-center py-1">
                    Más popular
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-violet-700">{plan.priceString}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${selectedPlan.id === plan.id ? '' : 'bg-violet-100 hover:bg-violet-200 text-violet-700'}`}
                    variant={selectedPlan.id === plan.id ? 'primary' : 'ghost'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan);
                    }}
                  >
                    {selectedPlan.id === plan.id ? 'Plan Seleccionado' : 'Seleccionar Plan'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!showPaymentForm && !success && (
          <div className="mt-6 flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedPlan}
            >
              Continuar con {selectedPlan?.name}
            </Button>
          </div>
        )}
        
        <div className="mt-8 bg-amber-50 rounded-lg p-4 border border-amber-100">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Entorno de Pruebas</h3>
              <p className="text-sm text-amber-700">
                Esta es una demostración. En un entorno real, se integraría con un procesador de pagos como Stripe o MercadoPago. 
                No se procesarán cargos reales en tu tarjeta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
