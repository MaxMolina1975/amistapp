import React, { useState, useEffect } from 'react';
import { Bell, X, MessageSquare, AlertTriangle, FileText, Info } from 'lucide-react';
import { useAlerts } from '../AlertProvider';
import { AlertType } from '../../lib/services/AlertService';

interface AlertNotificationProps {
  variant?: 'badge' | 'dropdown' | 'inline';
  limit?: number;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({
  variant = 'dropdown',
  limit = 5
}) => {
  const { alerts, unreadCount, markAsRead } = useAlerts();
  const [isOpen, setIsOpen] = useState(false);
  
  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.alert-notification-container')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  // Obtener el icono según el tipo de alerta
  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.MESSAGE:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case AlertType.REPORT:
        return <FileText className="h-4 w-4 text-orange-500" />;
      case AlertType.IMPORTANT:
        return <Info className="h-4 w-4 text-purple-500" />;
      case AlertType.EMOTIONAL:
      case AlertType.BEHAVIORAL:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case AlertType.BULLYING:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Formatear la fecha relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Ahora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h`;
    return `${Math.floor(diffInSeconds / 86400)} d`;
  };
  
  // Manejar clic en una alerta
  const handleAlertClick = (alertId: string | undefined) => {
    if (alertId) {
      markAsRead(alertId);
    }
    setIsOpen(false);
  };
  
  // Renderizar variante de badge (solo muestra contador)
  if (variant === 'badge') {
    return (
      <div className="relative">
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
    );
  }
  
  // Renderizar variante inline (muestra las últimas alertas en línea)
  if (variant === 'inline') {
    const limitedAlerts = alerts.slice(0, limit);
    
    return (
      <div className="space-y-2">
        {limitedAlerts.length > 0 ? (
          limitedAlerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-3 rounded-lg border ${alert.readStatus ? 'bg-white border-gray-200' : 'bg-violet-50 border-violet-200'}`}
              onClick={() => handleAlertClick(alert.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">{alert.description}</p>
                  {alert.createdAt && (
                    <span className="text-xs text-gray-500 mt-1 block">
                      {formatRelativeTime(alert.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-2">No hay notificaciones</p>
        )}
      </div>
    );
  }
  
  // Renderizar variante dropdown (predeterminada)
  return (
    <div className="relative alert-notification-container">
      {/* Botón de notificaciones */}
      <button 
        className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-auto">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-800">Notificaciones</h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {alerts.slice(0, limit).length > 0 ? (
              alerts.slice(0, limit).map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${!alert.readStatus ? 'bg-violet-50' : ''}`}
                  onClick={() => handleAlertClick(alert.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{alert.description}</p>
                      {alert.createdAt && (
                        <span className="text-xs text-gray-500 mt-1 block">
                          {formatRelativeTime(alert.createdAt)}
                        </span>
                      )}
                    </div>
                    {!alert.readStatus && (
                      <span className="h-2 w-2 rounded-full bg-violet-500 mt-1.5"></span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No hay notificaciones
              </div>
            )}
          </div>
          
          {alerts.length > limit && (
            <div className="p-2 border-t border-gray-200">
              <button 
                className="w-full text-center text-sm text-violet-600 hover:text-violet-800 py-1"
                onClick={() => setIsOpen(false)}
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertNotification;