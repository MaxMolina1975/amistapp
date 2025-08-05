import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';
import { ChatUser, ChatConversation } from '../../lib/types/chat';
import { ChatService } from '../../lib/services/chatService';
import { MessageSquare, ChevronRight, PlusCircle, Users } from 'lucide-react';

interface RecentContactsProps {
  limit?: number;
  title?: string;
  showAddButton?: boolean;
  filter?: 'all' | 'teacher' | 'student' | 'tutor';
}

/**
 * Componente que muestra los contactos recientes del usuario
 */
const RecentContacts: React.FC<RecentContactsProps> = ({
  limit = 3,
  title = "Contactos recientes",
  showAddButton = true,
  filter = 'all'
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      // Intentar obtener el ID de usuario como número
      let userId: number;
      if (typeof currentUser.id === 'string') {
        try {
          userId = parseInt(currentUser.id);
        } catch (e) {
          console.error('Error al convertir currentUser.id a número:', e);
          userId = 0;
        }
      } else {
        userId = currentUser.id;
      }

      // Si no pudimos obtener un ID válido, mostrar un error
      if (!userId) {
        setError('ID de usuario no válido');
        setLoading(false);
        return;
      }

      const unsubscribe = ChatService.getUserConversations(userId, (convs) => {
        try {
          // Filtrar por rol si es necesario
          let filteredConvs = convs;
          
          if (filter !== 'all') {
            filteredConvs = convs.filter(conv => {
              // Excluir al usuario actual y buscar por rol
              const otherParticipants = conv.participants.filter(p => p.id !== currentUser.id);
              return otherParticipants.some(p => p.role === filter);
            });
          }
          
          // Limitar el número de conversaciones
          setConversations(filteredConvs.slice(0, limit));
        } catch (err) {
          console.error('Error al procesar conversaciones:', err);
          setError('Error al cargar conversaciones');
        } finally {
          setLoading(false);
        }
      });

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (err) {
      console.error('Error al obtener conversaciones:', err);
      setError('Error al cargar conversaciones');
      setLoading(false);
      return () => {};
    }
  }, [currentUser, limit, filter]);

  const formatLastMessageTime = (timestamp?: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date >= today) {
      // Hoy - mostrar hora
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
      // Otro día - mostrar fecha
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
  };

  const handleChatClick = (conversation: ChatConversation) => {
    navigate(`/mensajes?convId=${conversation.id}`);
  };

  const handleAddClick = () => {
    navigate('/mensajes?new=true');
  };

  const getOtherParticipant = (conversation: ChatConversation): ChatUser | undefined => {
    if (!currentUser) return undefined;
    
    return conversation.participants.find(p => p.id !== currentUser.id);
  };

  // Renderizar pantalla de carga
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="ml-3 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="p-4 text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p>No se pudieron cargar los contactos</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs mt-1 text-red-400">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // No hay conversaciones
  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {showAddButton && (
            <button 
              onClick={handleAddClick}
              className="p-1.5 rounded-full text-indigo-600 hover:bg-indigo-50"
              aria-label="Iniciar nueva conversación"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="p-4 text-center text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p>No hay conversaciones recientes</p>
          <button 
            onClick={handleAddClick}
            className="mt-3 text-sm text-indigo-600 font-medium"
          >
            Iniciar una conversación
          </button>
        </div>
      </div>
    );
  }

  // Renderizar lista de conversaciones
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {showAddButton && (
          <button 
            onClick={handleAddClick}
            className="p-1.5 rounded-full text-indigo-600 hover:bg-indigo-50"
            aria-label="Iniciar nueva conversación"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          
          return (
            <div 
              key={conversation.id}
              className="py-3 flex items-center justify-between hover:bg-gray-50 rounded-md px-2 cursor-pointer transition-colors"
              onClick={() => handleChatClick(conversation)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg font-bold">
                  {otherParticipant ? otherParticipant.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{otherParticipant ? otherParticipant.name : 'Contacto'}</p>
                  <p className="text-xs text-gray-500 truncate w-48">
                    {typeof conversation.lastMessage === 'string' 
                      ? conversation.lastMessage
                      : 'No hay mensajes'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 mb-1">{formatLastMessageTime(conversation.lastMessageAt)}</span>
                {conversation.unreadCount > 0 && (
                  <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                    {conversation.unreadCount}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
              </div>
            </div>
          );
        })}
      </div>
      {conversations.length > 0 && (
        <button 
          onClick={() => navigate('/mensajes')}
          className="w-full mt-3 py-2 text-sm text-center text-indigo-600 font-medium hover:bg-indigo-50 rounded-md"
        >
          Ver todas las conversaciones
        </button>
      )}
    </div>
  );
};

export default RecentContacts;
