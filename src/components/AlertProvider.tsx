import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlertService, Alert, AlertType } from '../lib/services/AlertService';
import { useAuth } from '../lib/context/AuthContext';
import BubbleNotificationManager from './notifications/BubbleNotificationManager';

interface AlertContextType {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Alert) => Promise<string | null>;
  markAsRead: (alertId: string) => Promise<boolean>;
  clearAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts debe ser usado dentro de un AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { currentUser } = useAuth();
  
  // Calcular el número de alertas no leídas
  const unreadCount = alerts.filter(alert => !alert.readStatus).length;

  useEffect(() => {
    if (!currentUser) return;

    // Configurar el manejador de alertas en tiempo real
    AlertService.setupAlertHandler((newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
      
      // Reproducir sonido si la alerta tiene sonido habilitado
      if (newAlert.sound) {
        const soundUrl = getSoundForAlertType(newAlert.type);
        playNotificationSound(soundUrl);
      }
    });

    // Limpiar al desmontar
    return () => {
      // Aquí se podría implementar una limpieza si fuera necesario
    };
  }, [currentUser]);

  // Función para obtener la URL del sonido según el tipo de alerta
  const getSoundForAlertType = (type: AlertType): string => {
    const sounds = {
      [AlertType.MESSAGE]: '/sounds/message.mp3',
      [AlertType.REPORT]: '/sounds/report.mp3',
      [AlertType.IMPORTANT]: '/sounds/important.mp3',
      [AlertType.EMOTIONAL]: '/sounds/emotional.mp3',
      [AlertType.BULLYING]: '/sounds/urgent.mp3',
      default: '/sounds/notification.mp3'
    };
    
    return sounds[type] || sounds.default;
  };

  // Función para reproducir un sonido de notificación
  const playNotificationSound = (soundUrl: string): void => {
    try {
      const audio = new Audio(soundUrl);
      audio.play().catch(error => {
        console.warn('No se pudo reproducir el sonido de notificación:', error);
      });
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  };

  // Función para añadir una nueva alerta
  const addAlert = async (alert: Alert): Promise<string | null> => {
    if (!currentUser) return null;
    
    // Asignar el ID del usuario actual como destinatario si no se especifica
    if (!alert.userId) {
      alert.userId = currentUser.id;
    }
    
    const alertId = await AlertService.createAlert(alert);
    
    if (alertId) {
      // Actualizar el estado local con la nueva alerta
      const newAlert = { ...alert, id: alertId, readStatus: false };
      setAlerts(prev => [newAlert, ...prev]);
    }
    
    return alertId;
  };

  // Función para marcar una alerta como leída
  const markAsRead = async (alertId: string): Promise<boolean> => {
    const success = await AlertService.markAlertAsRead(alertId);
    
    if (success) {
      // Actualizar el estado local
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, readStatus: true } : alert
        )
      );
    }
    
    return success;
  };

  // Función para limpiar todas las alertas
  const clearAlerts = () => {
    setAlerts([]);
  };

  const value = {
    alerts,
    unreadCount,
    addAlert,
    markAsRead,
    clearAlerts
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <BubbleNotificationManager maxNotifications={3} position="top-center" autoCloseTime={5000} />
    </AlertContext.Provider>
  );
};