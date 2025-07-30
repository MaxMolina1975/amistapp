// Tipos para el sistema de chat

export type UserRole = 'teacher' | 'tutor' | 'student';

export interface ChatAttachment {
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  name: string;
  size?: number;
  preview?: string; // URL de previsualización para imágenes
  file?: File; // Objeto File para adjuntos recién cargados
}

export interface ChatUser {
  id: number;
  name: string;
  role: UserRole;
  email: string;
  photoURL?: string;
  avatar?: string; // Alias para photoURL para compatibilidad
  status?: 'online' | 'offline' | 'away';
  lastActive?: string;
  typing?: boolean; // Indica si el usuario está escribiendo
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: number;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: ChatAttachment[];
  // Para propósitos de compatibilidad con la implementación de useChat
  text?: string;
  sender?: ChatUser; // Referencia completa al remitente
}

export interface ChatConversation {
  id: string;
  participants: ChatUser[];
  participantIds?: (number | string)[];
  createdAt: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    senderId: number;
    attachments?: ChatAttachment[];
  } | string;
  lastMessageAt?: string;
  unreadCount: number;
  typingUsers?: number[]; // IDs de usuarios que están escribiendo actualmente
}

// Función auxiliar para generar un ID de conversación único
export function generateConversationId(userIds: number[]): string {
  return userIds.sort((a, b) => a - b).join('-');
}

// Función para verificar si dos usuarios pueden chatear entre sí
export function canChat(userRole1: UserRole, userRole2: UserRole): boolean {
  // Reglas de permiso para chatear:
  
  // Todos pueden chatear con docentes
  if (userRole1 === 'teacher' || userRole2 === 'teacher') {
    return true;
  }
  
  // Tutores pueden chatear con estudiantes
  if (
    (userRole1 === 'tutor' && userRole2 === 'student') ||
    (userRole1 === 'student' && userRole2 === 'tutor')
  ) {
    return true;
  }
  
  // Estudiantes no pueden chatear entre sí
  if (userRole1 === 'student' && userRole2 === 'student') {
    return false;
  }
  
  // Tutores pueden chatear entre sí
  if (userRole1 === 'tutor' && userRole2 === 'tutor') {
    return true;
  }
  
  return false;
}
