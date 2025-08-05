import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Users, User, UserCircle, AtSign, UserPlus } from 'lucide-react';
import { useAuth } from '../../lib/context/AuthContext';
import { ChatService } from '../../lib/services/chatService';
import { ChatConversation, ChatUser, UserRole, ChatMessage, ChatAttachment, generateConversationId } from '../../lib/types/chat';
import ChatBox from './ChatBox';
// Importamos directamente el componente con JSX
import NewChatModal from './NewChatModal';



// Tipo para adjuntos extendido
interface AttachmentType extends ChatAttachment {
  id: string;
  file?: File;
  previewUrl?: string;
}

// Definimos localmente el tipo NewChatModalProps para evitar errores de importación
interface NewChatModalProps {
  onClose: () => void;
  onSearch: (query: string) => void;
  onSelectUser: (user: ChatUser) => void;
  searchResults: ChatUser[];
  loading: boolean;
}

const ChatHub: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados para manejar las conversaciones y mensajes
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [activeFilter, setActiveFilter] = useState<UserRole | 'all'>('all');
  const [typingUsers, setTypingUsers] = useState<{[userId: number]: boolean}>({});
  
  // Filtrar conversaciones basadas en el término de búsqueda y el filtro de rol
  const filteredConversations = conversations.filter(conversation => {
    // Primero aplicar filtro de texto
    const matchesSearch = conversation.participants.some(participant => 
      participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Luego aplicar filtro por rol si no es 'all'
    if (activeFilter !== 'all') {
      return matchesSearch && conversation.participants.some(
        participant => participant.id !== (currentUser?.id || 0) && participant.role === activeFilter
      );
    }
    
    return matchesSearch;
  });
  
  // Efecto para manejar estudiante o usuario desde URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const studentId = searchParams.get('studentId');
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');
    
    // Si tenemos un ID de estudiante, iniciamos una conversación con él
    if (studentId) {
      fetchUserAndStartConversation(parseInt(studentId));
    } 
    // Si tenemos un ID de usuario, iniciamos una conversación con él
    else if (userId) {
      fetchUserAndStartConversation(parseInt(userId));
    }
    // Si tenemos un ID de conversación, seleccionamos esa conversación
    else if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        selectConversation(conversation);
      } else {
        // Intentamos obtener la conversación desde el servicio
        fetchConversationById(conversationId);
      }
    }
  }, [location.search, conversations]);
  
  // Cargar conversaciones al iniciar
  useEffect(() => {
    if (!currentUser) return;
    
    const userId = typeof currentUser.id === 'string' 
      ? parseInt(currentUser.id) 
      : currentUser.id;
    
    // Simulamos la carga de conversaciones para demo
    setLoading(true);
    
    // Ejemplo de conversaciones simuladas
    const mockConversations: ChatConversation[] = demoUsers.map((user: ChatUser, index: number) => ({
      id: `conv-${index + 1}`,
      participants: [
        { 
          id: userId, 
          name: currentUser.name || 'Yo', 
          role: currentUser.role as UserRole, 
          email: currentUser.email,
          photoURL: getUserPhotoUrl(currentUser)
        },
        { 
          id: user.id, 
          name: user.name, 
          role: user.role, 
          email: user.email, 
          photoURL: user.photoURL 
        }
      ],
      lastMessage: `Este es el último mensaje en la conversación con ${user.name}`,
      lastMessageAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
      unreadCount: Math.floor(Math.random() * 3),
      createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString()
    }));
    
    // Simulamos la carga de las conversaciones
    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 800);
    
    // En una implementación real, nos suscribiríamos a las conversaciones
    // return ChatService.getUserConversations(userId, (fetchedConversations) => {
    //   setConversations(fetchedConversations);
    //   setLoading(false);
    // });
  }, [currentUser]);
  
  // Función para buscar un usuario por ID y comenzar una conversación
  const fetchUserAndStartConversation = async (userId: number) => {
    try {
      // En un caso real, buscaríamos el usuario en la base de datos
      const mockUser = demoUsers.find((u: ChatUser) => u.id === userId);
      
      if (mockUser) {
        const conversationResult = await startConversation(mockUser);
        
        // Limpiar los parámetros de búsqueda de la URL
        navigate('/mensajes', { replace: true });
      } else {
        setError('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al iniciar conversación:', error);
      setError('Error al iniciar conversación con el usuario');
    }
  };
  
  // Función para buscar una conversación por ID
  const fetchConversationById = async (conversationId: string) => {
    try {
      // En un caso real, buscaríamos la conversación en la base de datos
      const mockConversation = conversations.find(c => c.id === conversationId);
      
      if (mockConversation) {
        selectConversation(mockConversation);
        // Limpiar los parámetros de búsqueda de la URL
        navigate('/mensajes', { replace: true });
      } else {
        setError('Conversación no encontrada');
      }
    } catch (error) {
      console.error('Error al obtener conversación:', error);
      setError('Error al cargar la conversación');
    }
  };
  
  // Función para iniciar una nueva conversación
  const startConversation = async (user: ChatUser) => {
    if (!currentUser) return;
    
    const userId = typeof currentUser.id === 'string' 
      ? parseInt(currentUser.id) 
      : currentUser.id;
    
    // Buscar si ya existe una conversación con este usuario
    const existingConversation = conversations.find(conv =>
      conv.participants.some(p => p.id === user.id)
    );
    
    if (existingConversation) {
      selectConversation(existingConversation);
      return existingConversation;
    }
    
    // En un caso real, crearíamos una nueva conversación en la base de datos
    const newConversation: ChatConversation = {
      id: `new-conv-${Date.now()}`,
      participants: [
        { 
          id: userId, 
          name: currentUser.name || 'Yo', 
          role: currentUser.role as UserRole, 
          email: currentUser.email, 
          photoURL: getUserPhotoUrl(currentUser)
        },
        { 
          id: user.id, 
          name: user.name, 
          role: user.role, 
          email: user.email, 
          photoURL: user.photoURL 
        }
      ],
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      createdAt: new Date().toISOString()
    };
    
    // Agregar la nueva conversación a la lista
    setConversations(prev => [newConversation, ...prev]);
    selectConversation(newConversation);
    
    return newConversation;
  };
  
  // Función para seleccionar una conversación y cargar sus mensajes
  const selectConversation = async (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    
    // Obtener mensajes reales de la conversación
    try {
      const currentUserId = typeof currentUser?.id === 'string' 
        ? parseInt(currentUser.id) 
        : (currentUser?.id || 0);
      
      const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
      const isUserTyping = otherParticipant ? typingUsers[otherParticipant.id] : false;
      
      if (!otherParticipant) return;
      
      // Obtener mensajes desde el servicio
      const conversationMessages = await ChatService.getConversationMessages(conversation.id);
      setMessages(conversationMessages || []);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      setMessages([]);
    }
    
    // Marcar mensajes como leídos (en un caso real)
    if (conversation.unreadCount > 0) {
      // Simulamos que la conversación ya no tiene mensajes sin leer
      setConversations(prev => prev.map(conv => 
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      ));
    }
  };
  
  // Manejar el envío de mensajes
  const handleSendMessage = async (text: string, attachments: AttachmentType[] = []) => {
    if (!selectedConversation || !currentUser) return;
    
    const currentUserId = typeof currentUser.id === 'string' 
      ? parseInt(currentUser.id) 
      : currentUser.id;
    
    // Crear nuevo mensaje
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      senderName: currentUser.name || 'Yo',
      senderRole: currentUser.role as UserRole,
      content: text,
      timestamp: new Date().toISOString(),
      read: false,
      attachments: attachments.map(attachment => ({
        id: attachment.id,
        name: attachment.name,
        size: attachment.size,
        type: attachment.type,
        url: attachment.url
      }))
    };
    
    // Agregar mensaje a la lista
    setMessages(prev => [...prev, newMessage]);
    
    // Actualizar última actividad de la conversación
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { 
            ...conv, 
            lastMessage: text,
            lastMessageAt: new Date().toISOString() 
          }
        : conv
    ));
    
    // Enviar mensaje a la base de datos
    await ChatService.sendMessage(selectedConversation.id, text, currentUserId, attachments);
  };
  
  // Manejar búsqueda de usuarios para nueva conversación
  const handleUserSearch = async (query: string) => {
    setSearchLoading(true);
    
    try {
      // Buscar usuarios en la base de datos
      const users = await ChatService.searchUsers(query);
      setSearchResults(users);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    } finally {
      setSearchLoading(false);
    }
  };
  
  // Manejar la selección de un usuario de la búsqueda
  const handleSelectUserFromSearch = async (user: ChatUser) => {
    try {
      await startConversation(user);
      setShowNewChatModal(false);
    } catch (error) {
      console.error('Error al iniciar conversación:', error);
    }
  };
  
  // Manejar cambio en el estado de escritura
  const handleTypingStatus = (userId: number, isTyping: boolean) => {
    setTypingUsers(prev => ({
      ...prev,
      [userId]: isTyping
    }));
  };
  
  // Función para manejar avatares o fotos de perfil
  const getUserPhotoUrl = (user: any): string => {
    // Si el usuario tiene photoURL, usarlo
    if (user.photoURL) return user.photoURL;
    // Compatibilidad con versiones anteriores que usan avatar
    if (user.avatar) return user.avatar;
    // Valor por defecto
    return '';
  };

  const formatTimeAgo = (timestamp: string): string => {
    if (!timestamp) return '';
    
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    
    return messageDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  // Función para renderizar el elemento de conversación
  const renderConversationItem = (conversation: ChatConversation) => {
    if (!currentUser) return null;
    
    const currentUserId = typeof currentUser.id === 'string' 
      ? parseInt(currentUser.id) 
      : currentUser.id;
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    const isUserTyping = otherParticipant ? typingUsers[otherParticipant.id] : false;
    
    if (!otherParticipant) return null;
    
    // Formatear la fecha del último mensaje
    const formatLastMessageTime = (dateString: string) => {
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
    
    return (
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
            {otherParticipant ? renderUserAvatar(otherParticipant) : <span>?</span>}
          </div>
          {isUserTyping && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="text-sm font-medium text-gray-900 truncate">{otherParticipant?.name || 'Usuario'}</h3>
            {conversation.lastMessageAt && (
              <span className="text-xs text-gray-500">
                {formatTimeAgo(conversation.lastMessageAt)}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 truncate">
              {isUserTyping ? (
                <span className="flex items-center text-indigo-600 font-medium">
                  <span className="mr-1">{otherParticipant?.name || 'Usuario'}</span>
                  <span>
                    está escribiendo...
                  </span>
                </span>
              ) : (
                renderLastMessage(conversation)
              )}
            </p>
            {conversation.unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLastMessage = (conversation: ChatConversation) => {
    // Si alguien está escribiendo, mostrar ese estado
    if (isAnyoneTyping(conversation)) {
      return (
        <span className="text-indigo-600 font-medium">
          {getTypingUserName(conversation)} está escribiendo...
        </span>
      );
    }
    
    // Renderizar último mensaje
    if (typeof conversation.lastMessage === 'string') {
      return conversation.lastMessage || 'No hay mensajes';
    } else if (conversation.lastMessage && typeof conversation.lastMessage === 'object' && 'content' in conversation.lastMessage) {
      return conversation.lastMessage.content || 'No hay mensajes';
    }
    
    return 'Conversación iniciada';
  };

  const isAnyoneTyping = (conversation: ChatConversation) => {
    const currentUserId = typeof currentUser?.id === 'string' 
      ? parseInt(currentUser.id) 
      : (currentUser?.id || 0);
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    
    return otherParticipant && typingUsers[otherParticipant.id];
  };

  const getTypingUserName = (conversation: ChatConversation) => {
    const currentUserId = typeof currentUser?.id === 'string' 
      ? parseInt(currentUser.id) 
      : (currentUser?.id || 0);
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    
    return otherParticipant ? otherParticipant.name : 'Usuario';
  };

  // Función para renderizar avatar de usuario de forma segura
  const renderUserAvatar = (user: ChatUser) => {
    if (!user) return <span>?</span>;
    
    if (user.photoURL) {
      return (
        <img 
          src={user.photoURL} 
          alt={user.name || "Usuario"} 
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }
    
    return <span>{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>;
  };

  // Renderizar el componente ChatHub
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-180px)] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Lista de conversaciones (oculta en móvil cuando se muestra el chat) */}
      <div className={`${
        selectedConversation && mobileView === 'chat' ? 'hidden md:block' : 'block'
      } w-full md:w-1/3 border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Mensajes</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              <UserPlus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar contactos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Filtros por rol de usuario */}
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                activeFilter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                Todos
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('teacher')}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                activeFilter === 'teacher' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <UserCircle className="h-3 w-3 mr-1" />
                Docentes
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('student')}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                activeFilter === 'student' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                Estudiantes
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('tutor')}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                activeFilter === 'tutor' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <AtSign className="h-3 w-3 mr-1" />
                Tutores
              </span>
            </button>
          </div>
        </div>
        
        {/* Lista de conversaciones */}
        <div className="overflow-y-auto h-[calc(100%-168px)]">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Cargando conversaciones...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm 
                ? 'No se encontraron conversaciones con ese nombre.' 
                : activeFilter !== 'all'
                  ? `No tienes conversaciones con ${
                      activeFilter === 'teacher' ? 'docentes' : 
                      activeFilter === 'student' ? 'estudiantes' : 'tutores'
                    }.`
                  : 'No tienes conversaciones activas.'
              }
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => {
                  selectConversation(conversation);
                  setMobileView('chat');
                }}
              >
                {renderConversationItem(conversation)}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Área de chat */}
      <div 
        className={`w-full md:w-2/3 lg:w-3/4 flex flex-col h-full
          ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}
      >
        {selectedConversation ? (
          <ChatBox 
            messages={messages}
            onSendMessage={handleSendMessage}
            recipient={selectedConversation.participants.find(p => p.id !== (currentUser?.id || 0))}
            onBack={() => setMobileView('list')}
            loading={loading}
            onTypingStatusChange={(isTyping) => {
              if (!currentUser) return;
              const userId = typeof currentUser.id === 'string' 
                ? parseInt(currentUser.id) 
                : currentUser.id;
              handleTypingStatus(userId, isTyping);
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-indigo-100 p-4 rounded-full mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Selecciona una conversación
            </h3>
            <p className="text-gray-500 max-w-md mb-8">
              Elige una conversación existente de la lista o inicia una nueva para comenzar a chatear.
            </p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Iniciar nueva conversación
            </button>
          </div>
        )}
      </div>
      
      {/* Modal para nueva conversación */}
      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onSearch={handleUserSearch}
          onSelectUser={handleSelectUserFromSearch}
          searchResults={searchResults}
          loading={searchLoading}
        />
      )}
    </div>
  );
};

export default ChatHub;
