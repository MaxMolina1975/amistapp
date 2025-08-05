import axios from 'axios';
import { Course, CourseMember, TeacherStats, PointTransaction, Report } from '../types';
import { SERVER_CONFIG } from '../../config';

const api = axios.create({
  baseURL: `${SERVER_CONFIG.BASE_URL}/teacher`
});

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.error || 'Error de conexión');
  }
  throw new Error('Error inesperado');
};

export const teacherApi = {
  // Gestión de cursos
  getCourses: async () => {
    try {
      const response = await api.get<Course[]>('/courses');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getCourseById: async (id: string) => {
    try {
      const response = await api.get<Course>(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  createCourse: async (data: { name: string; code: string }) => {
    try {
      const response = await api.post<Course>('/courses', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateCourse: async (id: string, data: Partial<Course>) => {
    try {
      const response = await api.patch<Course>(`/courses/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Gestión de estudiantes
  getCourseMembers: async (courseId: string) => {
    try {
      const response = await api.get<CourseMember[]>(`/courses/${courseId}/members`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  addCourseMember: async (courseId: string, userId: string) => {
    try {
      const response = await api.post<CourseMember>(`/courses/${courseId}/members`, { userId });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  removeCourseMember: async (courseId: string, userId: string) => {
    try {
      await api.delete(`/courses/${courseId}/members/${userId}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Gestión de puntos
  awardPoints: async (data: {
    courseId: string;
    userId: string;
    amount: number;
    type: 'bonus' | 'reward';
    description: string;
  }) => {
    try {
      const response = await api.post<PointTransaction>('/points/award', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  deductPoints: async (data: {
    courseId: string;
    userId: string;
    amount: number;
    type: 'penalty';
    description: string;
  }) => {
    try {
      const response = await api.post<PointTransaction>('/points/deduct', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Estadísticas
  getStats: async (courseId?: string) => {
    try {
      const response = await api.get<TeacherStats>('/stats', {
        params: { courseId }
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Reportes
  getPendingReports: async () => {
    try {
      const response = await api.get<Report[]>('/reports/pending');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  resolveReport: async (reportId: string, resolution: string) => {
    try {
      const response = await api.post<Report>(`/reports/${reportId}/resolve`, { resolution });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
};