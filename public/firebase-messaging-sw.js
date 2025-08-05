// Este archivo es el Service Worker para las notificaciones de Firebase

// Nombres de cachés para la aplicación
const CACHE_NAME = "amistapp-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/main.chunk.js",
  "/static/js/0.chunk.js",
  "/static/js/bundle.js",
  "/sounds/notification.mp3",
  "/sounds/message.mp3",
  "/sounds/report.mp3",
  "/sounds/important.mp3",
  "/sounds/emotional.mp3",
  "/sounds/urgent.mp3"
];

// Scripts para Firebase
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Configuración de Firebase - debe coincidir con la configuración en la aplicación
firebase.initializeApp({
  apiKey: "AIzaSyAT_mVw1sV0UpH1FcJtUzE_7h6Lya5xTCE",
  authDomain: "amistaap-chat.firebaseapp.com",
  projectId: "amistaap-chat",
  storageBucket: "amistaap-chat.appspot.com",
  messagingSenderId: "427257534293",
  appId: "1:427257534293:web:7b8f83b889f8eb7d6e854d"
});

// Inicializar Firebase Messaging
const messaging = firebase.messaging();

// Función para reproducir sonido de notificación
const playNotificationSound = (soundUrl) => {
  // En el service worker no podemos usar directamente el API de Audio
  // Pero podemos usar la API de Cache para asegurarnos de que el sonido esté disponible
  return caches.match(soundUrl).then((response) => {
    // El sonido está en caché y listo para ser usado por la notificación
    console.log(`Sonido disponible: ${soundUrl}`);
    return true;
  }).catch(error => {
    console.error(`Error al acceder al sonido: ${soundUrl}`, error);
    return false;
  });
};

// Función para determinar la prioridad de la notificación según el tipo de alerta
const getPriorityForAlertType = (alertType) => {
  switch(alertType) {
    case 'bullying':
      return 'high';
    case 'important':
    case 'emotional':
      return 'default';
    default:
      return 'low';
  }
};

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Recibido mensaje en segundo plano ', payload);
  
  // Determinar el tipo de alerta y el sonido correspondiente
  let soundUrl = '/sounds/notification.mp3';
  let alertType = 'default';
  
  if (payload.data && payload.data.alertType) {
    alertType = payload.data.alertType;
    switch(alertType) {
      case 'message':
        soundUrl = '/sounds/message.mp3';
        break;
      case 'report':
        soundUrl = '/sounds/report.mp3';
        break;
      case 'important':
        soundUrl = '/sounds/important.mp3';
        break;
      case 'emotional':
        soundUrl = '/sounds/emotional.mp3';
        break;
      case 'bullying':
        soundUrl = '/sounds/urgent.mp3';
        break;
    }
  }
  
  // Personalizar notificación aquí
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Nueva notificación';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.description || 'Tienes una nueva notificación',
    icon: '/logo192.png',
    badge: '/badge-icon.png',
    data: {
      ...payload.data,
      url: payload.data?.url || '/',
      timestamp: Date.now(),
      soundUrl: soundUrl,
      alertType: alertType,
      priority: getPriorityForAlertType(alertType)
    },
    // Vibración para dispositivos móviles - patrón más intenso para alertas prioritarias
    vibrate: alertType === 'bullying' ? [300, 100, 300, 100, 300] : [200, 100, 200],
    // Asegurar que la notificación sea visible
    requireInteraction: true,
    // Tag para agrupar notificaciones similares
    tag: payload.data?.tag || `amistapp-${Date.now()}`,
    // Acciones que puede realizar el usuario
    actions: [
      {
        action: 'view',
        title: 'Ver ahora',
      },
      {
        action: 'close',
        title: 'Cerrar',
      }
    ]
  };

  // Intentar reproducir el sonido (aunque esto tiene limitaciones en el service worker)
  playNotificationSound(soundUrl);

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Event listener para la instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event listener para interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Event listener para hacer clic en la notificación
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notificación clickeada');
  
  event.notification.close();
  
  // Si hay una URL en los datos, abrir esa ventana
  if (event.notification.data && event.notification.data.url) {
    const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
    
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then((windowClients) => {
        // Verificar si ya hay una ventana con la URL deseada abierta
        const matchingClient = windowClients.find((client) => {
          return client.url === urlToOpen;
        });
        
        if (matchingClient) {
          // Si hay una ventana con la URL, enfocarla
          return matchingClient.focus();
        } else {
          // Si no hay una ventana con la URL, abrir una nueva
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});
