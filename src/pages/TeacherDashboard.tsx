import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Users, 
  Gift, 
  AlertTriangle, 
  Crown, 
  Coins, 
  BarChart,
  MessageSquare,
  Heart,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from "../lib/context/AuthContext";
import { PromotionCarousel } from '../components/carousel';
import '../components/carousel/styles/carousel.css';
import { CourseCodeGenerator } from '../components/teacher/CourseCodeGenerator';
import { courseCodeApi } from '../lib/api/courseCode';
import { useStudents } from '../lib/types/student';

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [courseCode, setCourseCode] = useState<string>("CURSO-2024-A1");
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  
  // Usar hook para obtener estudiantes reales
  const { students, loading, error } = useStudents(currentUser?.id?.toString());
  
  const subscriptionStatus = {
    isActive: true,
    expiresAt: "2025-03-20",
    availablePoints: 850,
  };

  // Calcular estadísticas con datos reales o valores por defecto
  const studentsCount = students.length;
  const averageEmotionalIndex = students.length > 0 
    ? students.reduce((sum, student) => sum + student.stats.emotionalIndex, 0) / studentsCount
    : 0;
  const positiveInteractionsRate = 85; // Calcular desde datos reales
  const alertsCount = students.filter(student => student.stats.emotionalIndex < 60).length;

  const statistics = {
    totalStudents: studentsCount,
    monthlyEmotionalIndex: Math.round(averageEmotionalIndex * 10) / 10,
    positiveInteractions: positiveInteractionsRate,
    alertsCount: alertsCount
  };

  // Mostrar loading o error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Resto del componente...
}