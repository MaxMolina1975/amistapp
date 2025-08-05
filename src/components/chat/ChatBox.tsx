import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Paperclip, X, Loader2, FileText, Image as ImageIcon, File } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils/dateUtils';
import { useAuth } from '../../lib/context/AuthContext';
import { ChatMessage, ChatUser, ChatAttachment } from '../../lib/types/chat';

// Tipo extendido para los adjuntos internos con información de archivo y previsualización
interface AttachmentType extends ChatAttachment {
  id: string;
  file?: File;
  previewUrl?: string;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, attachments: AttachmentType[]) => void;
  recipient?: ChatUser;
  onBack?: () => void;
  loading?: boolean;
  onTypingStatusChange?: (isTyping: boolean) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  recipient,
  onBack,
  loading = false,
  onTypingStatusChange,
}) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<AttachmentType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Scroll al final cuando se reciben nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Auto-resize del textarea
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = `${messageInputRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  // Función para obtener el otro participante
  const getOtherParticipant = () => {
    if (!currentUser || !recipient) return null;
    
    return recipient;
  };
  
  // Función para manejar cambios en el input de mensajes
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Notificar estado de escritura
    if (!isTyping) {
      setIsTyping(true);
      onTypingStatusChange && onTypingStatusChange(true);
    }
    
    // Reset del timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Nuevo timeout para detectar cuando el usuario deja de escribir
    const newTimeout = setTimeout(() => {
      setIsTyping(false);
      onTypingStatusChange && onTypingStatusChange(false);
    }, 1000);
    
    setTypingTimeout(newTimeout);
  };
  
  // Función para manejar envío de mensajes
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
      
      // Restablecer altura del textarea
      if (messageInputRef.current) {
        messageInputRef.current.style.height = 'auto';
      }
      
      // Notificar que dejó de escribir
      if (isTyping) {
        setIsTyping(false);
        onTypingStatusChange && onTypingStatusChange(false);
      }
    }
  };
  
  // Función para manejar la carga de archivos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newAttachments: AttachmentType[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = `${Date.now()}-${i}`;
      
      // Determinar el tipo de adjunto
      let attachmentType: "image" | "video" | "audio" | "file" = "file";
      if (file.type.startsWith('image/')) attachmentType = "image";
      else if (file.type.startsWith('video/')) attachmentType = "video";
      else if (file.type.startsWith('audio/')) attachmentType = "audio";
      
      const newAttachment: AttachmentType = {
        id,
        name: file.name,
        size: file.size,
        type: attachmentType,
        url: '', // Será llenado cuando se suba el archivo
        file,
        previewUrl: undefined
      };
      
      // Si es una imagen, generar una vista previa
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setAttachments(prev => 
            prev.map(att => 
              att.id === id ? { ...att, previewUrl: result, preview: result } : att
            )
          );
        };
        reader.readAsDataURL(file);
      }
      
      newAttachments.push(newAttachment);
    }
    
    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Limpiar el input de archivos
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Función para eliminar un adjunto
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };
  
  // Función para hacer scroll al final de los mensajes
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Renderizar adjuntos en un mensaje
  const renderMessageAttachments = (attachments?: ChatAttachment[]) => {
    if (!attachments || attachments.length === 0) return null;
    
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {attachments.map((attachment, index) => {
          // Si es una imagen con vista previa
          if (attachment.type === 'image' && (attachment.preview || (attachment as AttachmentType).previewUrl)) {
            return (
              <div 
                key={index} 
                className="relative border rounded overflow-hidden"
                style={{ maxWidth: '200px', maxHeight: '150px' }}
              >
                <img 
                  src={attachment.preview || (attachment as AttachmentType).previewUrl} 
                  alt={attachment.name}
                  className="object-cover w-full h-full" 
                  style={{ maxHeight: '150px' }}
                />
              </div>
            );
          }
          
          // Para otros tipos de archivo
          return (
            <div 
              key={index}
              className="flex items-center p-2 border rounded bg-gray-50"
            >
              {attachment.type === 'file' && <FileText className="h-4 w-4 text-blue-500 mr-2" />}
              {attachment.type === 'video' && <File className="h-4 w-4 text-red-500 mr-2" />}
              {attachment.type === 'audio' && <File className="h-4 w-4 text-purple-500 mr-2" />}
              <span className="text-sm truncate" style={{ maxWidth: '100px' }}>
                {attachment.name}
              </span>
              {attachment.size !== undefined && (
                <span className="ml-1 text-xs text-gray-500">
                  ({formatFileSize(attachment.size)})
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Renderizar previsualización de adjuntos antes de enviar
  const renderAttachmentPreviews = () => {
    if (attachments.length === 0) return null;
    
    return (
      <div className="p-2 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div 
              key={attachment.id}
              className="relative group border rounded overflow-hidden bg-gray-50"
            >
              {attachment.type === 'image' && attachment.previewUrl ? (
                <div style={{ width: '100px', height: '100px' }}>
                  <img 
                    src={attachment.previewUrl} 
                    alt={attachment.name}
                    className="object-cover w-full h-full" 
                  />
                </div>
              ) : (
                <div className="p-2 flex flex-col items-center justify-center" style={{ width: '100px', height: '100px' }}>
                  {attachment.type === 'file' && <FileText className="h-8 w-8 text-blue-500" />}
                  {attachment.type === 'video' && <File className="h-8 w-8 text-red-500" />}
                  {attachment.type === 'audio' && <File className="h-8 w-8 text-purple-500" />}
                  <span className="mt-1 text-xs text-center truncate w-full">
                    {attachment.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(attachment.size)}
                  </span>
                </div>
              )}
              <button
                className="absolute top-1 right-1 bg-gray-700 bg-opacity-70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeAttachment(attachment.id)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Obtener el otro participante
  const otherParticipant = getOtherParticipant();
  
  return (
    <div className="flex flex-col h-full">
      {/* Cabecera */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center">
        <div className="md:hidden mr-2">
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex items-center flex-1">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
            {otherParticipant?.photoURL ? (
              <img 
                src={otherParticipant.photoURL} 
                alt={otherParticipant.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium">
                {otherParticipant?.name.charAt(0).toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {otherParticipant?.name || 'Usuario'}
            </h3>
            <p className="text-sm text-gray-500">
              {otherParticipant?.role === 'teacher' ? 'Docente' : 
               otherParticipant?.role === 'tutor' ? 'Tutor' : 
               otherParticipant?.role === 'student' ? 'Estudiante' : 'Usuario'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Área de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <span className="ml-2 text-gray-600">Cargando mensajes...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <Send className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No hay mensajes aún
            </h3>
            <p className="text-gray-500 max-w-md">
              Envía un mensaje para comenzar la conversación con {otherParticipant?.name || 'este usuario'}.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = msg.senderId === (typeof currentUser?.id === 'string' ? parseInt(currentUser.id) : currentUser?.id);
            const messageDate = new Date(msg.timestamp);
            
            return (
              <div 
                key={msg.id || crypto.randomUUID()}
                className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isCurrentUser && (
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      {otherParticipant?.photoURL ? (
                        <img 
                          src={otherParticipant.photoURL} 
                          alt={otherParticipant.name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {otherParticipant?.name.charAt(0).toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className={`max-w-[70%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                  <div 
                    className={`rounded-lg p-3 break-words ${
                      isCurrentUser 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.content}
                    {renderMessageAttachments(msg.attachments)}
                  </div>
                  
                  <div className={`mt-1 text-xs text-gray-500 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                    {formatRelativeTime(messageDate)}
                    {isCurrentUser && (
                      <span className="ml-1">
                        {msg.read ? '• Leído' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Área de input y adjuntos */}
      <div className="bg-white border-t border-gray-200">
        {renderAttachmentPreviews()}
        
        <form onSubmit={handleSendMessage} className="p-4">
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 flex-shrink-0"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            
            <div className="relative flex-1">
              <textarea
                ref={messageInputRef}
                value={message}
                onChange={handleMessageChange}
                placeholder="Escribe un mensaje..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                style={{ maxHeight: '150px', minHeight: '42px' }}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={message.trim() === '' && attachments.length === 0}
              className={`p-2 rounded-full flex-shrink-0 ${
                message.trim() === '' && attachments.length === 0
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ChatBox;
