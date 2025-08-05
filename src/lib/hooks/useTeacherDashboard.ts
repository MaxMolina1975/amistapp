import { useState, useEffect } from 'react';
import { teacherApi } from '../api/teacher';
import { Course, CourseMember, TeacherStats, Report } from '../types';

export function useTeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [members, setMembers] = useState<CourseMember[]>([]);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Cargar miembros cuando se selecciona un curso
  useEffect(() => {
    if (currentCourse) {
      loadCourseMembers(currentCourse.id);
    }
  }, [currentCourse]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [coursesData, statsData, reportsData] = await Promise.all([
        teacherApi.getCourses(),
        teacherApi.getStats(),
        teacherApi.getPendingReports()
      ]);

      setCourses(coursesData);
      setStats(statsData);
      setPendingReports(reportsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const loadCourseMembers = async (courseId: string) => {
    try {
      setLoading(true);
      const membersData = await teacherApi.getCourseMembers(courseId);
      setMembers(membersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los miembros');
    } finally {
      setLoading(false);
    }
  };

  // Gestión de cursos
  const createCourse = async (data: { name: string; code: string }) => {
    try {
      setError(null);
      const newCourse = await teacherApi.createCourse(data);
      setCourses(prev => [...prev, newCourse]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el curso');
      return false;
    }
  };

  const updateCourse = async (id: string, data: Partial<Course>) => {
    try {
      setError(null);
      const updatedCourse = await teacherApi.updateCourse(id, data);
      setCourses(prev => prev.map(course => 
        course.id === id ? updatedCourse : course
      ));
      if (currentCourse?.id === id) {
        setCurrentCourse(updatedCourse);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el curso');
      return false;
    }
  };

  // Gestión de estudiantes
  const addStudent = async (courseId: string, userId: string) => {
    try {
      setError(null);
      const newMember = await teacherApi.addCourseMember(courseId, userId);
      setMembers(prev => [...prev, newMember]);
      await loadDashboardData(); // Recargar estadísticas
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar estudiante');
      return false;
    }
  };

  const removeStudent = async (courseId: string, userId: string) => {
    try {
      setError(null);
      await teacherApi.removeCourseMember(courseId, userId);
      setMembers(prev => prev.filter(member => member.userId !== userId));
      await loadDashboardData(); // Recargar estadísticas
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al remover estudiante');
      return false;
    }
  };

  // Gestión de puntos
  const awardPoints = async (data: {
    courseId: string;
    userId: string;
    amount: number;
    type: 'bonus' | 'reward';
    description: string;
  }) => {
    try {
      setError(null);
      await teacherApi.awardPoints(data);
      await loadCourseMembers(data.courseId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al otorgar puntos');
      return false;
    }
  };

  const deductPoints = async (data: {
    courseId: string;
    userId: string;
    amount: number;
    type: 'penalty';
    description: string;
  }) => {
    try {
      setError(null);
      await teacherApi.deductPoints(data);
      await loadCourseMembers(data.courseId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al deducir puntos');
      return false;
    }
  };

  // Gestión de reportes
  const resolveReport = async (reportId: string, resolution: string) => {
    try {
      setError(null);
      await teacherApi.resolveReport(reportId, resolution);
      setPendingReports(prev => prev.filter(report => report.id !== reportId));
      await loadDashboardData(); // Recargar estadísticas
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al resolver el reporte');
      return false;
    }
  };

  return {
    // Estado
    courses,
    currentCourse,
    members,
    stats,
    pendingReports,
    loading,
    error,
    
    // Acciones
    setCurrentCourse,
    createCourse,
    updateCourse,
    addStudent,
    removeStudent,
    awardPoints,
    deductPoints,
    resolveReport,
    
    // Utilidades
    refresh: loadDashboardData
  };
}