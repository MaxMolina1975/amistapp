import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Calendar, 
  Star, 
  Shield, 
  Loader2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { SubscriptionDetails, subscriptionApi } from '../../lib/api/subscription';
import { checkServerHealth } from '../../lib/api';

interface ActiveSubscriptionProps {
  onUpgrade?: () => void;
  className?: string;
}

export function ActiveSubscription({ onUpgrade, className = '' }: ActiveSubscriptionProps) {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverConnected, setServerConnected] = useState(true);

  // Calculate days until expiration
  const daysUntilExpiration = subscription?.expiresAt 
    ? Math.ceil(
        (new Date(subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
      )
    : 0;

  // Format subscription expiration date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch subscription details
  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check server connection first
      const isConnected = await checkServerHealth();
      setServerConnected(isConnected);
      
      if (!isConnected) {
        // Use mock data if server is not available
        setSubscription({
          isActive: true,
          expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          availablePoints: 1000,
          plan: 'annual'
        });
        setError('No se pudo conectar con el servidor. Mostrando datos de demostración.');
        return;
      }
      
      // Fetch real subscription data
      const data = await subscriptionApi.getDetails();
      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('No se pudieron cargar los detalles de la suscripción');
      
      // Use mock data as fallback
      setSubscription({
        isActive: true,
        expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        availablePoints: 1000,
        plan: 'annual'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle renewal navigation
  const handleRenew = () => {
    navigate('/subscription/renewal');
  };

  // Refresh subscription data
  const handleRefresh = () => {
    fetchSubscription();
  };

  // Load subscription on mount
  useEffect(() => {
    fetchSubscription();
  }, []);

  // Show loading state
  if (loading && !subscription) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center ${className}`}>
        <Loader2 className="w-10 h-10 mx-auto mb-4 text-violet-600 animate-spin" />
        <h2 className="text-lg font-semibold text-gray-700">Cargando información de suscripción...</h2>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Error message */}
      {error && (
        <Alert 
          variant="warning" 
          className="m-4"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      {/* Subscription header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Crown className="w-6 h-6 mr-2" />
            <h2 className="text-lg font-semibold">Suscripción Anual Activa</h2>
          </div>
          {!loading && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Actualizar
            </Button>
          )}
        </div>
        
        {subscription && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 opacity-75" />
                <span>Vence:</span>
              </div>
              <span className="font-medium">{formatDate(subscription.expiresAt)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 opacity-75" />
                <span>Puntos Disponibles:</span>
              </div>
              <span className="font-medium">{subscription.availablePoints.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Subscription details */}
      {subscription && (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Estado de la Suscripción</h3>
            {subscription.isActive ? (
              <div className="flex items-center text-green-600">
                <Shield className="w-5 h-5 mr-2" />
                <span>
                  {daysUntilExpiration > 0
                    ? `Activa - ${daysUntilExpiration} días restantes`
                    : 'Expira hoy'}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span>Expirada</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Beneficios Incluidos:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-violet-600" />
                Puntos ilimitados para distribuir
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-violet-600" />
                Gestión de múltiples cursos
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-violet-600" />
                Reportes y estadísticas avanzadas
              </li>
              <li className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-violet-600" />
                Soporte prioritario
              </li>
            </ul>
          </div>

          {/* Warning for soon to expire subscriptions */}
          {subscription.isActive && daysUntilExpiration <= 30 && (
            <Alert 
              variant="warning" 
              className="my-4"
            >
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Tu suscripción expirará pronto</p>
                  <p className="text-sm">Renueva ahora para seguir disfrutando de todos los beneficios.</p>
                </div>
              </div>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex flex-col space-y-3 mt-6">
            <Button
              onClick={handleRenew}
              className="w-full"
              size="lg"
              disabled={loading || !serverConnected}
            >
              {subscription.isActive ? 'Renovar Suscripción' : 'Reactivar Suscripción'}
            </Button>
            
            {onUpgrade && (
              <Button
                onClick={onUpgrade}
                className="w-full"
                variant="outline"
                size="lg"
                disabled={loading}
              >
                Ver Otros Planes
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
