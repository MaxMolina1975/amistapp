import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatService } from '../services/chatService';
import { ChatMessage, ChatConversation, ChatUser, ChatAttachment } from '../types/chat';


export function useChat() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar conversaciones al inicio
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    const userId = typeof currentUser.id === 'string' 
      ? parseInt(currentUser.id) 
      : currentUser.id;
    
    try {
      const unsubscribe = ChatService.getUserConversations(userId, (newConversations: ChatConversation[]) => {
        setConversations(newConversations);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (err: any) {
      console.error("Error loading conversations:", err);
      setError("Error al cargar las conversaciones");
      setLoading(false);
    }
  }, [currentUser]);
  
  // Seleccionar una conversación
  const selectConversation = useCallback((conversation: ChatConversation | string | null) => {
    if (conversation === null) {
      setSelectedConversation(null);
      setMessages([]);
      return;
    }
    
    // Si recibimos un string (ID de conversación), buscamos la conversación correspondiente
    const actualConversation = typeof conversation === 'string' 
      ? conversations.find(c => c.id === conversation) 
      : conversation;
    
    if (!actualConversation) {
      console.error("No se encontró la conversación", conversation);
      return;
    }
    
    setSelectedConversation(actualConversation);
    
    // Cargar mensajes para esta conversación desde la base de datos
    try {
      const unsubscribe = ChatService.getConversationMessages(actualConversation.id, (newMessages: ChatMessage[]) => {
        setMessages(newMessages);
        
        // Marcar mensajes como leídos si hay mensajes no leídos
        if (currentUser && actualConversation.unreadCount > 0) {
          const userId = typeof currentUser.id === 'string' 
            ? parseInt(currentUser.id) 
            : currentUser.id;
          
          ChatService.markConversationAsRead(actualConversation.id, userId)
            .catch((err: any) => console.error("Error marking messages as read:", err));
        }
      });
      
      return () => unsubscribe();
    } catch (err: any) {
      console.error("Error loading messages:", err);
      setError("Error al cargar los mensajes");
    }
  }, [currentUser, conversations]);
  
  // Enviar un mensaje
  const sendMessage = useCallback((content: string, attachments?: ChatAttachment[]) => {
    if (!selectedConversation || !currentUser) {
      console.error("No hay conversación seleccionada o usuario actual");
      return Promise.reject("No hay conversación seleccionada o usuario actual");
    }
    
    const userId = typeof currentUser.id === 'string' 
      ? parseInt(currentUser.id) 
      : currentUser.id;
    
    try {
      return ChatService.sendMessage({
        conversationId: selectedConversation.id,
        senderId: userId,
        senderName: currentUser.name || 'Usuario',
        senderRole: currentUser.role as 'teacher' | 'student' | 'tutor',
        content,
        attachments: attachments || []
      });
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError("Error al enviar el mensaje");
      return Promise.reject(err);
    }
  }, [currentUser, selectedConversation]);
  
  // Crear nueva conversación o usar una existente
  const startConversation = useCallback(async (user: ChatUser): Promise<string | null> => {
    if (!currentUser) return null;
    
    try {
      // Verificar si ya existe una conversación entre estos usuarios
      const currentUserId = typeof currentUser.id === 'string' ? parseInt(currentUser.id) : currentUser.id;
      const otherUserId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
      
      const existingConversation = conversations.find(conv => 
        conv.participantIds && 
        conv.participantIds.includes(currentUserId) && 
        conv.participantIds.includes(otherUserId)
      );
      
      if (existingConversation) {
        return existingConversation.id;
      }
      
      // Crear nueva conversación
      const currentUserForChat: ChatUser = {
        id: currentUserId,
        name: currentUser.name,
        role: currentUser.role as 'teacher' | 'student' | 'tutor',
        email: currentUser.email,
        photoURL: currentUser.profilePicture || ''
      };
      
      const newConversationId = await ChatService.createConversation([
        currentUserForChat,
        user
      ]);
      
      return newConversationId;
    } catch (err: any) {
      console.error("Error creating conversation:", err);
      setError("Error al crear la conversación");
      return null;
    }
  }, [currentUser, conversations]);
  
  // Buscar usuarios de chat
  const searchChatUsers = useCallback(async (searchTerm: string): Promise<ChatUser[]> => {
    try {
      // Llamar al servicio real para buscar usuarios
      return await ChatService.searchUsers(searchTerm);
    } catch (err: any) {
      console.error("Error searching users:", err);
      return [];
    }
  }, []);
  
  return {
    conversations,
    selectedConversation,
    messages,
    loading,
    error,
    selectConversation,
    sendMessage,
    startConversation,
    searchChatUsers
  };
}
