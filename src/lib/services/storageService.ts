import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { ChatAttachment } from '../types/chat';

/**
 * Servicio para gestionar la subida de archivos a Firebase Storage
 */
export class StorageService {
  /**
   * Sube un archivo a Firebase Storage y devuelve la URL del archivo
   * @param file El archivo a subir
   * @param path La carpeta donde se subirá el archivo
   * @returns Una promesa con los datos del archivo subido
   */
  static async uploadFile(
    file: File, 
    path = 'chat-attachments'
  ): Promise<ChatAttachment> {
    // Crear una referencia al archivo con un nombre único
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    // Subir el archivo
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Devolver una promesa que se resuelve cuando el archivo se ha subido
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        // Progreso de la subida
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        // Error
        (error) => {
          console.error('Error al subir archivo:', error);
          reject(error);
        },
        // Éxito
        async () => {
          try {
            // Obtener la URL del archivo subido
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Determinar el tipo como uno de los tipos válidos de ChatAttachment
            let attachmentType: ChatAttachment['type'] = 'file';
            if (file.type.startsWith('image/')) {
              attachmentType = 'image';
            } else if (file.type.startsWith('video/')) {
              attachmentType = 'video';
            } else if (file.type.startsWith('audio/')) {
              attachmentType = 'audio';
            }
            
            // Resolver la promesa con los datos del archivo
            resolve({
              url: downloadURL,
              name: file.name,
              type: attachmentType,
              size: file.size,
            });
          } catch (error) {
            console.error('Error al obtener URL de descarga:', error);
            reject(error);
          }
        }
      );
    });
  }
}
