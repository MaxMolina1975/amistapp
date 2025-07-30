import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/context/AuthContext';
import { useStudents, StudentWithStats } from '../../../lib/types/student';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ArrowRight,
  Mail,
  Phone
} from 'lucide-react';

export function EstudiantesHub() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { students: myStudents, loading: isLoading, error } = useStudents(undefined, user?.id);
  
  // Filtro de estudiantes basado en la búsqueda
  const filteredStudents = myStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (studentId: number) => {
    navigate(`/tutor/estudiantes/perfil/${studentId}`);
  };

  const handleAddStudent = () => {
    navigate('/tutor/estudiantes/vincular');
  };

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis Estudiantes</h1>
        <p className="text-gray-600">Gestiona los estudiantes a tu cargo</p>
      </header>

      {/* Barra de búsqueda y controles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="Buscar estudiante..."
              className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={handleAddStudent}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            <span>Vincular Estudiante</span>
          </button>
        </div>
      </div>

      {/* Lista de estudiantes */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando estudiantes...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-red-600 mb-4">Error al cargar estudiantes: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              Reintentar
            </button>
          </div>
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div 
              key={student.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex flex-col md:flex-row justify-between">
                <div className="flex items-start md:items-center mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    {student.profileImage ? (
                      <img 
                        src={student.profileImage}
                        alt={`${student.name} ${student.lastName}`}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <span className="text-lg text-blue-600 font-medium">
                        {student.name[0]}{student.lastName[0]}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {student.name} {student.lastName}
                    </h3>
                    <p className="text-gray-500">Grado: {student.grade}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        student.stats.emotionalIndex >= 80 ? 'bg-green-100 text-green-700' :
                        student.stats.emotionalIndex >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {student.stats.emotionalIndex >= 80 ? 'Buen progreso' :
                        student.stats.emotionalIndex >= 60 ? 'Progreso regular' :
                        'Necesita atención'}
                      </div>
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {student.stats.points} puntos
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                  <div className="hidden md:flex flex-col items-start">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>estudiante.{student.id}@amistaap.edu</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>+{Math.floor(Math.random() * 900000000) + 100000000}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleViewProfile(student.id)}
                    className="bg-violet-50 text-violet-700 px-4 py-2 rounded-lg hover:bg-violet-100 transition-colors flex items-center self-end md:self-auto"
                  >
                    <span>Ver perfil</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            {searchTerm ? (
              <>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No se encontraron estudiantes</h3>
                <p className="text-gray-500 mb-4">No hay resultados para "{searchTerm}"</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No hay estudiantes asignados</h3>
                <p className="text-gray-500 mb-4">Aún no tienes ningún estudiante bajo tu tutoría</p>
              </>
            )}
            <button 
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
              onClick={handleAddStudent}
            >
              Vincular estudiante
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EstudiantesHub;
