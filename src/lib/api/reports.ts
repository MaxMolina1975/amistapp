import { apiClient } from './client';
import { Report, ReportStats, ReportType, ReportPriority } from '../types';
import { supabase } from '../../supabase/client';

// Datos simulados para desarrollo y demostración
const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    type: 'bullying',
    title: 'Incidente en el patio',
    description: 'Un estudiante está siendo acosado durante el recreo por un grupo de compañeros.',
    priority: 'high',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 días atrás
    updatedAt: new Date(Date.now() - 86400000 * 2),
    userId: 'teacher123',
    anonymous: false,
    studentName: 'Carlos Rodríguez',
    location: 'Patio de recreo',
    date: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'bullying',
    title: 'Acoso en redes sociales',
    description: 'Varios estudiantes están publicando comentarios ofensivos sobre otro estudiante en redes sociales.',
    priority: 'urgent',
    status: 'in_review',
    createdAt: new Date(Date.now() - 86400000), // 1 día atrás
    updatedAt: new Date(Date.now() - 43200000), // 12 horas atrás
    userId: 'teacher123',
    anonymous: true,
    location: 'Redes sociales',
    date: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'bullying',
    title: 'Exclusión constante',
    description: 'Una estudiante está siendo constantemente excluida de actividades grupales por sus compañeros.',
    priority: 'medium',
    status: 'resolved',
    createdAt: new Date(Date.now() - 86400000 * 5), // 5 días atrás
    updatedAt: new Date(Date.now() - 86400000 * 3), // 3 días atrás
    resolvedAt: new Date(Date.now() - 86400000 * 3),
    resolution: 'Se realizó una intervención con el grupo y se establecieron actividades de integración supervisadas.',
    userId: 'teacher123',
    anonymous: false,
    studentName: 'María López',
    location: 'Aula 203',
    date: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 días atrás
  }
];

const MOCK_STATS: ReportStats = {
  total: 3,
  pending: 1,
  resolved: 1,
  urgent: 1,
  weeklyReports: 2
};

interface ReportData {
  type: string;
  description: string;
  location: string;
  date: string;
  time: string;
  studentName?: string;
  studentGrade?: string;
  isAnonymous: boolean;
  status: 'pending' | 'in_review' | 'resolved';
  courseId: string;
}

export const reportsApi = {
  // Get all reports for user
  getReports: async (userId?: string) => {
    try {
      // Para entornos de desarrollo/demo, devolver datos simulados
      if (process.env.NODE_ENV === 'development' || process.env.VITE_USE_MOCK_DATA === 'true') {
        console.log('Usando datos simulados para reportes');
        return MOCK_REPORTS;
      }

      // Verificar si se proporcionó un ID de usuario
      if (!userId || userId.trim() === '') {
        try {
          // Intentar obtener el ID del usuario de la sesión
          const session = await supabase.auth.getSession();
          userId = session.data.session?.user?.id;
          
          // Si no hay userId, intentar obtenerlo del localStorage
          if (!userId) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              try {
                const user = JSON.parse(storedUser);
                userId = user.id?.toString();
              } catch (e) {
                console.error('Error al parsear usuario almacenado:', e);
              }
            }
            
            // Si aún no hay userId, usar uno predeterminado para desarrollo
            if (!userId) {
              console.warn('Usuario no autenticado, usando datos simulados');
              return MOCK_REPORTS;
            }
          }
        } catch (authError) {
          console.error('Error al obtener sesión:', authError);
          return MOCK_REPORTS; // Devolver datos simulados en caso de error de autenticación
        }
      }

      // Configurar un timeout para la petición
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await apiClient.get<Report[]>('/reports', {
          params: { userId },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        return response.data.map(report => ({
          ...report,
          createdAt: new Date(report.createdAt),
          updatedAt: new Date(report.updatedAt),
          resolvedAt: report.resolvedAt ? new Date(report.resolvedAt) : undefined
        }));
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error fetching reports:', error);
        // Si estamos en desarrollo y hay un error, devolver datos simulados como fallback
        if (process.env.NODE_ENV === 'development') {
          console.log('Fallback: Usando datos simulados para reportes debido a un error');
          return MOCK_REPORTS;
        }
        throw new Error(`Error al obtener los reportes: ${error instanceof Error ? error.message : 'Error de conexión'}`);
      }
    } catch (error) {
      console.error('Error general al obtener reportes:', error);
      return MOCK_REPORTS; // Retorno por defecto en caso de error general
    }
    return MOCK_REPORTS; // Retorno por defecto si ninguna condición anterior se cumple
  },

  // Get report statistics
  getStats: async () => {
    try {
      // Para entornos de desarrollo/demo, devolver datos simulados
      if (process.env.NODE_ENV === 'development' || process.env.VITE_USE_MOCK_DATA === 'true') {
        console.log('Usando datos simulados para estadísticas');
        return MOCK_STATS;
      }

      // Intentar obtener datos con un timeout para evitar esperas largas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        // Intentar obtener el ID del usuario de la sesión
        const session = await supabase.auth.getSession();
        let userId = session.data.session?.user?.id;
        
        // En lugar de lanzar error, usar el ID del usuario almacenado en localStorage
        if (!userId) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              userId = user.id?.toString();
            } catch (e) {
              console.error('Error al parsear usuario almacenado:', e);
            }
          }
          
          // Si aún no hay userId, usar uno predeterminado para desarrollo
          if (!userId && (process.env.NODE_ENV === 'development' || process.env.VITE_USE_MOCK_DATA === 'true')) {
            userId = 'demo-user-id';
            console.log('Usando ID de usuario demo para desarrollo');
          } else if (!userId) {
            throw new Error('Usuario no autenticado');
          }
        }

        const response = await apiClient.get<ReportStats>('/reports/stats', {
          params: { userId },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response.data;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('Error al obtener estadísticas de reportes:', fetchError);
        console.log('Usando datos simulados como respaldo debido a error de conexión');
        return MOCK_STATS; // Usar datos simulados como fallback
      }
    } catch (error) {
      console.error('Error general al obtener estadísticas de reportes:', error);
      return MOCK_STATS; // Siempre devolver datos simulados en caso de error
    }
  },

  // Create a new report
  createReport: async (data: {
    type: ReportType;
    title: string;
    description: string;
    priority: ReportPriority;
    anonymous: boolean;
  }) => {
    try {
      // Intentar obtener el ID del usuario de la sesión
      const session = await supabase.auth.getSession();
      let userId = session.data.session?.user?.id;
      
      // En lugar de lanzar error, usar el ID del usuario almacenado en localStorage
      if (!userId) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            userId = user.id?.toString();
          } catch (e) {
            console.error('Error al parsear usuario almacenado:', e);
          }
        }
        
        // Si aún no hay userId, usar uno predeterminado para desarrollo
        if (!userId && (process.env.NODE_ENV === 'development' || process.env.VITE_USE_MOCK_DATA === 'true')) {
          userId = 'demo-user-id';
          console.log('Usando ID de usuario demo para desarrollo');
        } else if (!userId) {
          throw new Error('Usuario no autenticado');
        }
      }

      const response = await apiClient.post<Report>('/reports', {
        ...data,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw new Error('Error al crear el reporte');
    }
  },

  // Update report status
  updateReportStatus: async (reportId: string, status: Report['status'], resolution?: string) => {
    try {
      // Intentar obtener el ID del usuario de la sesión
      const session = await supabase.auth.getSession();
      let userId = session.data.session?.user?.id;
      
      // En lugar de lanzar error, usar el ID del usuario almacenado en localStorage
      if (!userId) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            userId = user.id?.toString();
          } catch (e) {
            console.error('Error al parsear usuario almacenado:', e);
          }
        }
        
        // Si aún no hay userId, usar uno predeterminado para desarrollo
        if (!userId && (process.env.NODE_ENV === 'development' || process.env.VITE_USE_MOCK_DATA === 'true')) {
          userId = 'demo-user-id';
          console.log('Usando ID de usuario demo para desarrollo');
        } else if (!userId) {
          throw new Error('Usuario no autenticado');
        }
      }

      const response = await apiClient.patch<Report>(`/reports/${reportId}`, {
        status,
        resolution,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating report:', error);
      throw new Error('Error al actualizar el reporte');
    }
  },

  // Delete report
  deleteReport: async (reportId: string) => {
    try {
      // Intentar obtener el ID del usuario de la sesión
      const session = await supabase.auth.getSession();
      let userId = session.data.session?.user?.id;
      
      // En lugar de lanzar error, usar el ID del usuario almacenado en localStorage
      if (!userId) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            userId = user.id?.toString();
          } catch (e) {
            console.error('Error al parsear usuario almacenado:', e);
          }
        }
        
        // Si aún no hay userId, usar uno predeterminado para desarrollo
        if (!userId && (process.env.NODE_ENV === 'development' || process.env.VITE_USE_MOCK_DATA === 'true')) {
          userId = 'demo-user-id';
          console.log('Usando ID de usuario demo para desarrollo');
        } else if (!userId) {
          throw new Error('Usuario no autenticado');
        }
      }

      await apiClient.delete(`/reports/${reportId}`, {
        params: { userId }
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      throw new Error('Error al eliminar el reporte');
    }
  },

  // Submit a new report
  submitReport: async (reportData: ReportData) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          ...reportData,
          created_at: new Date().toISOString(),
          status: 'pending'
        }]);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error submitting report:', err);
      throw new Error('Error al enviar el reporte');
    }
  },

  // Get teacher reports
  getTeacherReports: async (teacherId: string) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching reports:', err);
      throw new Error('Error al obtener los reportes');
    }
  },

  // Update report status
  updateReportStatusNew: async (reportId: string, status: 'pending' | 'in_review' | 'resolved') => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating report status:', err);
      throw new Error('Error al actualizar el estado del reporte');
    }
  }
};