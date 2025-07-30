import { useState, useEffect } from 'react';
import { Report, ReportStats, ReportType, ReportPriority } from '../types';
import { reportsApi } from '../api/reports';

export function useReports(userId: string, isTeacher: boolean = false) {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Verificar si tenemos un ID de usuario válido
  const isValidUserId = userId && userId.trim() !== '';

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar si el usuario está autenticado con un ID válido
      if (!isValidUserId) {
        throw new Error('Usuario no autenticado');
      }
      
      // Intentar obtener datos con un timeout para evitar esperas largas
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tiempo de espera agotado')), 5000);
      });
      
      const [reportsData, statsData] = await Promise.all([
        Promise.race([reportsApi.getReports(userId), timeoutPromise]),
        Promise.race([reportsApi.getStats(), timeoutPromise])
      ]);
      
      setReports(reportsData || []);
      setStats(statsData || {
        total: 0,
        pending: 0,
        resolved: 0,
        urgent: 0,
        byType: {} as Record<ReportType, number>,
        byPriority: {} as Record<ReportPriority, number>
      });
    } catch (err) {
      console.error('Error en fetchReports:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los reportes');
      
      // Intentar obtener datos simulados como fallback
      try {
        const [mockReports, mockStats] = await Promise.all([
          reportsApi.getReports(),
          reportsApi.getStats()
        ]);
        
        if (mockReports && mockReports.length > 0) {
          setReports(mockReports);
          setStats(mockStats || {
            total: 0,
            pending: 0,
            resolved: 0,
            urgent: 0,
            byType: {} as Record<ReportType, number>,
            byPriority: {} as Record<ReportPriority, number>
          });
          setError('Usando datos simulados debido a problemas de conexión');
        } else {
          // Inicializar con datos vacíos para prevenir errores undefined
          setReports([]);
          setStats({
            total: 0,
            pending: 0,
            resolved: 0,
            urgent: 0,
            weeklyReports: 0
          });
        }
      } catch (fallbackErr) {
        console.error('Error en fallback:', fallbackErr);
        // Inicializar con datos vacíos para prevenir errores undefined
        setReports([]);
        setStats({
          total: 0,
          pending: 0,
          resolved: 0,
          urgent: 0,
          byType: {} as Record<ReportType, number>,
          byPriority: {} as Record<ReportPriority, number>
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [userId, isTeacher]);

  const createReport = async (data: {
    type: ReportType;
    title: string;
    description: string;
    priority: ReportPriority;
    anonymous: boolean;
  }) => {
    try {
      setError(null);
      const newReport = await reportsApi.createReport(data);
      setReports(prev => [newReport, ...prev]);
      const statsData = await reportsApi.getStats();
      setStats(statsData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el reporte');
      return false;
    }
  };

  const updateReportStatus = async (reportId: string, status: Report['status'], resolution?: string) => {
    try {
      setError(null);
      const updatedReport = await reportsApi.updateReportStatus(reportId, status, resolution);
      setReports(prev =>
        prev.map(report => report.id === reportId ? updatedReport : report)
      );
      const statsData = await reportsApi.getStats();
      setStats(statsData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado del reporte');
      return false;
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      setError(null);
      await reportsApi.deleteReport(reportId);
      setReports(prev => prev.filter(report => report.id !== reportId));
      const statsData = await reportsApi.getStats();
      setStats(statsData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el reporte');
      return false;
    }
  };

  return {
    reports,
    stats,
    loading,
    error,
    createReport,
    updateReportStatus,
    deleteReport,
    refreshReports: fetchReports
  };
}