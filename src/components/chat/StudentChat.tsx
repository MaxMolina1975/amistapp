import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, UserCircle, School, Bookmark } from 'lucide-react';
import { useAuth } from '../../lib/context/AuthContext';
import { useChat } from '../../lib/hooks/useChat';
import ChatBox from './ChatBox';
import { ChatUser, ChatAttachment, ChatConversation } from '../../lib/types/chat';

interface StudentChatProps {
  compact?: boolean;
  onlyShowList?: boolean;
  initialTeacherId?: number;
}

const StudentChat: React.FC<StudentChatProps> = ({ 
  compact = false, 
  onlyShowList = false,
  initialTeacherId
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const { 
    conversations, 
    selectedConversation,
    messages, 
    loading, 
    selectConversation,
    sendMessage,
    startConversation,
    searchChatUsers
  } = useChat();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'teachers' | 'tutors'>('teachers');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  
  // Filtrar conversaciones basado en el rol y término de búsqueda
  const filteredConversations = conversations.filter(conversation => {
    // Filtrar por término de búsqueda
    const matchesSearch = searchTerm === '' || conversation.participants.some(participant => 
      participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filtrar por tipo de usuario (docente o tutor)
    const matchesRole = conversation.participants.some(participant => 
      participant.id !== currentUser?.id && participant.role === (activeTab === 'teachers' ? 'teacher' : 'tutor')
    );
    
    return matchesSearch && matchesRole;
  });
  
  // Efecto para iniciar conversación con un docente específico
  useEffect(() => {
    if (initialTeacherId && currentUser && !loading) {
      // Buscar si ya existe una conversación con este docente
      const existingConversation = conversations.find(conv => 
        conv.participants.some(p => p.id === initialTeacherId)
      );
      
      if (existingConversation) {
        selectConversation(existingConversation.id);
        setActiveTab('teachers');
      } else {
        // Buscar el docente para iniciar una nueva conversación
        handleSearch(initialTeacherId.toString());
      }
    }
  }, [initialTeacherId, currentUser, loading, conversations]);
  
  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    try {
      // Buscar usuarios que coincidan con la consulta
      const results = await searchChatUsers(query);
      // Filtrar por rol activo
      const filteredResults = results.filter(user => 
        user.role === (activeTab === 'teachers' ? 'teacher' : 'tutor')
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    } finally {
      setSearchLoading(false);
    }
  };
  
  const handleStartConversation = async (user: ChatUser) => {
    if (!currentUser) return;
    
    // Iniciar nueva conversación
    const conversationId = await startConversation(user);
    if (conversationId) {
      selectConversation(conversationId);
      setSearchResults([]);
      setSearchTerm('');
      setMobileView('chat'); // Cambiar a vista de chat en móviles cuando se inicia una conversación
    }
  };
  
  const handleSendMessage = async (content: string, attachments?: ChatAttachment[]) => {
    if (!selectedConversation) return;
    
    await sendMessage(content, attachments);
  };
  
  const openFullChat = (conversationId?: string) => {
    const url = '/mensajes' + (conversationId ? `?conversationId=${conversationId}` : '');
    navigate(url);
  };
  
  // Renderizar solo la lista de contactos en modo compacto
  if (compact && onlyShowList) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="font-medium text-gray-800 flex items-center">
            {activeTab === 'teachers' ? (
              <School className="h-4 w-4 mr-2" />
            ) : (
              <User className="h-4 w-4 mr-2" />
            )}
            {activeTab === 'teachers' ? 'Mis Docentes' : 'Mis Tutores'}
          </h3>
          
          <div className="flex space-x-2">
            <button 
              className={`px-2 py-1 text-xs rounded ${activeTab === 'teachers' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('teachers')}
            >
              Docentes
            </button>
            <button 
              className={`px-2 py-1 text-xs rounded ${activeTab === 'tutors' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('tutors')}
            >
              Tutores
            </button>
          </div>
          
          <button 
            onClick={() => openFullChat()} 
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Ver todos
          </button>
        </div>
        
        {filteredConversations.length > 0 ? (
          <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
            {filteredConversations.slice(0, 5).map(conversation => {
              const contact = conversation.participants.find(p => p.id !== currentUser?.id);
              if (!contact) return null;
              
              return (
                <li key={conversation.id} className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => openFullChat(conversation.id)}>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {contact.photoURL ? (
                        <img src={contact.photoURL} alt={contact.name} className="h-8 w-8 rounded-full" />
                      ) : (
                        <UserCircle className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {typeof conversation.lastMessage === 'string' 
                          ? conversation.lastMessage 
                          : conversation.lastMessage?.content || 'Iniciar conversación'}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            {loading ? 'Cargando...' : `No hay conversaciones con ${activeTab === 'teachers' ? 'docentes' : 'tutores'}`}
          </div>
        )}
      </div>
    );
  }
  
  // Modo completo
  return (
    <div className={`h-full bg-white rounded-lg shadow overflow-hidden flex flex-col sm:flex-row ${compact ? 'max-h-[600px]' : 'h-[calc(100vh-12rem)]'}`}>
      {/* Lista de conversaciones */}
      <div className={`w-full sm:w-1/3 border-r ${selectedConversation && mobileView === 'chat' ? 'hidden sm:flex sm:flex-col' : 'flex flex-col'}`}>
        <div className="p-3 border-b">
          <h2 className="font-medium text-gray-800 mb-2">Mis Mensajes</h2>
          <div className="relative">
            <input
              type="text"
              placeholder={`Buscar ${activeTab === 'teachers' ? 'docente' : 'tutor'}...`}
              className="w-full p-2 pl-8 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="mt-2 flex items-center text-sm space-x-1">
            <button 
              className={`px-2 py-1 rounded-md ${activeTab === 'teachers' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('teachers')}
            >
              <span className="flex items-center">
                <School className="h-3 w-3 mr-1" />
                Docentes
              </span>
            </button>
            <button 
              className={`px-2 py-1 rounded-md ${activeTab === 'tutors' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('tutors')}
            >
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                Tutores
              </span>
            </button>
          </div>
        </div>
        
        {searchTerm.length >= 2 && searchResults.length > 0 && (
          <div className="p-2 border-b">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Resultados de búsqueda</h3>
            <ul className="divide-y divide-gray-100">
              {searchResults.map(user => (
                <li key={user.id} className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => handleStartConversation(user)}>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="h-8 w-8 rounded-full" />
                      ) : (
                        <UserCircle className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {searchLoading ? (
          <div className="p-4 text-center text-gray-500">Buscando usuarios...</div>
        ) : (
          <ul className="divide-y divide-gray-100 overflow-y-auto" style={{ maxHeight: compact ? '400px' : 'calc(100vh - 16rem)' }}>
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => {
                const contact = conversation.participants.find(p => p.id !== currentUser?.id);
                if (!contact) return null;
                
                return (
                  <li 
                    key={conversation.id} 
                    className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''}`}
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {contact.photoURL ? (
                          <img src={contact.photoURL} alt={contact.name} className="h-10 w-10 rounded-full" />
                        ) : (
                          <UserCircle className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {typeof conversation.lastMessage === 'string' 
                            ? conversation.lastMessage 
                            : conversation.lastMessage?.content || 'Iniciar conversación'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit'
                          }) : ''}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="p-4 text-center text-gray-500">
                {loading ? 'Cargando conversaciones...' : `No hay conversaciones con ${activeTab === 'teachers' ? 'docentes' : 'tutores'}`}
              </li>
            )}
          </ul>
        )}
      </div>
      
      {/* Área de chat */}
      <div className={`flex-1 ${mobileView === 'list' ? 'hidden sm:flex' : 'flex'} flex-col`}>
        {selectedConversation ? (
          <ChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            recipient={selectedConversation.participants.find(p => p.id !== currentUser?.id)}
            onBack={compact ? () => selectConversation(null) : undefined}
            loading={loading}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 bg-gray-50">
            <UserCircle className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Selecciona un contacto</h3>
            <p className="text-gray-500 text-center max-w-md">
              Selecciona una conversación existente o busca un contacto para iniciar una nueva conversación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentChat;
