import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star } from 'lucide-react';

interface UserProfileCardProps {
  id: number;
  name: string;
  role: string;
  photoUrl?: string;
  grade?: string;
  collaborationPoints?: number;
  showMessageButton?: boolean;
  showCollaborationPoints?: boolean;
  className?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  id,
  name,
  role,
  photoUrl,
  grade,
  collaborationPoints = 0,
  showMessageButton = true,
  showCollaborationPoints = true,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    // Navegar a la vista de mensajes con el ID del usuario preseleccionado
    navigate(`/mensajes?userId=${id}`);
  };

  // Determinar la clase de color para el indicador de rol
  const getRoleColorClass = () => {
    switch (role.toLowerCase()) {
      case 'docente':
      case 'teacher':
        return 'bg-blue-500';
      case 'estudiante':
      case 'student':
        return 'bg-green-500';
      case 'tutor':
      case 'parent':
        return 'bg-violet-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Obtener iniciales del nombre para avatar fallback
  const getInitials = () => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="relative">
        {/* Foto o Avatar */}
        <div className="w-full h-24 bg-gradient-to-r from-violet-500 to-violet-400"></div>
        <div className="absolute -bottom-10 left-4">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-medium text-gray-600">{getInitials()}</span>
            )}
          </div>
        </div>
        {/* Indicador de rol */}
        <div className="absolute -bottom-2 left-16">
          <div className={`w-5 h-5 rounded-full ${getRoleColorClass()} border-2 border-white`}></div>
        </div>
      </div>

      <div className="pt-12 pb-4 px-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <span className="capitalize">{role}</span>
          {grade && <span className="ml-2">• {grade}</span>}
        </div>

        {/* Puntos de colaboración */}
        {showCollaborationPoints && collaborationPoints > 0 && (
          <div className="flex items-center mt-3 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">
              {collaborationPoints} puntos de colaboración
            </span>
          </div>
        )}

        {/* Botón de mensaje */}
        {showMessageButton && (
          <button
            onClick={handleMessageClick}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Mensaje
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;
