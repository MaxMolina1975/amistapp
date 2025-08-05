import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseMember } from '../../lib/types';
import { User, Star, Trash2, Plus, MessageSquare } from 'lucide-react';

interface StudentListProps {
  members: CourseMember[];
  onAddStudent: () => void;
  onRemoveStudent: (userId: string) => void;
  onAwardPoints: (userId: string) => void;
}

export function StudentList({ members, onAddStudent, onRemoveStudent, onAwardPoints }: StudentListProps) {
  const navigate = useNavigate();

  // Función para redirigir a la página de mensajes con el ID del estudiante
  const handleSendMessage = (userId: string) => {
    navigate(`/mensajes?userId=${userId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Estudiantes</h2>
        <button
          onClick={onAddStudent}
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar Estudiante
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {members.map((member) => (
          <div key={member.userId} className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">{member.user?.fullName}</p>
                <p className="text-sm text-gray-500">{member.points} puntos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSendMessage(member.userId)}
                className="p-2 text-violet-500 hover:bg-violet-50 rounded-lg"
                title="Enviar mensaje"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button
                onClick={() => onAwardPoints(member.userId)}
                className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg"
                title="Otorgar puntos"
              >
                <Star className="w-5 h-5" />
              </button>
              <button
                onClick={() => onRemoveStudent(member.userId)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                title="Eliminar estudiante"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        
        {members.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No hay estudiantes en este curso. Haz clic en "Agregar Estudiante" para añadir uno.
          </div>
        )}
      </div>
    </div>
  );
}