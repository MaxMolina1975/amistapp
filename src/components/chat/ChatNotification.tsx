import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, X } from 'lucide-react';
import { useAuth } from '../../lib/context/AuthContext';
import { ChatService } from '../../lib/services/chatService';
import { ChatConversation, UserRole } from '../../lib/types/chat';

interface ChatNotificationProps {
  variant?: 'badge' | 'dropdown' | 'full';
  limit?: number;
}

const ChatNotification: React.FC<ChatNotificationProps> = ({ 
  variant = 'dropdown',
  limit
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadConversations, setUnreadConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Efecto para obtener notificaciones
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    const userId = typeof currentUser.id === 'string' 
      ? parseInt(currentUser.id) 
      : currentUser.id;
    
    // Obtener conversaciones no leídas desde el servicio
    const fetchUnreadConversations = async () => {
      try {
        const conversations = await ChatService.getUnreadConversations(userId, limit);
        setUnreadConversations(conversations);
        setUnreadCount(conversations.length);
      } catch (error) {
        console.error('Error al obtener conversaciones no leídas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUnreadConversations();
    
    return () => {
      // Cleanup
    };
  }, [currentUser, limit]);

  const handleClick = () => {
    if (variant === 'badge' || variant === 'dropdown') {
      navigate('/mensajes');
    } else {
      setShowDropdown(!showDropdown);
    }
  };
  
  const handleConversationClick = (conversationId: string) => {
    navigate(`/mensajes?conversationId=${conversationId}`);
    setShowDropdown(false);
  };
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Hoy - mostrar hora
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Ayer
      return 'Ayer';
    } else if (diffDays < 7) {
      // Esta semana - mostrar día
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      return days[date.getDay()];
    } else {
      // Hace más de una semana - mostrar fecha
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  };
  
  // Para obtener el nombre del otro participante
  const getOtherParticipantName = (conversation: ChatConversation) => {
    if (!currentUser) return 'Usuario';
    
    const currentUserId = typeof currentUser.id === 'string' 
      ? parseInt(currentUser.id) 
      : currentUser.id;
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    return otherParticipant?.name || 'Usuario';
  };
  
  // Obtener el contenido del último mensaje como string
  const getLastMessageContent = (conversation: ChatConversation): string => {
    if (!conversation.lastMessage) return "";
    
    if (typeof conversation.lastMessage === 'string') {
      return conversation.lastMessage;
    } else if (typeof conversation.lastMessage === 'object' && 'content' in conversation.lastMessage) {
      return conversation.lastMessage.content;
    }
    
    return "";
  };

  if (loading) {
    return null;
  }

  // Sin notificaciones
  if (unreadCount === 0) {
    if (variant === 'badge') {
      return null;
    }
    
    return (
      <div className="text-gray-500 text-sm py-2 text-center">
        No tienes notificaciones nuevas
      </div>
    );
  }

  // Badge para mostrar solo el número
  if (variant === 'badge') {
    return (
      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {unreadCount}
      </div>
    );
  }

  // Dropdown para mostrar un botón con indicador
  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          className="relative p-1 rounded-full hover:bg-gray-100"
        >
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">Notificaciones</h3>
              <button 
                onClick={() => setShowDropdown(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {unreadConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation.id)}
                  className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer mb-1"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-2">
                      <div className="bg-indigo-100 rounded-full p-2 mt-1">
                        <MessageCircle className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{getOtherParticipantName(conversation)}</p>
                        <p className="text-sm text-gray-600 line-clamp-1">{getLastMessageContent(conversation)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">{formatDate(conversation.lastMessageAt)}</span>
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full mt-1">{conversation.unreadCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/mensajes');
                  setShowDropdown(false);
                }}
                className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded text-center"
              >
                Ver todos los mensajes
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista completa para mostrar la lista de notificaciones
  return (
    <div className="space-y-2">
      {unreadConversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => handleConversationClick(conversation.id)}
          className="flex items-center p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer border border-indigo-100"
        >
          <div className="mr-3 bg-white p-2 rounded-full">
            <MessageCircle className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <p className="font-medium text-gray-800">{getOtherParticipantName(conversation)}</p>
              <span className="text-xs text-gray-500">{formatDate(conversation.lastMessageAt)}</span>
            </div>
            <p className="text-sm text-gray-600 truncate">{getLastMessageContent(conversation)}</p>
          </div>
          <div className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {conversation.unreadCount}
          </div>
        </div>
      ))}
      
      {unreadCount > (limit || 0) && (
        <button
          onClick={() => navigate('/mensajes')}
          className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded text-center border border-indigo-200"
        >
          Ver {unreadCount - (limit || 0)} notificaciones más
        </button>
      )}
    </div>
  );
};

export default ChatNotification;
