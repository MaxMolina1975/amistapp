import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../lib/context/AuthContext';
import { useStudents } from '../../../lib/types/student';
import { 
  Send, Search, UserCircle, Calendar, 
  MoreVertical, ChevronLeft, Paperclip, Image, 
  Smile, AtSign, Users, User
} from 'lucide-react';

// Mock conversation types
interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: 'tutor' | 'teacher' | 'parent' | 'student';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: number;
  participants: {
    id: number;
    name: string;
    type: 'tutor' | 'teacher' | 'parent' | 'student';
    profileImage?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
}

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: 1,
    participants: [
      {
        id: 101,
        name: 'Ana López',
        type: 'tutor',
        profileImage: '/avatars/tutor-1.png'
      },
      {
        id: 201,
        name: 'Lucía Martínez',
        type: 'teacher',
        profileImage: '/avatars/teacher-1.png'
      }
    ],
    lastMessage: {
      id: 101,
      conversationId: 1,
      senderId: 201,
      senderType: 'teacher',
      senderName: 'Lucía Martínez',
      content: 'Podemos revisar el progreso de María durante la próxima reunión?',
      timestamp: '2025-03-26T14:35:00',
      read: false
    },
    unreadCount: 2
  },
  {
    id: 2,
    participants: [
      {
        id: 101,
        name: 'Ana López',
        type: 'tutor',
        profileImage: '/avatars/tutor-1.png'
      },
      {
        id: 301,
        name: 'Carlos Rodríguez',
        type: 'parent',
      }
    ],
    lastMessage: {
      id: 102,
      conversationId: 2,
      senderId: 101,
      senderType: 'tutor',
      senderName: 'Ana López',
      content: 'Juan ha mostrado una mejora significativa en sus habilidades socioemocionales este mes.',
      timestamp: '2025-03-25T10:15:00',
      read: true
    },
    unreadCount: 0
  },
  {
    id: 3,
    participants: [
      {
        id: 101,
        name: 'Ana López',
        type: 'tutor',
        profileImage: '/avatars/tutor-1.png'
      },
      {
        id: 1,
        name: 'María López',
        type: 'student',
        profileImage: '/avatars/student-1.png'
      }
    ],
    lastMessage: {
      id: 103,
      conversationId: 3,
      senderId: 1,
      senderType: 'student',
      senderName: 'María López',
      content: 'Gracias por la sesión de hoy, me siento mucho mejor.',
      timestamp: '2025-03-26T16:20:00',
      read: true
    },
    unreadCount: 0
  }
];

// Mock messages for each conversation
const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      conversationId: 1,
      senderId: 101,
      senderType: 'tutor',
      senderName: 'Ana López',
      content: 'Hola Lucía, ¿cómo va el progreso de María en tus clases?',
      timestamp: '2025-03-26T14:30:00',
      read: true
    },
    {
      id: 2,
      conversationId: 1,
      senderId: 201,
      senderType: 'teacher',
      senderName: 'Lucía Martínez',
      content: 'Hola Ana, María ha mejorado bastante en su participación en clase. Se la ve más confiada.',
      timestamp: '2025-03-26T14:32:00',
      read: true
    },
    {
      id: 3,
      conversationId: 1,
      senderId: 101,
      senderType: 'tutor',
      senderName: 'Ana López',
      content: 'Eso es una excelente noticia. ¿Ha habido algún cambio en su interacción con los compañeros?',
      timestamp: '2025-03-26T14:33:00',
      read: true
    },
    {
      id: 101,
      conversationId: 1,
      senderId: 201,
      senderType: 'teacher',
      senderName: 'Lucía Martínez',
      content: 'Podemos revisar el progreso de María durante la próxima reunión?',
      timestamp: '2025-03-26T14:35:00',
      read: false
    }
  ],
  2: [
    {
      id: 4,
      conversationId: 2,
      senderId: 301,
      senderType: 'parent',
      senderName: 'Carlos Rodríguez',
      content: 'Buenas tardes, quería consultar sobre el progreso de Juan. En casa lo hemos notado más comunicativo.',
      timestamp: '2025-03-25T09:45:00',
      read: true
    },
    {
      id: 5,
      conversationId: 2,
      senderId: 101,
      senderType: 'tutor',
      senderName: 'Ana López',
      content: 'Hola Carlos, es muy bueno saber eso. En la escuela también hemos notado mejoras.',
      timestamp: '2025-03-25T10:00:00',
      read: true
    },
    {
      id: 6,
      conversationId: 2,
      senderId: 301,
      senderType: 'parent',
      senderName: 'Carlos Rodríguez',
      content: '¿Qué tipo de actividades recomendarías para reforzar en casa?',
      timestamp: '2025-03-25T10:10:00',
      read: true
    },
    {
      id: 102,
      conversationId: 2,
      senderId: 101,
      senderType: 'tutor',
      senderName: 'Ana López',
      content: 'Juan ha mostrado una mejora significativa en sus habilidades socioemocionales este mes.',
      timestamp: '2025-03-25T10:15:00',
      read: true
    }
  ],
  3: [
    {
      id: 7,
      conversationId: 3,
      senderId: 101,
      senderType: 'tutor',
      senderName: 'Ana López',
      content: 'Hola María, ¿cómo te sientes después de la actividad de hoy?',
      timestamp: '2025-03-26T16:00:00',
      read: true
    },
    {
      id: 8,
      conversationId: 3,
      senderId: 1,
      senderType: 'student',
      senderName: 'María López',
      content: 'Me siento mucho mejor, me gustó mucho la dinámica de grupo.',
      timestamp: '2025-03-26T16:05:00',
      read: true
    },
    {
      id: 9,
      conversationId: 3,
      senderId: 101,
      senderType: 'tutor',
      senderName: 'Ana López',
      content: 'Me alegro mucho. ¿Hay algo más sobre lo que te gustaría trabajar en la próxima sesión?',
      timestamp: '2025-03-26T16:10:00',
      read: true
    },
    {
      id: 103,
      conversationId: 3,
      senderId: 1,
      senderType: 'student',
      senderName: 'María López',
      content: 'Gracias por la sesión de hoy, me siento mucho mejor.',
      timestamp: '2025-03-26T16:20:00',
      read: true
    }
  ]
};

export function CommunicationHub() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentIdParam = searchParams.get('studentId');
  const { students } = useStudents(undefined, currentUser?.id);
  
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => {
    return conversation.participants.some(participant => 
      participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    // In a real app, this would be fetched from an API
    setConversations(mockConversations);

    // If a student ID is provided in the URL, open that conversation
    if (studentIdParam) {
      const studentConversation = mockConversations.find(conv => 
        conv.participants.some(p => p.id.toString() === studentIdParam && p.type === 'student')
      );
      if (studentConversation) {
        setSelectedConversation(studentConversation);
        setMessages(mockMessages[studentConversation.id] || []);
      } else {
        // If no conversation exists with this student, we could create a new one
        const student = students.find(s => s.id.toString() === studentIdParam);
        if (student) {
          // This would create a new conversation with the student in a real app
          console.log(`Would create new conversation with student: ${student.name}`);
        }
      }
    }
  }, [studentIdParam]);

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
    // In a real app, this would mark messages as read
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // In a real app, this would be sent to the API
    const newMsg: Message = {
      id: Date.now(),
      conversationId: selectedConversation.id,
      senderId: 101, // Current tutor ID
      senderType: 'tutor',
      senderName: currentUser?.name || 'Tutor',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true
    };

    // Update messages state
    setMessages([...messages, newMsg]);
    
    // Update conversations with last message
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? {...conv, lastMessage: newMsg} 
        : conv
    ));

    // Clear input
    setNewMessage('');
  };

  const getParticipantName = (conversation: Conversation) => {
    // Filter out the current user and join other participant names
    const otherParticipants = conversation.participants.filter(p => p.id !== 101);
    return otherParticipants.map(p => p.name).join(', ');
  };

  const getParticipantImage = (conversation: Conversation) => {
    // Get the first participant that is not the current user
    const otherParticipant = conversation.participants.find(p => p.id !== 101);
    return otherParticipant?.profileImage;
  };

  const getParticipantTypeIcon = (type: string) => {
    switch(type) {
      case 'teacher': return <User className="w-3 h-3" />;
      case 'parent': return <Users className="w-3 h-3" />;
      case 'student': return <AtSign className="w-3 h-3" />;
      default: return null;
    }
  };

  const getParticipantTypeLabel = (type: string) => {
    switch(type) {
      case 'teacher': return 'Docente';
      case 'parent': return 'Padre/Madre';
      case 'student': return 'Estudiante';
      default: return type;
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date >= today) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Comunicaciones</h1>
        <p className="text-gray-600">Gestiona tus conversaciones con docentes, estudiantes y familias</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Conversation list */}
          <div className="border-r border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar conversación..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
              </div>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
              {filteredConversations.length > 0 ? (
                filteredConversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id ? 'bg-violet-50' : ''
                    }`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {getParticipantImage(conversation) ? (
                            <img 
                              src={getParticipantImage(conversation)} 
                              alt={getParticipantName(conversation)}
                              className="w-10 h-10 rounded-full object-cover" 
                            />
                          ) : (
                            <UserCircle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">{conversation.unreadCount}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-800 truncate">{getParticipantName(conversation)}</h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatConversationTime(conversation.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          {conversation.participants.filter(p => p.id !== 101).map(participant => (
                            <span 
                              key={participant.id} 
                              className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1"
                            >
                              {getParticipantTypeIcon(participant.type)}
                              {getParticipantTypeLabel(participant.type)}
                            </span>
                          ))}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage.senderId === 101 ? 'Tú: ' : ''}
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No se encontraron conversaciones</p>
                </div>
              )}
            </div>
          </div>

          {/* Message area */}
          <div className="col-span-2">
            {selectedConversation ? (
              <>
                {/* Conversation header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      className="md:hidden p-2 rounded-full hover:bg-gray-100"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {getParticipantImage(selectedConversation) ? (
                        <img 
                          src={getParticipantImage(selectedConversation)} 
                          alt={getParticipantName(selectedConversation)}
                          className="w-10 h-10 rounded-full object-cover" 
                        />
                      ) : (
                        <UserCircle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{getParticipantName(selectedConversation)}</h3>
                      <div className="flex items-center gap-1">
                        {selectedConversation.participants.filter(p => p.id !== 101).map(participant => (
                          <span 
                            key={participant.id} 
                            className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1"
                          >
                            {getParticipantTypeIcon(participant.type)}
                            {getParticipantTypeLabel(participant.type)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Message list */}
                <div className="p-4 overflow-y-auto bg-gray-50" style={{ height: 'calc(80vh - 300px)' }}>
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.senderId === 101 ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          message.senderId === 101 
                            ? 'bg-violet-600 text-white rounded-tl-xl rounded-tr-sm rounded-bl-xl'
                            : 'bg-white text-gray-800 rounded-tl-sm rounded-tr-xl rounded-br-xl border border-gray-200'
                        } p-3 shadow-sm`}>
                          <p className="mb-1">{message.content}</p>
                          <div className={`text-xs ${
                            message.senderId === 101 ? 'text-violet-200' : 'text-gray-500'
                          } text-right`}>
                            {formatMessageTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-end gap-2">
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-violet-600">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-violet-600">
                        <Image className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-violet-600">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows={1}
                        placeholder="Escribe un mensaje..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                    </div>
                    <button 
                      className="p-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">Selecciona una conversación</h3>
                  <p className="text-gray-500 mb-4">Elige una conversación existente o inicia una nueva</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
