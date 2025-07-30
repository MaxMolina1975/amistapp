import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/context/AuthContext';
import { StudentWithStats, useStudents } from '../../../lib/types/student';
import { 
  Users, Search, Filter, ArrowUpDown, 
  UserCircle, BarChart3, MessageCircle 
} from 'lucide-react';

export default function StudentsList() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof StudentWithStats | 'stats.emotionalIndex'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Obtener estudiantes asignados a este tutor desde la API
  const tutorId = currentUser?.id;
  const { students: myStudents, loading, error } = useStudents(undefined, tutorId?.toString());

  // Filtered and sorted students
  const filteredStudents = myStudents.filter(student => {
    const matchesSearch = (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'needsAttention') return matchesSearch && student.stats.emotionalIndex < 70;
    if (selectedFilter === 'goodProgress') return matchesSearch && student.stats.emotionalIndex >= 80;
    
    return matchesSearch;
  });

  // Sort students based on selected sort field and direction
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valueA, valueB;
    
    if (sortField === 'stats.emotionalIndex') {
      valueA = a.stats.emotionalIndex;
      valueB = b.stats.emotionalIndex;
    } else if (sortField === 'name') {
      valueA = a.name.toLowerCase();
      valueB = b.name.toLowerCase();
    } else {
      valueA = a[sortField];
      valueB = b[sortField];
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof StudentWithStats | 'stats.emotionalIndex') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Estudiantes</h1>
        <p className="text-gray-600">Gestiona y monitorea a tus estudiantes asignados</p>
      </header>
      
      {/* Mostrar mensaje de error si ocurre algún problema */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error al cargar estudiantes: {error}</p>
        </div>
      )}
      
      {/* Mostrar indicador de carga */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
          <span className="ml-2 text-gray-600">Cargando estudiantes...</span>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 flex flex-wrap gap-4 border-b border-gray-100">
          {/* Search bar */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar estudiante..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            </div>
          </div>

          {/* Filter options */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button 
                className={`px-3 py-1 rounded-md ${selectedFilter === 'all' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                Todos
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${selectedFilter === 'needsAttention' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setSelectedFilter('needsAttention')}
              >
                Necesitan atención
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${selectedFilter === 'goodProgress' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setSelectedFilter('goodProgress')}
              >
                Buen progreso
              </button>
            </div>
            <button className="p-2 border rounded-lg">
              <Filter className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Student list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-medium text-gray-600">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => handleSort('name')}
                  >
                    Estudiante
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="p-4 font-medium text-gray-600">Grado</th>
                <th className="p-4 font-medium text-gray-600">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => handleSort('stats.emotionalIndex')}
                  >
                    Índice Emocional
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="p-4 font-medium text-gray-600">Participación</th>
                <th className="p-4 font-medium text-gray-600">Asistencia</th>
                <th className="p-4 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.length > 0 ? (
                sortedStudents.map(student => (
                  <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                          {student.profileImage ? (
                            <img 
                              src={student.profileImage} 
                              alt={`${student.name} ${student.lastName}`}
                              className="w-10 h-10 rounded-full object-cover" 
                            />
                          ) : (
                            <UserCircle className="w-6 h-6 text-violet-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{student.name} {student.lastName}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{student.grade} {student.group}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              student.stats.emotionalIndex >= 80 ? 'bg-green-500' : 
                              student.stats.emotionalIndex >= 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${student.stats.emotionalIndex}%` }}
                          ></div>
                        </div>
                        <span>{student.stats.emotionalIndex}%</span>
                      </div>
                    </td>
                    <td className="p-4">{student.stats.participationRate}%</td>
                    <td className="p-4">{student.stats.attendanceRate}%</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/tutor/students/${student.id}`)}
                          className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                          title="Ver perfil"
                        >
                          <UserCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => navigate(`/tutor/reports/${student.id}`)}
                          className="p-1.5 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
                          title="Ver informes"
                        >
                          <BarChart3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => navigate(`/tutor/communication?student=${student.id}`)}
                          className="p-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                          title="Comunicar"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No se encontraron estudiantes</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ? 'No hay resultados para tu búsqueda' : 'No tienes estudiantes asignados'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
