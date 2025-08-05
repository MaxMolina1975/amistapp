import axios from 'axios';
import { SERVER_CONFIG } from '../../config';

// Definição da interface de atividade
export interface TutorActivity {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: 'workshop' | 'meeting' | 'monitoring' | 'tutoring';
  students: number[];
  status: 'upcoming' | 'completed' | 'cancelled';
}

const api = axios.create({
  baseURL: `${SERVER_CONFIG.BASE_URL}/tutor`
});

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.error || 'Error de conexión');
  }
  throw new Error('Error inesperado');
};

export const tutorApi = {
  // Obtener actividades del tutor
  getActivities: async () => {
    try {
      const response = await api.get<TutorActivity[]>('/activities');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Obtener una actividad específica
  getActivityById: async (id: number) => {
    try {
      const response = await api.get<TutorActivity>(`/activities/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Crear una nueva actividad
  createActivity: async (data: Omit<TutorActivity, 'id'>) => {
    try {
      const response = await api.post<TutorActivity>('/activities', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Actualizar una actividad existente
  updateActivity: async (id: number, data: Partial<TutorActivity>) => {
    try {
      const response = await api.patch<TutorActivity>(`/activities/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Eliminar una actividad
  deleteActivity: async (id: number) => {
    try {
      await api.delete(`/activities/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Cambiar el estado de una actividad
  updateActivityStatus: async (id: number, status: 'upcoming' | 'completed' | 'cancelled') => {
    try {
      const response = await api.patch<TutorActivity>(`/activities/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Obtener estudiantes asociados al tutor
  getStudents: async () => {
    try {
      const response = await api.get('/students');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
};