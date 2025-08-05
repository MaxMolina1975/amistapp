import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

// Configuración correcta de Firebase - con valores de respaldo de la app real
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAT_mVw1sV0UpH1FcJtUzE_7h6Lya5xTCE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "amistaap-chat.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "amistaap-chat",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "amistaap-chat.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "427257534293",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:427257534293:web:7b8f83b889f8eb7d6e854d"
};

// Variable para debug
console.log('Firebase config:', JSON.stringify({
  apiKey: firebaseConfig.apiKey ? 'PRESENTE' : 'AUSENTE',
  authDomain: firebaseConfig.authDomain ? 'PRESENTE' : 'AUSENTE',
  projectId: firebaseConfig.projectId ? 'PRESENTE' : 'AUSENTE',
  appId: firebaseConfig.appId ? 'PRESENTE' : 'AUSENTE'
}));

// Inicializar app o obtener la instancia existente
let firebaseApp;

// Verificar que tenemos una configuración válida antes de inicializar
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "AIzaSyAT_mVw1sV0UpH1FcJtUzE_7h6Lya5xTCE") {
  console.warn(' Usando configuración de Firebase predeterminada. Para un entorno de producción, configura tus propias claves.');
}

try {
  if (getApps().length === 0) {
    // No hay apps - inicializar una nueva
    firebaseApp = initializeApp(firebaseConfig);
    console.log(' Firebase inicializado correctamente');
  } else {
    // Ya existe una app - obtener la primera instancia
    firebaseApp = getApp();
    console.log(' Usando instancia existente de Firebase');
  }
} catch (error: any) {
  console.error(' Error al inicializar Firebase:', error?.message || error);
  // En lugar de lanzar el error, pasamos a una instancia nula
  console.warn(' Funcionando sin Firebase debido a un error de inicialización');
}

// Exportar servicios de Firebase con verificación de app válida
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;

// Inicializar messaging solo si estamos en un navegador, soporta service workers y tenemos app válida
let messaging: any = null;
if (firebaseApp && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(firebaseApp);
    console.log(' Firebase Messaging inicializado correctamente');
  } catch (error: any) {
    console.error(' Error al inicializar Firebase Messaging:', error?.message || error);
  }
}

export { messaging };
