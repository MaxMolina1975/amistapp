import { Messaging, getToken, onMessage } from 'firebase/messaging';
import { db, messaging } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Servicio para manejar notificaciones de la aplicación
 */
export class NotificationService {
  private static readonly TOKENS_COLLECTION = 'notification_tokens';

  /**
   * Solicita permiso para recibir notificaciones y guarda el token
   * @param userId ID del usuario actual
   * @returns Token de notificación o null si el usuario rechazó los permisos
   */
  static async requestPermission(userId: string | number): Promise<string | null> {
    try {
      // Convertir userId a string si es número
      const userIdStr = userId.toString();
      
      // Comprobar si el navegador soporta notificaciones
      if (!('Notification' in window)) {
        console.log('Este navegador no soporta notificaciones web');
        return null;
      }

      // Solicitar permiso
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('Permiso de notificación denegado');
        return null;
      }

      // Si Firebase Messaging está disponible, obtener token
      if (messaging) {
        try {
          const currentToken = await getToken(messaging as Messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY || 
                      'BDmWEEfPHk1Q9-E0LCjpBP0hLza4QA3W9QIUo52ZTJzr2hRfQUXgG4CAlUhXXw-a5-m_6JOl1dP1dZqLRTMsM2E'
          });

          if (currentToken) {
            // Guardar token en Firestore
            await this.saveToken(userIdStr, currentToken);
            return currentToken;
          } else {
            console.log('No se pudo obtener el token. Quizás necesites registrar el service worker.');
            return null;
          }
        } catch (error) {
          console.error('Error al obtener token de notificación:', error);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error al solicitar permiso de notificación:', error);
      return null;
    }
  }

  /**
   * Guarda el token de notificación del usuario en Firestore
   */
  private static async saveToken(userId: string, token: string): Promise<void> {
    try {
      const userTokenRef = doc(db, this.TOKENS_COLLECTION, userId);
      
      // Comprobar si ya existe un documento para este usuario
      const docSnap = await getDoc(userTokenRef);
      
      if (docSnap.exists()) {
        // Actualizar documento existente
        const tokens = docSnap.data().tokens || [];
        
        // Si el token ya existe, no hacer nada
        if (tokens.includes(token)) {
          return;
        }
        
        // Añadir nuevo token
        await setDoc(userTokenRef, { 
          tokens: [...tokens, token],
          updatedAt: new Date().toISOString()
        });
      } else {
        // Crear nuevo documento
        await setDoc(userTokenRef, { 
          tokens: [token],
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error al guardar token de notificación:', error);
    }
  }

  /**
   * Configura el handler para mensajes en primer plano
   * @param callback Función a ejecutar cuando se recibe un mensaje
   */
  static setupMessageHandler(callback: (payload: any) => void): void {
    if (!messaging) {
      console.log('Firebase Messaging no está disponible');
      return;
    }

    try {
      onMessage(messaging as Messaging, (payload) => {
        console.log('Mensaje recibido en primer plano:', payload);
        callback(payload);
      });
    } catch (error) {
      console.error('Error al configurar manejador de mensajes:', error);
    }
  }

  /**
   * Muestra una notificación web
   * @param title Título de la notificación
   * @param options Opciones de la notificación
   */
  static showNotification(title: string, options: NotificationOptions): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, options);
      
      // Manejar clic en la notificación
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();
        
        // Navegar a la ruta especificada en la opción data.url si existe
        if (options.data && options.data.url) {
          window.location.href = options.data.url;
        }
      };
    } catch (error) {
      console.error('Error al mostrar notificación:', error);
    }
  }
}
