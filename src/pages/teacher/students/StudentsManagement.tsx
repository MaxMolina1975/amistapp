import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  BarChart, 
  ArrowUpDown, 
  ChevronDown,
  Filter,
  Mail,
  Download,
  AlertTriangle,
  CheckCircle,
  BellRing,
  X
} from 'lucide-react';
import { StudentWithStats, useStudents } from '../../../lib/types/student';
import { StudentStatsCard } from '../../../components/students/StudentStatsCard';
import { SendNotificationModal } from '../../../components/students/SendNotificationModal';
import { useAuth } from '../../../lib/context/AuthContext';

export function StudentsManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { students, loading, error } = useStudents(currentUser?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithStats | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<(string | number)[]>([]);

  // Verificar si hay mensajes de éxito desde otras páginas (por ej. al crear o editar un estudiante)
  useEffect(() => {
    if (location.state?.successMessage) {
      setNotification({
        type: 'success',
        message: location.state.successMessage
      });
      
      // Limpiar el mensaje después de 5 segundos
      const timer = setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Filtrar estudiantes por término de búsqueda y grado
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.name} ${student.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                        student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    
    return matchesSearch && matchesGrade;
  });
  
  // Ordenar estudiantes según el criterio seleccionado
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'name':
        valueA = `${a.name} ${a.lastName}`.toLowerCase();
        valueB = `${b.name} ${b.lastName}`.toLowerCase();
        break;
      case 'grade':
        valueA = a.grade;
        valueB = b.grade;
        break;
      case 'emotionalIndex':
        valueA = a.stats.emotionalIndex;
        valueB = b.stats.emotionalIndex;
        break;
      case 'points':
        valueA = a.stats.points;
        valueB = b.stats.points;
        break;
      default:
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
  
  // Manejar cambio en el ordenamiento
  const handleSort = (criteria: string) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };
  
  // Manejar contacto con el tutor
  const handleContactTutor = (email: string) => {
    // Aquí se implementaría la funcionalidad para enviar un correo o mensaje al tutor
    // Por ahora, simplemente abrimos el cliente de correo predeterminado
    window.location.href = `mailto:${email}?subject=Información sobre estudiante&body=Estimado/a tutor/a,%0D%0A%0D%0AMe comunico para informarle sobre el progreso de su estudiante.%0D%0A%0D%0ASaludos cordiales,%0D%0ADocente`;
  };
  
  // Abrir modal con estadísticas detalladas
  const openStudentStats = (student: StudentWithStats) => {
    setSelectedStudent(student);
    setShowStatsModal(true);
  };
  
  // Cerrar modal de estadísticas
  const closeStatsModal = () => {
    setShowStatsModal(false);
    setSelectedStudent(null);
  };

  // Exportar datos de estudiantes en formato CSV
  const exportStudentsData = () => {
    try {
      // Crear cabeceras del CSV
      const headers = [
        'ID',
        'Nombre',
        'Apellido',
        'Email',
        'Grado',
        'Grupo',
        'Edad',
        'Índice Emocional',
        'Puntos',
        'Logros',
        'Rendimiento Académico',
        'Participación Social',
        'Asistencia',
        'Nombre del Tutor',
        'Email del Tutor'
      ].join(',');
      
      // Crear filas de datos
      const rows = sortedStudents.map(student => [
        student.id,
        `"${student.name}"`,
        `"${student.lastName}"`,
        `"${student.email || ''}"`,
        `"${student.grade}"`,
        `"${student.group}"`,
        student.age,
        student.stats.emotionalIndex,
        student.stats.points,
        student.stats.achievementsCount,
        student.stats.academicPerformance,
        student.stats.socialParticipation,
        student.stats.attendance,
        `"${student.tutorName || ''}"`,
        `"${student.tutorEmail || ''}"`
      ].join(','));
      
      // Unir cabeceras y filas
      const csvContent = [headers, ...rows].join('\n');
      
      // Crear un objeto Blob con el contenido CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Crear un objeto URL para el blob
      const url = URL.createObjectURL(blob);
      
      // Crear un elemento <a> para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `estudiantes_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Descargar el archivo
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Mostrar notificación de éxito
      setNotification({
        type: 'success',
        message: 'Datos exportados correctamente'
      });
      
      // Limpiar la notificación después de 5 segundos
      setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 5000);
    } catch (error) {
      // Mostrar notificación de error
      setNotification({
        type: 'error',
        message: 'Error al exportar datos. Inténtalo de nuevo.'
      });
      
      console.error('Error al exportar datos:', error);
    }
  };

  const grades = ['1ro', '2do', '3ro', '4to', '5to', '6to'];

  // Cerrar notificación
  const closeNotification = () => {
    setNotification({ type: null, message: '' });
  };

  // Abrir modal de notificaciones para un estudiante específico
  const openNotificationForStudent = (studentId: string | number) => {
    setSelectedStudentIds([studentId]);
    setShowNotificationModal(true);
  };

  // Abrir modal de notificaciones para todos los estudiantes filtrados
  const openNotificationForAllStudents = () => {
    setSelectedStudentIds(sortedStudents.map(student => student.id));
    setShowNotificationModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar estudiantes: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Estudiantes</h1>
        <p className="text-gray-600">Administra y visualiza la información de los estudiantes</p>
      </header>
      
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          {/* Búsqueda */}
          <div className="relative w-full lg:w-1/3">
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          {/* Filtros */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Filtrar por:</span>
            </div>
            
            <div className="relative">
              <select 
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="all">Todos los grados</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Acciones - Separadas en su propia fila para mejor visualización */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              Mostrando {sortedStudents.length} estudiante(s) 
              {selectedGrade !== 'all' && <span> en {selectedGrade}</span>}
              {searchTerm && <span> que coinciden con "{searchTerm}"</span>}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              className="flex items-center justify-center h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-sm"
              onClick={exportStudentsData}
            >
              <Download className="h-5 w-5 mr-2" />
              <span>Exportar</span>
            </button>
            
            <button 
              className="flex items-center justify-center h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-sm"
              onClick={openNotificationForAllStudents}
            >
              <BellRing className="h-5 w-5 mr-2" />
              <span>Notificar</span>
            </button>
            
            <button 
              className="flex items-center justify-center h-10 px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-md transition-colors duration-200 font-medium"
              onClick={() => navigate('/teacher/students/add')}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              <span>Añadir Estudiante</span>
            </button>
          </div>
        </div>
        
        {/* Tabla de estudiantes */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('name')}
                  >
                    Estudiante
                    {sortBy === 'name' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('grade')}
                  >
                    Grado
                    {sortBy === 'grade' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('emotionalIndex')}
                  >
                    Índice Emocional
                    {sortBy === 'emotionalIndex' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('points')}
                  >
                    Puntos
                    {sortBy === 'points' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutor
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                        {student.profileImage ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={student.profileImage} 
                            alt={`${student.name} ${student.lastName}`} 
                          />
                        ) : (
                          <span className="text-violet-800 font-medium">
                            {student.name[0]}{student.lastName[0]}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.grade} {student.group}</div>
                    <div className="text-sm text-gray-500">{student.age} años</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            student.stats.emotionalIndex >= 80 ? 'bg-green-500' :
                            student.stats.emotionalIndex >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${student.stats.emotionalIndex}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{student.stats.emotionalIndex}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.stats.points}</div>
                    <div className="text-xs text-gray-500">{student.stats.achievementsCount} logros</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.tutorName ? (
                      <div>
                        <div className="text-sm text-gray-900">{student.tutorName}</div>
                        <button 
                          className="flex items-center text-xs text-violet-600 hover:text-violet-800"
                          onClick={() => student.tutorEmail && handleContactTutor(student.tutorEmail)}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Contactar
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No asignado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => openStudentStats(student)}
                        className="text-violet-600 hover:text-violet-800"
                        title="Ver estadísticas"
                      >
                        <BarChart className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => openNotificationForStudent(student.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Enviar notificación"
                      >
                        <BellRing className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => navigate(`/teacher/students/edit/${student.id}`)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Editar estudiante"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal de estadísticas */}
      {showStatsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedStudent.name} {selectedStudent.lastName}
                  </h2>
                  <p className="text-gray-600">
                    {selectedStudent.grade} {selectedStudent.group} • {selectedStudent.age} años
                  </p>
                </div>
                <button
                  onClick={closeStatsModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <StudentStatsCard student={selectedStudent} showDetailedView={true} />
              
              <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => selectedStudent.tutorEmail && handleContactTutor(selectedStudent.tutorEmail)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                  disabled={!selectedStudent.tutorEmail}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contactar tutor
                </button>
                
                <button
                  onClick={closeStatsModal}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notificación */}
      {notification.type && (
        <div className="fixed bottom-4 right-4 max-w-md z-50">
          <div className={`rounded-lg shadow-lg p-4 ${
            notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              )}
              <span className={`mx-3 text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>{notification.message}</span>
              <button 
                onClick={closeNotification}
                className="ml-auto bg-transparent text-gray-400 hover:text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de envío de notificaciones */}
      {showNotificationModal && (
        <SendNotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          students={students}
          preselectedStudentIds={selectedStudentIds}
        />
      )}
    </div>
  );
}
