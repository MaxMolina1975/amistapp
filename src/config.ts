const isDev = process.env.NODE_ENV === 'development';

// Recolectar hostname y puerto de la URL actual
const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
const currentPort = typeof window !== 'undefined' ? window.location.port : '';
const currentProtocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https' : 'http';

export const SERVER_CONFIG = {
  // En desarrollo usamos localhost, en producción el hostname actual
  IP: isDev ? 'localhost' : (currentHost || 'hostybee.com'),
  
  // Puerto de la API - en desarrollo es 3007, en producción usamos el puerto configurado
  PORT: isDev ? 3007 : 3007, // Puerto 3007 tanto en desarrollo como producción
  
  // Protocolo - http en desarrollo, https en producción
  PROTOCOL: isDev ? 'http' : 'https',
  
  // URL base construida dinámicamente
  get BASE_URL() {
    if (isDev) {
      return `http://localhost:${this.PORT}/api`;
    }
    // En producción, usar la URL relativa para evitar problemas de CORS
    return '/api';
  },
  
  // Versión completa de la URL base (para casos donde necesitamos la URL absoluta)
  get FULL_BASE_URL() {
    return `${this.PROTOCOL}://${this.IP}:${this.PORT}/api`;
  }
};

export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hora
};

export const API_ENDPOINTS = {
  // Endpoints de autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  
  // Endpoints para profesores
  TEACHER: {
    STUDENTS: '/teacher/students',
    REPORTS: '/teacher/reports',
    ACTIVITIES: '/teacher/activities',
    STUDENT_POINTS: (studentId: number | string) => `/students/${studentId}/points`,
  },
  
  // Endpoints para tutores
  TUTOR: {
    STUDENTS: '/tutor/students',
    NOTIFICATIONS: '/tutor/notifications'
  },
  
  // Endpoints para estudiantes
  STUDENT: {
    REWARDS: '/student/rewards',
    EMOTIONS: '/student/emotions',
    POINTS: '/student/points'
  },
  
  // Endpoints generales
  USERS: '/users',
  EMOTIONS: '/emotions',
  REPORTS: '/reports',
  REWARDS: '/rewards',
  COURSES: '/courses',
  SUBSCRIPTION: {
    DETAILS: 'subscription',
    RENEW: 'subscription/renew',
    CANCEL: 'subscription/cancel',
    PAYMENT_HISTORY: 'subscription/payments'
  },
  
  // Endpoint de salud del servidor
  HEALTH: '/health',
};