import axios from 'axios';

// Configuración dinámica de la URL base
const getBaseURL = () => {
  // En desarrollo
  if (import.meta.env.DEV) {
    return 'http://localhost:3007/api';
  }
  
  // En producción, usar URL relativa para evitar problemas de CORS
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
