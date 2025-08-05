// Índice de tipos exportados para la aplicación

// Re-exportar tipos desde otros archivos
export * from './auth';
export * from './chat';
export * from './student';
export * from './rewards';

// Tipos para gestión de cursos y miembros
export interface User {
  id: string | number;
  fullName: string;
  email: string;
  role: 'teacher' | 'student' | 'tutor';
  profilePicture?: string;
}

export interface CourseMember {
  userId: string;
  courseId: string;
  role: 'teacher' | 'student' | 'assistant';
  joinedAt: string;
  points: number;
  user?: User;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  grade: string;
  teacherId: string;
  members: CourseMember[];
  createdAt: string;
  updatedAt: string;
}

// Tipos para reportes
export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  priority: ReportPriority;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  reporterId: string;
  reporterName: string;
  reporterRole: 'student' | 'teacher' | 'tutor';
  targetId?: string;
  targetName?: string;
  targetType?: 'student' | 'teacher' | 'class';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  attachments?: string[];
  tags?: string[];
}

export type ReportType = 'bullying' | 'academic' | 'behavioral' | 'emotional' | 'other';
export type ReportPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ReportStats {
  total: number;
  pending: number;
  resolved: number;
  byType: Record<ReportType, number>;
  byPriority: Record<ReportPriority, number>;
}

// Tipos para estadísticas de profesores
export interface TeacherStats {
  totalStudents: number;
  totalCourses: number;
  totalReports: number;
  averageEmotionalIndex: number;
  averageParticipation: number;
  averageAttendance: number;
  recentActivity: ActivityRecord[];
}

// Tipos para actividades
export interface ActivityRecord {
  id: string;
  type: 'report' | 'assignment' | 'achievement' | 'communication';
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

// Tipos para transacciones de puntos
export interface PointTransaction {
  id: string;
  studentId: string;
  teacherId: string;
  points: number;
  reason: string;
  type: 'earned' | 'spent' | 'bonus' | 'penalty';
  createdAt: string;
}

// Tipos para emociones
export interface Emotion {
  id: string;
  userId: string;
  type: EmotionType;
  intensity: number; // 1-10
  description?: string;
  timestamp: string;
  context?: string;
}

export type EmotionType = 'happy' | 'sad' | 'angry' | 'anxious' | 'excited' | 'calm' | 'frustrated' | 'proud';

export interface EmotionStats {
  averageIntensity: number;
  mostCommonEmotion: EmotionType;
  emotionDistribution: Record<EmotionType, number>;
  weeklyTrend: { date: string; averageIntensity: number }[];
}

// Tipos para configuración de perfil
export interface ProfileSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    timezone: string;
  };
}

// Tipos para promociones
export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  discount?: number;
  validUntil?: string;
  isActive: boolean;
  category: string;
  pointsCost?: number;
}
