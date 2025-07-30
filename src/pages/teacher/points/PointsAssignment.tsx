import { useState, useEffect } from 'react';
import { 
  Coins, 
  Search, 
  ChevronDown, 
  Filter, 
  Award,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../../lib/context/AuthContext';
import { StudentWithStats, useStudents } from '../../../lib/types/student';
import { studentApi } from '../../../lib/api/student';
import { teacherApi } from '../../../lib/api/teacher';
import { Alert } from '../../../components/ui/Alert';
import { checkServerHealth } from '../../../lib/api';

// Importamos el tipo SocialEmotionalAction para usar las acciones socioemocionales
import { SocialEmotionalAction } from '../../../components/teacher/SocialEmotionalActions';

// Tipos de actividades para asignar puntos (enfocado en educación socioemocional)
type PointActivity = {
  id: string;
  name: string;
  description: string;
  defaultPoints: number;
  category: 'academic' | 'social' | 'emotional' | 'behavioral';
  editable: boolean;
};

// Tipos para el registro de asignación de puntos
type PointAssignment = {
  id: string;
  studentId: string | number;
  activityId: string;
  points: number;
  comments?: string;
  assignedAt: string;
  assignedBy: string;
};

// Importamos las acciones socioemocionales desde nuestro componente
import { socialEmotionalActions } from '../../../components/teacher/SocialEmotionalActions';

// Convertimos las acciones socioemocionales al formato de actividades para mantener compatibilidad
// En una implementación real, estas actividades se obtendrían de una API
// Por ahora, usamos las acciones socioemocionales estáticas como base
const pointActivities: PointActivity[] = socialEmotionalActions.map(action => ({
  id: action.id,
  name: action.action,
  description: action.message || action.action,
  defaultPoints: action.points,
  category: action.competence === 'regulacion-emocional' ? 'emotional' : 
            action.competence === 'competencia-social' ? 'social' : 'emotional',
  editable: false
}));

// Historial vacío de asignaciones que se llenará desde la API
// En una implementación real, esto vendría de la API

// Categorías traducidas para mostrar en la UI
const categoryTranslations: Record<string, {name: string, color: string}> = {
  academic: {name: 'Académico', color: 'blue'},
  social: {name: 'Social', color: 'green'},
  emotional: {name: 'Regulación', color: 'purple'},
  behavioral: {name: 'Comportamiento', color: 'amber'}
};

// Colores para las categorías
const categoryColors = {
  academic: {color: 'blue'},
  social: {color: 'green'},
  emotional: {color: 'purple'},
  behavioral: {color: 'amber'}
};

export function PointsAssignment() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Usar hook para obtener estudiantes reales
  const { students: apiStudents, loading: studentsLoading, error: studentsError } = useStudents(currentUser?.id?.toString());
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  
  const [activities] = useState<PointActivity[]>(pointActivities);
  const [pointsHistory, setPointsHistory] = useState<PointAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverConnected, setServerConnected] = useState(true);
  
  // Puntos disponibles para el profesor (mensualmente)
  const [availablePoints, setAvailablePoints] = useState<number>(1000);
  
  // Fecha de expiración de los puntos (último día del mes actual)
  const currentDate = new Date();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysRemaining = Math.ceil((lastDayOfMonth.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithStats | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<PointActivity | null>(null);
  const [pointsToAssign, setPointsToAssign] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Comprobar conexión con el servidor al cargar y actualizar estudiantes cuando apiStudents cambie
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkServerHealth();
        setServerConnected(isConnected);
        if (!isConnected) {
          setError('No se pudo conectar con el servidor. Usando datos de ejemplo.');
        } else {
          // En una implementación real, aquí se cargarían los puntos disponibles del profesor desde el servidor
          // y el historial de asignaciones de puntos
          try {
            // Aquí se cargaría el historial de puntos desde la API
            // Por ahora, dejamos el array vacío ya que no existe una función específica para esto
            // En una implementación real, se usaría algo como:
            // const history = await teacherApi.getPointsHistory();
            // setPointsHistory(history);
          } catch (historyError) {
            console.error('Error al cargar historial de puntos:', historyError);
          }
        }
      } catch (err) {
        console.error('Error al verificar conexión:', err);
        setServerConnected(false);
        setError('Error al comprobar la conexión con el servidor. Usando datos de ejemplo.');
      }
    };
    
    checkConnection();
    
    // Por ahora, usamos un valor fijo para demostración de puntos disponibles
  }, []);
  
  // Actualizar el estado local de estudiantes cuando se cargan desde la API
  useEffect(() => {
    if (apiStudents && apiStudents.length > 0) {
      setStudents(apiStudents);
    }
  }, [apiStudents]);
  
  // Filtrar estudiantes según búsqueda
  const filteredStudents = students.filter(student => {
    const fullName = `${student.name} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  
  // Filtrar actividades según categoría seleccionada
  const filteredActivities = activities.filter(activity => 
    selectedCategory === 'all' || activity.category === selectedCategory
  );
  
  const handleAssignPoints = async () => {
    if (!selectedStudent || !selectedActivity) return;
    
    // Verificar si hay suficientes puntos disponibles
    if (pointsToAssign > availablePoints) {
      setError('No tienes suficientes puntos disponibles para asignar');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Crear nueva asignación de puntos
    const newAssignment: PointAssignment = {
      id: `pa-${Date.now()}`,
      studentId: selectedStudent.id,
      activityId: selectedActivity.id,
      points: pointsToAssign,
      comments: comments.trim() || undefined,
      assignedAt: new Date().toISOString(),
      assignedBy: currentUser?.name ? `${currentUser.name} ${currentUser.lastName || ''}` : 'Docente'
    };
    
    try {
      // Si estamos conectados al servidor, intentar actualizar los puntos mediante la API
      if (serverConnected && currentUser?.id) {
        try {
          // Usar teacherApi para asignar puntos
          await teacherApi.awardPoints({
            courseId: currentUser.courseId || 'default',  // Asumiendo que el usuario tiene un courseId
            userId: selectedStudent.id.toString(),
            amount: pointsToAssign,
            type: 'bonus',
            description: comments.trim() || selectedActivity.description
          });
          
          // También actualizar los puntos del estudiante
          const token = localStorage.getItem('token');
          if (token) {
            const response = await studentApi.updateStudentPoints(
              token,
              Number(selectedStudent.id),
              pointsToAssign
            );
            
            if (response.error) {
              throw new Error(response.error);
            }
          }
        } catch (apiError) {
          console.error('Error al actualizar puntos en la API:', apiError);
          throw new Error(apiError instanceof Error ? apiError.message : 'Error al actualizar puntos');
        }
      }
      
      // Actualizar el historial de puntos localmente
      setPointsHistory([newAssignment, ...pointsHistory]);
      
      // Actualizar los puntos del estudiante en el estado local
      setStudents(students.map(student => {
        if (student.id === selectedStudent.id) {
          return {
            ...student,
            stats: {
              ...student.stats,
              points: student.stats.points + pointsToAssign
            }
          };
        }
        return student;
      }));
      
      // Actualizar los puntos disponibles del profesor
      setAvailablePoints(prevPoints => prevPoints - pointsToAssign);
      
      // Mostrar mensaje de éxito
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowAssignModal(false);
        setSelectedStudent(null);
        setSelectedActivity(null);
        setPointsToAssign(0);
        setComments('');
      }, 2000);
    } catch (err) {
      console.error('Error al asignar puntos:', err);
      setError(err instanceof Error ? err.message : 'Error al asignar puntos');
    } finally {
      setLoading(false);
    }
  };
  
  const openAssignModal = (student: StudentWithStats) => {
    setSelectedStudent(student);
    setSelectedActivity(null);
    setPointsToAssign(0);
    setComments('');
    setError(null);
    setShowAssignModal(true);
  };
  
  const handleActivitySelect = (activity: PointActivity) => {
    setSelectedActivity(activity);
    setPointsToAssign(activity.defaultPoints);
  };
  
  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Asignación de Puntos</h1>
        <p className="text-gray-600">Asigna puntos a los estudiantes por comportamientos y logros positivos</p>
      </header>
      
      {/* Mensaje de error de conexión */}
      {!serverConnected && (
        <Alert variant="warning" className="mb-4">
          No se pudo establecer conexión con el servidor. Los cambios realizados no se guardarán en la base de datos.
        </Alert>
      )}
      
      {/* Mensaje de error al cargar estudiantes */}
      {studentsError && (
        <Alert variant="error" className="mb-4">
          Error al cargar estudiantes: {studentsError}
        </Alert>
      )}
      
      {/* Indicador de carga de estudiantes */}
      {studentsLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
          <span className="ml-2 text-gray-600">Cargando estudiantes...</span>
        </div>
      )}
      
      {/* Barra de búsqueda */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar estudiante..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Lista de estudiantes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Estudiantes</h2>
        
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map(student => (
              <div key={student.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                        {student.profileImage ? (
                          <img 
                            src={student.profileImage} 
                            alt={`${student.name} ${student.lastName}`}
                            className="w-12 h-12 rounded-full object-cover" 
                          />
                        ) : (
                          <span className="text-violet-800 font-medium">
                            {student.name[0]}{student.lastName[0]}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-800">{student.name} {student.lastName}</h3>
                        <p className="text-sm text-gray-500">{student.grade} {student.group}</p>
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-violet-600">{student.stats.points} pts</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openAssignModal(student)}
                      className="w-full py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors flex items-center justify-center"
                    >
                      <Coins className="w-5 h-5 mr-2" />
                      Asignar puntos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron estudiantes</h3>
            <p className="text-gray-600 mb-4">
              No hay estudiantes que coincidan con tu búsqueda.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Ver todos los estudiantes
            </button>
          </div>
        )}
      </div>
      
      {/* Historial reciente de puntos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial reciente</h2>
        
        {pointsHistory.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actividad
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puntos
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asignado por
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pointsHistory.map((assignment) => {
                    const student = students.find(s => s.id.toString() === assignment.studentId.toString());
                    const activity = activities.find(a => a.id === assignment.activityId);
                    
                    if (!student || !activity) return null;
                    
                    return (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                              {student.profileImage ? (
                                <img 
                                  className="h-8 w-8 rounded-full" 
                                  src={student.profileImage} 
                                  alt={`${student.name} ${student.lastName}`} 
                                />
                              ) : (
                                <span className="text-violet-800 font-medium text-xs">
                                  {student.name[0]}{student.lastName[0]}
                                </span>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name} {student.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {student.grade} {student.group}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{activity.name}</div>
                          <div className="text-xs text-gray-500">{categoryTranslations[activity.category].name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-violet-600">+{assignment.points} pts</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(assignment.assignedAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{assignment.assignedBy}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay historial de puntos</h3>
            <p className="text-gray-600">
              Aún no se han asignado puntos a ningún estudiante.
            </p>
          </div>
        )}
      </div>
      
      {/* Modal para asignar puntos */}
      {showAssignModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {showSuccessMessage ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Puntos asignados correctamente!</h3>
                <p className="text-gray-600">
                  Se han asignado {pointsToAssign} puntos a {selectedStudent.name} {selectedStudent.lastName}.
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Asignar puntos
                    </h2>
                    <p className="text-gray-600">
                      Estudiante: {selectedStudent.name} {selectedStudent.lastName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {error && (
                  <Alert variant="error" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona la actividad o comportamiento
                  </label>
                  
                  <div className="mb-2">
                    <div className="relative">
                      <select
                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="all">Todas las categorías</option>
                        <option value="academic">Académico</option>
                        <option value="social">Social</option>
                        <option value="emotional">Regulación</option>
                        <option value="behavioral">Comportamiento</option>
                      </select>
                      <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    {filteredActivities.map(activity => (
                      <button
                        key={activity.id}
                        className={`text-left p-3 border rounded-lg transition-colors ${
                          selectedActivity?.id === activity.id
                            ? `bg-${categoryColors[activity.category].color}-100 border-${categoryColors[activity.category].color}-300`
                            : 'border-gray-200 hover:border-violet-200'
                        }`}
                        onClick={() => handleActivitySelect(activity)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">{activity.name}</h4>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full bg-${categoryColors[activity.category].color}-100 text-${categoryColors[activity.category].color}-700`}>
                              {categoryTranslations[activity.category].name}
                            </span>
                            <span className="ml-2 text-violet-600 font-medium">{activity.defaultPoints} pts</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {selectedActivity && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
                        Puntos a asignar
                      </label>
                      <input
                        type="number"
                        id="points"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        value={pointsToAssign}
                        onChange={(e) => setPointsToAssign(parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                        Comentarios (opcional)
                      </label>
                      <textarea
                        id="comments"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Añade detalles sobre por qué estás asignando estos puntos..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => setShowAssignModal(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        className={`px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        onClick={handleAssignPoints}
                        disabled={pointsToAssign <= 0 || loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <Award className="h-5 w-5 mr-2" />
                            Asignar {pointsToAssign} puntos
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
