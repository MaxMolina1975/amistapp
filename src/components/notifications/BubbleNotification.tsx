import React, { useState, useEffect } from 'react';
import { AlertType, Alert } from '../../lib/services/AlertService';
import { MessageSquare, FileText, Info, AlertTriangle, Bell } from 'lucide-react';

interface BubbleNotificationProps {
  alert: Alert;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  position?: 'top-right' | 'top-left' | 'top-center';
}

const BubbleNotification: React.FC<BubbleNotificationProps> = ({
  alert,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
  position = 'top-center'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Mostrar la notificación con un pequeño retraso para la animación
    setTimeout(() => setIsVisible(true), 100);

    // Configurar cierre automático si está habilitado
    let closeTimer: NodeJS.Timeout;
    if (autoClose) {
      closeTimer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }

    return () => {
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [autoClose, autoCloseTime]);

  // Manejar el cierre con animación
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duración de la animación de salida
  };

  // Obtener el icono según el tipo de alerta
  const getAlertIcon = () => {
    switch (alert.type) {
      case AlertType.MESSAGE:
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case AlertType.REPORT:
        return <FileText className="h-5 w-5 text-orange-500" />;
      case AlertType.IMPORTANT:
        return <Info className="h-5 w-5 text-purple-500" />;
      case AlertType.EMOTIONAL:
      case AlertType.BEHAVIORAL:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case AlertType.BULLYING:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Obtener el color de fondo según el tipo de alerta
  const getBgColor = () => {
    switch (alert.type) {
      case AlertType.MESSAGE:
        return 'bg-blue-50 border-blue-200';
      case AlertType.REPORT:
        return 'bg-orange-50 border-orange-200';
      case AlertType.IMPORTANT:
        return 'bg-purple-50 border-purple-200';
      case AlertType.EMOTIONAL:
      case AlertType.BEHAVIORAL:
        return 'bg-yellow-50 border-yellow-200';
      case AlertType.BULLYING:
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Obtener las clases de posición
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
      default:
        return 'top-4 left-1/2 transform -translate-x-1/2';
    }
  };

  return (
    <div
      className={`fixed ${getPositionClasses()} z-50 transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} ${isExiting ? 'opacity-0 translate-y-4' : ''}`}
    >
      <div className={`max-w-xs w-full p-4 rounded-lg shadow-lg border ${getBgColor()} flex items-start gap-3`}>
        <div className="flex-shrink-0 mt-0.5">
          {getAlertIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{alert.title}</h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{alert.description}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BubbleNotification;