// Tipos para estadísticas y perfiles de estudiantes
import { useState, useEffect } from 'react';

export interface StudentStats {
  id: number;
  studentId: number;
  emotionalIndex: number; // Índice de 0 a 100 sobre bienestar emocional
  participationRate: number; // Porcentaje de participación en actividades
  attendanceRate: number; // Porcentaje de asistencia
  points: number; // Puntos acumulados
  achievementsCount: number; // Número de logros desbloqueados
  lastUpdate: string; // Fecha de última actualización
  weeklyMood: {
    // Registro semanal de estado de ánimo
    monday?: number;
    tuesday?: number;
    wednesday?: number;
    thursday?: number;
    friday?: number;
  };
  // Métricas específicas de habilidades socioemocionales (escala 1-10)
  skills: {
    communication: number;
    teamwork: number;
    empathy: number;
    selfRegulation: number;
    conflictResolution: number;
  };
  // Métricas adicionales para visualización en tarjeta de estadísticas
  academicPerformance: number; // Rendimiento académico (0-100)
  emotionalWellbeing: number; // Bienestar emocional (0-100)
  socialParticipation: number; // Participación social (0-100)
  attendance: number; // Asistencia (0-100)
  trends: {
    emotionalIndex: number; // Cambio en el índice emocional en los últimos 30 días
    pointsEarned: number; // Puntos ganados en los últimos 30 días
  };
}

export interface Student {
  id: number | string;
  name: string;
  lastName: string;
  email?: string;
  grade: string;
  group: string;
  age: number;
  tutorId?: number;
  tutorName?: string;
  tutorEmail?: string;
  profileImage?: string;
  status: 'active' | 'inactive';
  // Campos adicionales para formularios
  phone?: string;
  birthDate?: string;
  address?: string;
  tutorPhone?: string;
  observations?: string;
  // Nuevos campos de información personal
  preferredName?: string;
  hobbies?: string[];
  interests?: string[];
}

// Para uso en el dashboard de docentes y tutores
export interface StudentWithStats extends Student {
  stats: StudentStats;
}

// Mock data para desarrollo y pruebas - ahora vacío
export const mockStudents: StudentWithStats[] = [];

// Función para obtener estudiantes reales desde la API
import { studentApi } from '../api/student';
import { useAuth } from '../context/AuthContext';

export async function getStudentsFromAPI(token: string, teacherId?: string, tutorId?: string): Promise<StudentWithStats[]> {
    try {
        if (!token) {
            throw new Error('No hay token de autenticación disponible');
        }
        
        return await studentApi.getStudents(token, teacherId, tutorId);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        return [];
    }
}

// Hook para usar en componentes
export function useStudents(teacherId?: string, tutorId?: string) {
    const [students, setStudents] = useState<StudentWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    const loadStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
            if (!authToken) {
                throw new Error('No hay token de autenticación disponible');
            }
            
            const data = await getStudentsFromAPI(authToken, teacherId, tutorId);
            setStudents(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadStudents();
        }
    }, [isAuthenticated, teacherId, tutorId]);

    return { students, loading, error, refetch: loadStudents };
}
