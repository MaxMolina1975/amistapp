import React, { useState, useEffect } from 'react';
import { Alert } from '../../lib/services/AlertService';
import BubbleNotification from './BubbleNotification';
import { useAlerts } from '../AlertProvider';

interface BubbleNotificationManagerProps {
  maxNotifications?: number;
  position?: 'top-right' | 'top-left' | 'top-center';
  autoCloseTime?: number;
}

const BubbleNotificationManager: React.FC<BubbleNotificationManagerProps> = ({
  maxNotifications = 3,
  position = 'top-center',
  autoCloseTime = 5000
}) => {
  const { alerts, markAsRead } = useAlerts();
  const [visibleNotifications, setVisibleNotifications] = useState<Alert[]>([]);
  const [isAppActive, setIsAppActive] = useState<boolean>(true);

  // Detectar cuando la app está activa o en segundo plano
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsAppActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Monitorear nuevas alertas y mostrarlas como burbujas cuando la app no está activa
  useEffect(() => {
    // Solo mostrar notificaciones cuando la app está en segundo plano
    if (!isAppActive && alerts.length > 0) {
      // Obtener alertas no leídas que no estén ya visibles
      const unreadAlerts = alerts.filter(
        alert => !alert.readStatus && !visibleNotifications.some(n => n.id === alert.id)
      );

      if (unreadAlerts.length > 0) {
        // Añadir nuevas alertas a las visibles, respetando el máximo
        const newVisibleAlerts = [...visibleNotifications];
        
        for (const alert of unreadAlerts) {
          if (newVisibleAlerts.length < maxNotifications) {
            newVisibleAlerts.push(alert);
          } else {
            break;
          }
        }

        setVisibleNotifications(newVisibleAlerts);
      }
    }
  }, [alerts, isAppActive, visibleNotifications, maxNotifications]);

  // Manejar el cierre de una notificación
  const handleCloseNotification = (alertId: string | undefined) => {
    if (alertId) {
      // Marcar como leída en el sistema
      markAsRead(alertId);
      
      // Eliminar de las notificaciones visibles
      setVisibleNotifications(prev => prev.filter(alert => alert.id !== alertId));
    }
  };

  // No renderizar nada si la app está activa o no hay notificaciones
  if (isAppActive || visibleNotifications.length === 0) {
    return null;
  }

  return (
    <>
      {visibleNotifications.map((alert, index) => (
        <BubbleNotification
          key={alert.id || index}
          alert={alert}
          position={position}
          autoCloseTime={autoCloseTime}
          onClose={() => handleCloseNotification(alert.id)}
        />
      ))}
    </>
  );
};

export default BubbleNotificationManager;