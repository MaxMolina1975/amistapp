import { 
  collection, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc, 
  getDocs, 
  serverTimestamp,
  Timestamp,
  setDoc,
  writeBatch,
  DocumentData,
  Firestore
} from 'firebase/firestore';
// Importar desde la configuración centralizada de Firebase
import { db } from '../firebase';
import { ChatMessage, ChatConversation, ChatUser, generateConversationId } from '../types/chat';

// Referencia a colecciones
const CONVERSATIONS_COLLECTION = 'conversations';
const MESSAGES_COLLECTION = 'messages';
const USERS_COLLECTION = 'users';

// Clase para el servicio de chat
export class ChatService {
  // Verificar si Firestore está disponible
  private static isFirestoreAvailable(): boolean {
    if (!db) {
      console.error('Firestore no está disponible. Verifica la configuración de Firebase.');
      return false;
    }
    return true;
  }

  // Obtener las conversaciones de un usuario
  static getUserConversations(userId: number | string, callback: (conversations: ChatConversation[]) => void) {
    if (!this.isFirestoreAvailable()) {
      callback([]);
      return () => {}; // Retornar función de limpieza vacía
    }

    const userIdStr = userId.toString();
    
    const q = query(
      collection(db as Firestore, CONVERSATIONS_COLLECTION),
      where('participantIds', 'array-contains', userIdStr),
      orderBy('lastMessageAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const conversations: ChatConversation[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        
        // Crear objeto de conversación a partir de los datos
        const conversation: ChatConversation = {
          id: doc.id,
          participants: data.participants || [],
          participantIds: data.participantIds || [],
          lastMessage: data.lastMessageContent || '',
          lastMessageAt: data.lastMessageAt ? data.lastMessageAt.toDate().toISOString() : new Date().toISOString(),
          unreadCount: data.unreadCount?.[userIdStr] || 0,
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
        };
        
        conversations.push(conversation);
      });
      
      callback(conversations);
    });
  }
  
  // Obtener mensajes de una conversación
  static getConversationMessages(conversationId: string, callback: (messages: ChatMessage[]) => void) {
    if (!this.isFirestoreAvailable()) {
      callback([]);
      return () => {}; // Retornar función de limpieza vacía
    }

    const q = query(
      collection(db as Firestore, MESSAGES_COLLECTION),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        
        // Convertir el ID de remitente a número si es posible
        let senderId: number;
        try {
          senderId = typeof data.senderId === 'string' ? parseInt(data.senderId) : data.senderId;
        } catch (e) {
          senderId = 0; // Valor por defecto en caso de error
        }
        
        // Crear objeto de mensaje a partir de los datos
        const message: ChatMessage = {
          id: doc.id,
          conversationId: data.conversationId,
          senderId: senderId,
          senderName: data.senderName || '',
          senderRole: data.senderRole || 'student',
          content: data.content || '',
          timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
          read: data.read || false,
          attachments: data.attachments || []
        };
        
        messages.push(message);
      });
      
      callback(messages);
    });
  }
  
  // Crear una nueva conversación
  static async createConversation(participants: ChatUser[]): Promise<string> {
    if (!this.isFirestoreAvailable()) {
      throw new Error('Servicio Firebase no disponible');
    }

    try {
      // Extraer IDs de participantes
      const participantIds = participants.map(p => p.id.toString());
      
      // Intentar usar un ID generado a partir de los IDs de usuario
      const conversationId = generateConversationId(participants.map(p => typeof p.id === 'string' ? parseInt(p.id) : p.id));
      
      // Verificar si la conversación ya existe
      const conversationRef = doc(db as Firestore, CONVERSATIONS_COLLECTION, conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (conversationDoc.exists()) {
        // La conversación ya existe, retornar su ID
        return conversationId;
      }
      
      // Crear objeto de conversación
      const conversation = {
        participants: participants,
        participantIds: participantIds,
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        lastMessageContent: '',
        unreadCount: {} as Record<string, number> // Inicializar conteo de no leídos para cada usuario
      };
      
      // Inicializar el conteo de no leídos para cada participante
      participants.forEach(p => {
        conversation.unreadCount[p.id.toString()] = 0;
      });
      
      // Crear la conversación con el ID especificado
      await setDoc(conversationRef, conversation);
      
      return conversationId;
    } catch (error) {
      console.error('Error al crear conversación:', error);
      throw error;
    }
  }
  
  // Enviar un mensaje
  static async sendMessage(message: Partial<ChatMessage>): Promise<string> {
    if (!this.isFirestoreAvailable()) {
      throw new Error('Servicio Firebase no disponible');
    }

    try {
      // Verificar que los campos requeridos estén presentes
      if (!message.conversationId || !message.senderId) {
        throw new Error('Faltan campos requeridos para enviar mensaje');
      }
      
      // Convertir ID de remitente a string para compatibilidad
      const senderIdStr = message.senderId.toString();
      
      // Crear objeto de mensaje
      const newMessage = {
        conversationId: message.conversationId,
        senderId: senderIdStr,
        senderName: message.senderName || '',
        senderRole: message.senderRole || 'student',
        content: message.content || '',
        timestamp: serverTimestamp(),
        read: false,
        attachments: message.attachments || []
      };
      
      // Añadir el mensaje a la colección
      const messageRef = await addDoc(collection(db as Firestore, MESSAGES_COLLECTION), newMessage);
      
      // Actualizar la información de la conversación
      const conversationRef = doc(db as Firestore, CONVERSATIONS_COLLECTION, message.conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (conversationDoc.exists()) {
        const conversationData = conversationDoc.data();
        const unreadCount = { ...conversationData.unreadCount };
        
        // Incrementar el conteo de no leídos para todos los participantes excepto el remitente
        if (conversationData.participantIds) {
          conversationData.participantIds.forEach((participantId: string) => {
            if (participantId !== senderIdStr) {
              unreadCount[participantId] = (unreadCount[participantId] || 0) + 1;
            }
          });
        }
        
        // Actualizar la conversación
        await updateDoc(conversationRef, {
          lastMessageContent: message.content || '',
          lastMessageAt: serverTimestamp(),
          unreadCount: unreadCount
        });
      }
      
      return messageRef.id;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }
  
  // Marcar mensajes como leídos
  static async markConversationAsRead(conversationId: string, userId: number | string): Promise<void> {
    if (!this.isFirestoreAvailable()) {
      return;
    }

    try {
      const userIdStr = userId.toString();
      
      // Actualizar el contador de no leídos
      const conversationRef = doc(db as Firestore, CONVERSATIONS_COLLECTION, conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (conversationDoc.exists()) {
        const data = conversationDoc.data();
        const unreadCount = { ...data.unreadCount };
        
        // Resetear el contador para este usuario
        unreadCount[userIdStr] = 0;
        
        await updateDoc(conversationRef, {
          unreadCount: unreadCount
        });
      }
      
      // Marcar todos los mensajes como leídos
      const q = query(
        collection(db as Firestore, MESSAGES_COLLECTION),
        where('conversationId', '==', conversationId),
        where('read', '==', false)
      );
      
      const batch = writeBatch(db as Firestore);
      const snapshot = await getDocs(q);
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Solo marcar como leídos los mensajes que no sean del usuario actual
        if (data.senderId !== userIdStr) {
          batch.update(doc.ref, { read: true });
        }
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error al marcar conversación como leída:', error);
    }
  }
  
  // Obtener la cantidad de mensajes no leídos para un usuario
  static getUserUnreadMessageCount(userId: number | string, callback: (count: number) => void) {
    if (!this.isFirestoreAvailable()) {
      callback(0);
      return () => {}; // Retornar función de limpieza vacía
    }

    const userIdStr = userId.toString();
    
    const q = query(
      collection(db as Firestore, CONVERSATIONS_COLLECTION),
      where('participantIds', 'array-contains', userIdStr)
    );
    
    return onSnapshot(q, (snapshot) => {
      let totalUnread = 0;
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.unreadCount && data.unreadCount[userIdStr]) {
          totalUnread += data.unreadCount[userIdStr];
        }
      });
      
      callback(totalUnread);
    });
  }
}
