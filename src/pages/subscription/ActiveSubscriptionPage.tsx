import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  FileText, 
  Clock, 
  ArrowLeft
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ActiveSubscription } from '../../components/subscription/ActiveSubscription';
import { Alert } from '../../components/ui/Alert';
import { subscriptionApi } from '../../lib/api/subscription';
import { useAuth } from '../../lib/context/AuthContext';

export function ActiveSubscriptionPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<Array<{
    id: string;
    amount: number;
    date: string;
    status: 'success' | 'failed';
    last4: string;
  }>>([]);

  // Función para obtener el historial de pagos
  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const history = await subscriptionApi.getPaymentHistory();
      setPaymentHistory(history);
      setShowPaymentHistory(true);
    } catch (err) {
      console.error('Error al obtener historial de pagos:', err);
      setError('No se pudo cargar el historial de pagos');
      
      // Datos de ejemplo en caso de error
      setPaymentHistory([
        {
          id: 'pay_123456',
          amount: 99900,
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          last4: '4242'
        },
        {
          id: 'pay_123457',
          amount: 99900,
          date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'success', 
          last4: '4242'
        }
      ]);
      setShowPaymentHistory(true);
    } finally {
      setLoading(false);
    }
  };

  // Función para volver a la página anterior
  const handleGoBack = () => {
    navigate(-1);
  };

  // Función para cancelar la suscripción
  const handleCancelSubscription = async () => {
    if (!window.confirm('¿Estás seguro que deseas cancelar tu suscripción? Perderás acceso a todas las funciones premium al final del período actual.')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await subscriptionApi.cancel();
      setSuccess('Tu suscripción ha sido cancelada exitosamente. Seguirás teniendo acceso hasta el final del período actual.');
    } catch (err) {
      console.error('Error al cancelar suscripción:', err);
      setError('No se pudo cancelar la suscripción. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formatear monto en pesos
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <button 
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mi Suscripción</h1>
              <p className="text-gray-600">Administra tu suscripción y métodos de pago</p>
            </div>
          </div>
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

        {success && (
          <Alert 
            variant="success" 
            className="mb-6"
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal - Detalles de suscripción */}
          <div className="lg:col-span-2">
            <ActiveSubscription />
            
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Gestión de Suscripción</h2>
              
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/subscription/renewal')}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Actualizar método de pago
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={fetchPaymentHistory}
                  loading={loading && !showPaymentHistory}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Ver historial de pagos
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleCancelSubscription}
                  loading={loading && !showPaymentHistory}
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Cancelar suscripción
                </Button>
              </div>
            </div>
          </div>
          
          {/* Columna lateral - Información de la cuenta */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Información de la Cuenta</h2>
              
              {currentUser && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="font-medium">{currentUser.name} {currentUser.lastName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Tipo de cuenta</p>
                    <p className="font-medium capitalize">{currentUser.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Historial de pagos */}
        {showPaymentHistory && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Historial de Pagos</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPaymentHistory(false)}
              >
                Ocultar
              </Button>
            </div>
            
            {paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarjeta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentHistory.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(payment.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatAmount(payment.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">•••• {payment.last4}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status === 'success' ? 'Exitoso' : 'Fallido'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No hay pagos registrados</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
