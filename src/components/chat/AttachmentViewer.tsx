import React, { useState } from 'react';
import { File, Image, FileText, Video, Mic, X, Download, ExternalLink } from 'lucide-react';
import { ChatAttachment } from '../../lib/types/chat';

interface AttachmentViewerProps {
  attachment: ChatAttachment;
  preview?: boolean;
  onRemove?: () => void;
  className?: string;
}

/**
 * Componente para visualizar archivos adjuntos en los mensajes
 */
const AttachmentViewer: React.FC<AttachmentViewerProps> = ({ 
  attachment, 
  preview = false,
  onRemove,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Determinar el tipo de icono según el tipo de archivo
  const getFileIcon = () => {
    const type = attachment.type || '';
    
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <Mic className="w-5 h-5" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
    
    // Default icon
    return <File className="w-5 h-5" />;
  };
  
  // Contenido según el tipo de archivo
  const renderContent = () => {
    const type = attachment.type || '';
    
    // Imágenes
    if (type.startsWith('image/')) {
      return (
        <div className={`relative ${expanded ? 'max-w-full' : 'max-w-xs'}`}>
          <img 
            src={attachment.url} 
            alt={attachment.name || 'Imagen adjunta'} 
            className={`rounded-lg max-h-60 ${expanded ? 'max-w-full' : 'max-w-xs'} object-contain cursor-pointer`}
            onClick={() => setExpanded(!expanded)}
          />
        </div>
      );
    }
    
    // Videos
    if (type.startsWith('video/')) {
      return (
        <div className="max-w-sm">
          <video 
            src={attachment.url} 
            controls
            className="rounded-lg max-w-full max-h-60"
          >
            Tu navegador no soporta el elemento video.
          </video>
        </div>
      );
    }
    
    // Audio
    if (type.startsWith('audio/')) {
      return (
        <div className="w-full max-w-xs">
          <audio 
            src={attachment.url} 
            controls
            className="w-full"
          >
            Tu navegador no soporta el elemento audio.
          </audio>
        </div>
      );
    }
    
    // PDF y otros documentos - mostrar botón de descarga
    return (
      <div className="flex items-center space-x-2">
        <div className="bg-gray-100 rounded p-2">
          {getFileIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
        </div>
        
        <a 
          href={attachment.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-1 hover:bg-gray-100 rounded"
          download={attachment.name}
        >
          <Download className="w-4 h-4" />
        </a>
        
        <a 
          href={attachment.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  };
  
  // Para vista previa (antes de enviar)
  if (preview) {
    return (
      <div className={`relative bg-gray-50 rounded-lg p-2 flex items-center ${className}`}>
        {getFileIcon()}
        
        <div className="ml-2 flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
        </div>
        
        {onRemove && (
          <button 
            onClick={onRemove} 
            className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Eliminar adjunto"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
  
  // Vista en mensaje
  return (
    <div className={`mt-2 ${className}`}>
      {renderContent()}
    </div>
  );
};

export default AttachmentViewer;
