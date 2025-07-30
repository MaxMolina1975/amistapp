import { LucideIcon } from 'lucide-react';

// Tipos base
export type Role = 'estudiante' | 'profesor';

export interface User {
  id: string;
  fullName: string;
  role: Role;
  availablePoints: number;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para reportes
export type ReportType = 'bullying' | 'academic' | 'behavioral' | 'emotional' | 'other';
export type ReportPriority = 'low' | 'medium' | 'high' | 'urgent';

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

export interface ReportStats {
  total: number;
  pending: number;
  resolved: number;
  urgent: number;
  byType: Record<ReportType, number>;
  byPriority: Record<ReportPriority, number>;
}

// Tipos para cursos y miembros
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

// Tipos para estudiantes
export interface StudentStats {
  id: number;
  studentId: number;
  emotionalIndex: number;
  participationRate: number;
  attendanceRate: number;
  points: number;
  achievementsCount: number;
  lastUpdate: string;
  weeklyMood: {
    monday?: number;
    tuesday?: number;
    wednesday?: number;
    thursday?: number;
    friday?: number;
  };
  skills: {
    communication: number;
    teamwork: number;
    empathy: number;
    selfRegulation: number;
    conflictResolution: number;
  };
  academicPerformance: number;
  emotionalWellbeing: number;
  socialParticipation: number;
  attendance: number;
  trends: {
    emotionalIndex: number;
    pointsEarned: number;
  };
}

// Tipos para recompensas
export type RewardCategory = 'material' | 'experience' | 'privilege' | 'digital';

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: RewardCategory;
  imageUrl?: string;
  available: boolean;
  unlimited: boolean;
  remainingQuantity?: number;
  expiresAt?: string;
  createdAt: string | Date;
  updatedAt: string;
  createdBy?: string;
  active?: boolean;
}

export interface RewardClaim {
  id: string;
  userId: string;
  rewardId: string;
  claimedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  points: number;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
  user?: {
    fullName: string;
  };
  reward?: {
    name: string;
  };
}

export interface RewardStats {
  totalRewards: number;
  activeRewards: number;
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  totalPointsSpent: number;
  pointsDistributed: number;
  mostPopularReward: string;
}

// Resto del archivo se mantiene igual...