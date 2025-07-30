import React from 'react';
import { Crown, Calendar, Star, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

interface SubscriptionDetailsProps {
  subscription: {
    isActive: boolean;
    expiresAt: string;
    availablePoints: number;
  };
  onRenew: () => void;
}

export function SubscriptionDetails({ subscription, onRenew }: SubscriptionDetailsProps) {
  const daysUntilExpiration = Math.ceil(
    (new Date(subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center mb-4">
          <Crown className="w-6 h-6 mr-2" />
          <h2 className="text-lg font-semibold">Suscripción Anual</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 opacity-75" />
              <span>Vence:</span>
            </div>
            <span className="font-medium">{new Date(subscription.expiresAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 opacity-75" />
              <span>Puntos Disponibles:</span>
            </div>
            <span className="font-medium">{subscription.availablePoints}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Estado de la Suscripción</h3>
          {subscription.isActive ? (
            <div className="flex items-center text-green-600">
              <Shield className="w-5 h-5 mr-2" />
              <span>Activa - {daysUntilExpiration} días restantes</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <Shield className="w-5 h-5 mr-2" />
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

        <Button
          onClick={onRenew}
          className="w-full mt-6"
          size="lg"
        >
          Renovar Suscripción
        </Button>
      </div>
    </div>
  );
}