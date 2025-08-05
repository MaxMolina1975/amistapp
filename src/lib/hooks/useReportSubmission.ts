import { useState } from 'react';
import { reportsApi } from '../api/reports';
import { useAuth } from '../context/AuthContext';

interface ReportFormData {
  type: string;
  description: string;
  location: string;
  date: string;
  time: string;
  studentName?: string;
  studentGrade?: string;
}

export function useReportSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, courseId } = useAuth();

  const submitReport = async (formData: ReportFormData, isAnonymous: boolean) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const reportData = {
        ...formData,
        isAnonymous,
        courseId,
        status: 'pending' as const,
        // Only include student info if not anonymous
        ...(isAnonymous ? {} : {
          studentName: formData.studentName,
          studentGrade: formData.studentGrade
        })
      };

      await reportsApi.submitReport(reportData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el reporte');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReport,
    isSubmitting,
    error
  };
}
