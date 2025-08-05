/**
 * Utilidades para manejo de archivos
 */

/**
 * Determina el tipo de archivo basado en su extensión
 * @param filename Nombre del archivo
 * @returns Tipo del archivo (image, video, audio, pdf, document)
 */
export const getFileType = (filename: string): string => {
  if (!filename) return 'document';
  
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Imágenes
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
    return 'image';
  }
  
  // Videos
  if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'].includes(extension)) {
    return 'video';
  }
  
  // Audio
  if (['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(extension)) {
    return 'audio';
  }
  
  // PDF
  if (extension === 'pdf') {
    return 'pdf';
  }
  
  // Documentos
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv'].includes(extension)) {
    return 'document';
  }
  
  // Por defecto
  return 'document';
};

/**
 * Formatea el tamaño de archivo en un formato legible
 * @param bytes Tamaño en bytes
 * @returns Tamaño formateado (e.g. "2.5 MB")
 */
export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

/**
 * Descarga un archivo desde una URL
 * @param url URL del archivo
 * @param filename Nombre con el que se guardará el archivo
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  
  // Agregar el link al DOM (necesario para Firefox)
  document.body.appendChild(link);
  
  // Simular clic
  link.click();
  
  // Eliminar el link
  document.body.removeChild(link);
};

/**
 * Verifica si un archivo es demasiado grande
 * @param size Tamaño en bytes
 * @param limit Límite en MB (por defecto 50MB)
 * @returns true si el archivo es demasiado grande
 */
export const isFileTooLarge = (size: number, limit: number = 50): boolean => {
  const limitInBytes = limit * 1024 * 1024; // Convertir MB a bytes
  return size > limitInBytes;
};

/**
 * Obtiene un icono y color para un tipo de archivo
 * @param fileType Tipo de archivo
 * @returns Objeto con nombre de icono y color
 */
export const getFileIconAndColor = (fileType: string): { icon: string, color: string } => {
  switch (fileType) {
    case 'image':
      return { icon: 'image', color: 'text-blue-500' };
    case 'video':
      return { icon: 'video', color: 'text-green-500' };
    case 'audio':
      return { icon: 'headphones', color: 'text-purple-500' };
    case 'pdf':
      return { icon: 'file-text', color: 'text-red-500' };
    case 'document':
    default:
      return { icon: 'file', color: 'text-gray-500' };
  }
};

/**
 * Devuelve una URL para vista previa de imagen segura
 * @param url URL de la imagen
 * @returns URL con proxy o la misma URL si ya es HTTPS
 */
export const getSafeImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Si la URL ya es HTTPS, devolverla directamente
  if (url.startsWith('https://')) {
    return url;
  }
  
  // Si es HTTP, usar un proxy de imágenes para evitar errores de contenido mixto
  if (url.startsWith('http://')) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
  }
  
  // Para URLs relativas o de almacenamiento local, devolverlas tal cual
  return url;
};
