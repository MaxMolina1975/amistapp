import axios from 'axios';
import { SERVER_CONFIG } from '../../config';

// Cliente base para todas las peticiones API
export const apiClient = axios.create({
  baseURL: SERVER_CONFIG.BASE_URL,
  timeout: 10000, // Aumentado a 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
});

// Configuración específica para entorno de producción
if (typeof window !== 'undefined' && window.location.hostname === 'hostybee.com') {
  // Sobrescribir la URL base cuando estamos en hostybee.com
  apiClient.defaults.baseURL = 'https://hostybee.com:3687/api';
  console.log('Usando URL de API en producción:', apiClient.defaults.baseURL);
}

// Verificar estado del servidor
export const checkServerHealth = async () => {
  try {
    // Para entornos de desarrollo/demo, simulamos datos
    if (process.env.NODE_ENV === 'development' || process.env.VITE_USE_MOCK_DATA === 'true') {
      console.log('Usando datos simulados, omitiendo verificación del servidor');
      return true;
    }
    
    // Intentar conectar con el servidor
    const response = await fetch(`${apiClient.defaults.baseURL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000) // Timeout de 3 segundos
    });
    
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

// Interceptor para manejar errores
apiClient.interceptors.request.use(async (config) => {
  // Verificar la salud del servidor antes de cada petición
  try {
    const isServerHealthy = await checkServerHealth();
    if (!isServerHealthy) {
      console.error('Servidor no disponible');
      throw new Error('Error de conexión: Verifica que el servidor esté activo');
    }
  } catch (error) {
    console.error('Error al verificar la salud del servidor:', error);
    // Continuamos con la petición aunque falle la verificación
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Error del servidor
      console.error('Error de respuesta:', error.response.data);
      throw new Error(error.response.data?.error || `Error del servidor: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      // Error de red
      console.error('Error de red:', error.request);
      throw new Error('Error de conexión. Verifica tu conexión a internet y que el servidor esté activo.');
    } else {
      // Error de configuración
      console.error('Error de configuración:', error.message);
      throw new Error('Error al procesar la solicitud');
    }
  }
);

// La exportación de apiClient ya se realizó al inicio del archivo