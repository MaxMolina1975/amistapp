/**
 * Registra el service worker para las notificaciones push
 * @returns Promise<ServiceWorkerRegistration | null>
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registrado con éxito:', registration);
      return registration;
    } catch (error) {
      console.error('Error al registrar el Service Worker:', error);
      return null;
    }
  }
  
  console.log('Service Worker no está soportado en este navegador');
  return null;
};

/**
 * Comprueba si las notificaciones están soportadas y disponibles
 * @returns boolean - true si las notificaciones están disponibles
 */
export const areNotificationsAvailable = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

/**
 * Comprueba el estado actual del permiso de notificaciones
 * @returns 'granted' | 'denied' | 'default'
 */
export const getNotificationPermissionStatus = (): NotificationPermission => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  return Notification.permission;
};

/**
 * Muestra una notificación simple
 * @param title Título de la notificación
 * @param options Opciones de la notificación
 */
export const showSimpleNotification = (
  title: string, 
  body: string, 
  icon: string = '/logo192.png',
  clickUrl?: string
): void => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    const options: NotificationOptions = {
      body,
      icon,
      badge: '/favicon.ico',
      data: clickUrl ? { url: clickUrl } : undefined
    };
    
    const notification = new Notification(title, options);
    
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
      
      if (clickUrl) {
        window.location.href = clickUrl;
      }
    };
  } catch (error) {
    console.error('Error al mostrar notificación:', error);
  }
};
