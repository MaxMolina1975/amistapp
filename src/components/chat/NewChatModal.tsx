import React, { useState, useEffect, useRef } from 'react';
import { X, Search, User, UserCircle, AtSign, Loader2 } from 'lucide-react';
import { ChatUser, UserRole } from '../../lib/types/chat';

interface NewChatModalProps {
  onClose: () => void;
  onSearch: (query: string) => void;
  onSelectUser: (user: ChatUser) => void;
  searchResults: ChatUser[];
  loading: boolean;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  onClose,
  onSearch,
  onSelectUser,
  searchResults,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Manejar clic fuera del modal para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Enfocar el input de búsqueda cuando se abre el modal
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Solo realizar búsqueda si hay al menos 2 caracteres
    if (value.length >= 2) {
      onSearch(value);
    }
  };
  
  // Manejar tecla Enter para iniciar búsqueda
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.length >= 2) {
      onSearch(searchTerm);
    }
  };
  
  // Obtener icono según el rol
  const getRoleIcon = (role: UserRole) => {
    switch(role) {
      case 'teacher': return <UserCircle className="w-4 h-4 text-blue-600" />;
      case 'tutor': return <AtSign className="w-4 h-4 text-purple-600" />;
      case 'student': return <User className="w-4 h-4 text-green-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };
  
  // Obtener etiqueta según el rol
  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'teacher': return 'Docente';
      case 'tutor': return 'Tutor';
      case 'student': return 'Estudiante';
      default: return role;
    }
  };
  
  // Obtener color de fondo según el rol
  const getRoleBgColor = (role: UserRole) => {
    switch(role) {
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'tutor': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-800">Nuevo chat</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar usuarios por nombre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Escribe al menos 2 caracteres para buscar
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-gray-600">Buscando usuarios...</span>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm.length < 2 
                ? 'Escribe un nombre para buscar usuarios' 
                : 'No se encontraron usuarios con ese nombre'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {searchResults.map((user) => (
                <li 
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onSelectUser(user)}
                >
                  <div className="flex items-center p-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${getRoleBgColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{getRoleLabel(user.role)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
