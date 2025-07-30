import axios from 'axios';
import apiConfig from '../config/apiConfig';

// Configuración base para axios
const api = axios.create({
  baseURL: apiConfig.API_URL,
  timeout: apiConfig.TIMEOUT,
});

// Interceptor para agregar el token de autenticación a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Si no hay token, podría ser un problema de sesión expirada
      console.warn('No se encontró token de autenticación para la solicitud');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación (401)
    if (error.response && error.response.status === 401) {
      console.error('Error de autenticación:', error.response.data);
      // Limpiar token y redirigir al login
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    } 
    // Manejar errores de conexión al servidor
    else if (!error.response) {
      console.error('Error de conexión al servidor:', error.message);
      // Aquí podríamos mostrar un mensaje de error de conexión
    }
    // Manejar otros errores del servidor (500, etc)
    else {
      console.error(`Error del servidor (${error.response.status}):`, error.response.data);
    }
    return Promise.reject(error);
  }
);

// Servicios para cada entidad
export const usersService = {
  getAll: () => api.get('/admin/users'),
  getById: (id) => api.get(`/admin/users/${id}`),
  create: (data) => api.post('/admin/users', data),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
};

export const teachersService = {
  getAll: () => api.get('/admin/teachers'),
  getById: (id) => api.get(`/admin/teachers/${id}`),
  create: (data) => api.post('/admin/teachers', data),
  update: (id, data) => api.put(`/admin/teachers/${id}`, data),
  delete: (id) => api.delete(`/admin/teachers/${id}`),
};

export const studentsService = {
  getAll: () => api.get('/admin/students'),
  getById: (id) => api.get(`/admin/students/${id}`),
  create: (data) => api.post('/admin/students', data),
  update: (id, data) => api.put(`/admin/students/${id}`, data),
  delete: (id) => api.delete(`/admin/students/${id}`),
};

export const tutorsService = {
  getAll: () => api.get('/admin/tutors'),
  getById: (id) => api.get(`/admin/tutors/${id}`),
  create: (data) => api.post('/admin/tutors', data),
  update: (id, data) => api.put(`/admin/tutors/${id}`, data),
  delete: (id) => api.delete(`/admin/tutors/${id}`),
};

export const reportsService = {
  getAll: () => api.get('/admin/reports'),
  getById: (id) => api.get(`/admin/reports/${id}`),
  create: (data) => api.post('/admin/reports', data),
  update: (id, data) => api.put(`/admin/reports/${id}`, data),
  delete: (id) => api.delete(`/admin/reports/${id}`),
};

export const rewardsService = {
  getAll: () => api.get('/admin/rewards'),
  getById: (id) => api.get(`/admin/rewards/${id}`),
  create: (data) => api.post('/admin/rewards', data),
  update: (id, data) => api.put(`/admin/rewards/${id}`, data),
  delete: (id) => api.delete(`/admin/rewards/${id}`),
};

export const activitiesService = {
  getAll: () => api.get('/admin/activities'),
  getById: (id) => api.get(`/admin/activities/${id}`),
  create: (data) => api.post('/admin/activities', data),
  update: (id, data) => api.put(`/admin/activities/${id}`, data),
  delete: (id) => api.delete(`/admin/activities/${id}`),
};

export const achievementsService = {
  getAll: () => api.get('/admin/achievements'),
  getById: (id) => api.get(`/admin/achievements/${id}`),
  create: (data) => api.post('/admin/achievements', data),
  update: (id, data) => api.put(`/admin/achievements/${id}`, data),
  delete: (id) => api.delete(`/admin/achievements/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/admin/dashboard/stats'),
};

export const authService = {
  login: (credentials) => api.post('/login', credentials),
  verifyToken: () => api.get('/verify-token'),
};

export default {
  users: usersService,
  teachers: teachersService,
  students: studentsService,
  tutors: tutorsService,
  reports: reportsService,
  rewards: rewardsService,
  activities: activitiesService,
  achievements: achievementsService,
  dashboard: dashboardService,
  auth: authService,
};