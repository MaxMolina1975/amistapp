/**
 * Configuración de la API para diferentes entornos
 */

// Configuración para entorno de producción
const PRODUCTION_API_URL = 'https://amistapp.cl/api';

// Configuración para entorno de desarrollo
const DEVELOPMENT_API_URL = 'http://localhost:3007/api';

// Determinar qué URL usar según el entorno
const API_URL = import.meta.env.PROD ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;

export default {
  API_URL,
  // Aquí se pueden agregar otras configuraciones relacionadas con la API
  TIMEOUT: 30000, // Timeout en milisegundos
  RETRY_ATTEMPTS: 3, // Número de intentos de reconexión
};