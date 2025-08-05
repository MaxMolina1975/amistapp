import { Messaging, getToken, onMessage } from 'firebase/messaging';
import { db, messaging } from '../firebase';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { NotificationService } from './notificationService';

// Tipos de alerta que maneja el sistema
export enum AlertType {
  EMOTIONAL = 'emotional',
  ACADEMIC = 'academic',
  BEHAVIORAL = 'behavioral',
  ATTENDANCE = 'attendance',
  BULLYING = 'bullying',
  MESSAGE = 'message',
  REPORT = 'report',
  IMPORTANT = 'important'
}

// Estructura de una alerta en el sistema
export interface Alert {
  id?: string;
  studentId?: number;
  userId?: number | string; // ID del usuario destinatario
  type: AlertType;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  createdAt?: string;
  createdBy?: number | string;
  status?: 'pending' | 'in_progress' | 'resolved';
  assignedTo?: number;
  resolvedAt?: string;
  resolvedBy?: number;
  sound?: boolean; // Indica si la alerta debe reproducir sonido
  readStatus?: boolean; // Indica si la alerta ha sido leída
}

/**
 * Servicio para manejar alertas y notificaciones de la aplicación
 */
export class AlertService {
  private static readonly ALERTS_COLLECTION = 'alerts';
  private static readonly NOTIFICATION_SOUNDS = {
    [AlertType.MESSAGE]: '/sounds/message.mp3',
    [AlertType.REPORT]: '/sounds/report.mp3',
    [AlertType.IMPORTANT]: '/sounds/important.mp3',
    [AlertType.EMOTIONAL]: '/sounds/emotional.mp3',
    [AlertType.BULLYING]: '/sounds/urgent.mp3',
    default: '/sounds/notification.mp3'
  };

  /**
   * Crea una nueva alerta en el sistema
   * @param alert Datos de la alerta
   * @returns ID de la alerta creada
   */
  static async createAlert(alert: Alert): Promise<string | null> {
    try {
      if (!db) {
        console.error('Firebase no está inicializado');
        return null;
      }

      // Añadir campos de timestamp si no existen
      const alertData = {
        ...alert,
        createdAt: alert.createdAt || new Date().toISOString(),
        status: alert.status || 'pending',
        sound: alert.sound !== undefined ? alert.sound : true,
        readStatus: false
      };

      // Guardar en Firestore
      const alertsRef = collection(db, this.ALERTS_COLLECTION);
      const docRef = await addDoc(alertsRef, alertData);

      console.log(`Alerta creada con ID: ${docRef.id}`);

      // Enviar notificación si hay destinatarios
      if (alert.userId) {
        await this.sendAlertNotification(alert.userId.toString(), alertData);
      }

      return docRef.id;
    } catch (error) {
      console.error('Error al crear alerta:', error);
      return null;
    }
  }

  /**
   * Envía una notificación de alerta al usuario
   * @param userId ID del usuario destinatario
   * @param alert Datos de la alerta
   */
  static async sendAlertNotification(userId: string, alert: Alert): Promise<void> {
    try {
      // Determinar el sonido según el tipo de alerta
      const soundUrl = this.getSoundForAlertType(alert.type);
      
      // Verificar si la aplicación está en segundo plano
      const isAppInBackground = document.hidden;
      
      // Configurar opciones de notificación
      const notificationOptions: NotificationOptions = {
        body: alert.description,
        icon: '/logo192.png',
        badge: '/badge-icon.png',
        data: {
          url: this.getUrlForAlertType(alert.type, alert.studentId),
          alertId: alert.id,
          alertType: alert.type
        },
        // Añadir sonido para navegadores que lo soportan
        silent: false,
        vibrate: [200, 100, 200],
        tag: `amistapp-alert-${alert.type}-${Date.now()}`
      };

      // Enviar a través del servicio de notificaciones
      NotificationService.showNotification(alert.title, notificationOptions);

      // Reproducir sonido (esto funcionará cuando la app esté abierta)
      if (alert.sound) {
        this.playNotificationSound(soundUrl);
      }

      // Si Firebase Messaging está disponible, enviar también como notificación push
      // Esto permitirá que suene incluso cuando la app no esté en uso
      if (messaging) {
        // Aquí se implementaría el envío a través de Firebase Cloud Messaging
        // Esto requiere una implementación en el backend
        console.log('Enviando notificación push a través de FCM');
      }
    } catch (error) {
      console.error('Error al enviar notificación de alerta:', error);
    }
  }

  /**
   * Obtiene la URL de destino según el tipo de alerta
   */
  private static getUrlForAlertType(type: AlertType, studentId?: number): string {
    switch (type) {
      case AlertType.MESSAGE:
        return '/mensajes';
      case AlertType.REPORT:
        return '/reportes';
      case AlertType.EMOTIONAL:
      case AlertType.BEHAVIORAL:
      case AlertType.BULLYING:
        return studentId ? `/estudiantes/${studentId}` : '/estudiantes';
      case AlertType.ACADEMIC:
        return studentId ? `/estudiantes/${studentId}/academico` : '/estudiantes';
      case AlertType.ATTENDANCE:
        return studentId ? `/estudiantes/${studentId}/asistencia` : '/estudiantes';
      default:
        return '/';
    }
  }

  /**
   * Obtiene la URL del sonido según el tipo de alerta
   */
  private static getSoundForAlertType(type: AlertType): string {
    return this.NOTIFICATION_SOUNDS[type] || this.NOTIFICATION_SOUNDS.default;
  }

  /**
   * Reproduce un sonido de notificación
   */
  private static playNotificationSound(soundUrl: string): void {
    try {
      const audio = new Audio(soundUrl);
      audio.play().catch(error => {
        console.warn('No se pudo reproducir el sonido de notificación:', error);
      });
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  }

  /**
   * Marca una alerta como leída
   */
  static async markAlertAsRead(alertId: string): Promise<boolean> {
    try {
      if (!db) {
        return false;
      }

      const alertRef = doc(db, this.ALERTS_COLLECTION, alertId);
      await setDoc(alertRef, { readStatus: true }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error al marcar alerta como leída:', error);
      return false;
    }
  }

  /**
   * Configura el manejador para recibir alertas en tiempo real
   */
  static setupAlertHandler(callback: (alert: Alert) => void): void {
    if (!messaging) {
      console.log('Firebase Messaging no está disponible');
      return;
    }

    try {
      // Configurar manejador para mensajes en primer plano
      onMessage(messaging as Messaging, (payload) => {
        console.log('Alerta recibida en primer plano:', payload);
        
        if (payload.data && payload.data.alertType) {
          const alertData: Alert = {
            id: payload.data.alertId,
            type: payload.data.alertType as AlertType,
            title: payload.notification?.title || 'Nueva alerta',
            description: payload.notification?.body || '',
            severity: (payload.data.severity as 'low' | 'medium' | 'high') || 'medium',
            sound: payload.data.sound !== 'false'
          };
          
          // Reproducir sonido si corresponde
          if (alertData.sound) {
            this.playNotificationSound(this.getSoundForAlertType(alertData.type));
          }
          
          // Ejecutar callback con los datos de la alerta
          callback(alertData);
        }
      });
    } catch (error) {
      console.error('Error al configurar manejador de alertas:', error);
    }
  }
}