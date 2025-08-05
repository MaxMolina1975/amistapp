import { useState, useEffect } from 'react';
import { 
  Coins, 
  Search, 
  ChevronDown, 
  Filter, 
  Award,
  Check,
  X,
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../../../lib/context/AuthContext';
import { StudentWithStats } from '../../../lib/types/student';
import { studentApi } from '../../../lib/api/student';
import { Alert } from '../../../components/ui/Alert';
import { checkServerHealth } from '../../../lib/api';
import { useStudents } from '../../../lib/types/student';

// Importamos el tipo SocialEmotionalAction para usar las acciones socioemocionales
import { SocialEmotionalAction, socialEmotionalActions } from '../../../components/teacher/SocialEmotionalActions';

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

// Convertir acciones socioemocionales a actividades de puntos
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

export function StudentPointsAssignment() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Usar el hook useStudents para obtener los estudiantes reales
  const { students: apiStudents, loading: studentsLoading, error: studentsError } = useStudents();
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  
  const [activities] = useState<PointActivity[]>(pointActivities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverConnected, setServerConnected] = useState(true);
  
  // Puntos disponibles para el estudiante (sus puntos acumulados)
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  
  // Historial de asignaciones de puntos
  const [pointsHistory, setPointsHistory] = useState<PointAssignment[]>([]);
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithStats | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<PointActivity | null>(null);
  const [pointsToAssign, setPointsToAssign] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Actualizar el estado de students cuando apiStudents cambie
  useEffect(() => {
    if (apiStudents && apiStudents.length > 0) {
      setStudents(apiStudents);
    }
  }, [apiStudents]);
  
  // Comprobar conexión con el servidor al cargar y obtener puntos del estudiante
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkServerHealth();
        setServerConnected(isConnected);
        if (!isConnected) {
          setError('No se pudo conectar con el servidor. Usando datos de ejemplo.');
        }
      } catch (err) {
        console.error('Error al verificar conexión:', err);
        setServerConnected(false);
        setError('Error al comprobar la conexión con el servidor. Usando datos de ejemplo.');
      }
    };
    
    checkConnection();
    
    // En una implementación real, aquí se cargarían los puntos disponibles del estudiante desde el servidor
    // Por ahora, usamos un valor de ejemplo para demostración
    if (currentUser && currentUser.stats && currentUser.stats.points) {
      setAvailablePoints(currentUser.stats.points);
    } else {
      // Valor de ejemplo para demostración
      setAvailablePoints(150);
    }
  }, [currentUser]);
  
  // Filtrar estudiantes según búsqueda y excluir al estudiante actual
  const filteredStudents = students.filter(student => {
    const fullName = `${student.name} ${student.lastName}`.toLowerCase();
    // Excluir al estudiante actual de la lista
    return fullName.includes(searchTerm.toLowerCase()) && 
           (!currentUser || student.id !== currentUser.id);
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
      assignedBy: currentUser?.name ? `${currentUser.name} ${currentUser.lastName || ''}` : 'Estudiante'
    };
    
    try {
      // Si estamos conectados al servidor, intentar actualizar los puntos mediante la API
      if (serverConnected) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }
        
        // Aquí se debería llamar a una API para asignar puntos de un estudiante a otro
        // Por ahora, simulamos la operación
        
        // Actualizar los puntos del estudiante seleccionado (incremento)
        try {
          await studentApi.updateStudentPoints(
            Number(selectedStudent.id),
            pointsToAssign
          );
          
          // Actualizar los puntos del estudiante actual (decremento)
          await studentApi.updateStudentPoints(
            Number(currentUser?.id),
            -pointsToAssign
          );
        } catch (apiError) {
          console.error('Error en la API al actualizar puntos:', apiError);
          throw new Error('Error al actualizar los puntos en el servidor');
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
      
      // Actualizar los puntos disponibles del estudiante actual
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
        <h1 className="text-2xl font-bold text-gray-800">Asignar Puntos a Compañeros</h1>
        <p className="text-gray-600">Reconoce las acciones positivas de tus compañeros asignándoles puntos</p>
      </header>
      
      {/* Mensaje de error de conexión */}
      {!serverConnected && (
        <Alert variant="warning" className="mb-4">
          No se pudo establecer conexión con el servidor. Los cambios realizados no se guardarán en la base de datos.
        </Alert>
      )}
      
      {/* Tarjeta de puntos disponibles */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 mb-6 text-white flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">Mis Puntos Disponibles</p>
          <p className="text-2xl font-bold">{availablePoints}</p>
        </div>
        <Coins className="w-8 h-8 opacity-70" />
      </div>
      
      {/* Información sobre el sistema de puntos */}
      <div className="bg-blue-50 p-4 rounded-xl mb-6 flex items-start">
        <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">¿Cómo funciona?</p>
          <p>Puedes asignar puntos a tus compañeros por sus acciones positivas. Los puntos que asignes se descontarán de tu balance actual.</p>
        </div>
      </div>
      
      {/* Estado de carga y error para estudiantes */}
      {studentsLoading && (
        <div className="flex items-center justify-center p-8 bg-white rounded-xl shadow-sm mb-6">
          <Loader2 className="w-6 h-6 text-purple-600 animate-spin mr-2" />
          <p className="text-gray-600">Cargando estudiantes...</p>
        </div>
      )}
      
      {studentsError && (
        <Alert variant="error" className="mb-6">
          Error al cargar estudiantes: {studentsError}
        </Alert>
      )}
      
      {/* Barra de búsqueda */}
      {!studentsLoading && !studentsError && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar compañero..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
      
      {/* Lista de estudiantes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Compañeros de Clase</h2>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select 
              className="text-sm border-none bg-transparent text-gray-500 focus:outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {Object.entries(categoryTranslations).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-500">No se encontraron compañeros con ese nombre</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map(student => (
              <div key={student.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        {student.profileImage ? (
                          <img 
                            src={student.profileImage} 
                            alt={`${student.name} ${student.lastName}`}
                            className="w-12 h-12 rounded-full object-cover" 
                          />
                        ) : (
                          <span className="text-purple-800 font-medium">
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
                      <div className="text-lg font-bold text-purple-600">{student.stats.points} pts</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openAssignModal(student)}
                      className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center"
                      disabled={availablePoints <= 0}
                    >
                      <Coins className="w-5 h-5 mr-2" />
                      Asignar puntos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Historial reciente de puntos asignados */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Mis asignaciones recientes</h2>
        
        {pointsHistory.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compañero
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acción
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puntos
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pointsHistory.map(assignment => {
                    const student = students.find(s => s.id === assignment.studentId);
                    const activity = activities.find(a => a.id === assignment.activityId);
                    
                    return (
                      <tr key={assignment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                              {student?.profileImage ? (
                                <img src={student.profileImage} alt={student.name} className="h-8 w-8 rounded-full" />
                              ) : (
                                <span className="text-xs font-medium text-purple-800">
                                  {student?.name[0]}{student?.lastName[0]}
                                </span>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {student?.name} {student?.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{activity?.name}</div>
                          {assignment.comments && (
                            <div className="text-xs text-gray-500">{assignment.comments}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            +{assignment.points}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(assignment.assignedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No has asignado puntos aún</h3>
            <p className="text-gray-600 mb-4">
              Cuando asignes puntos a tus compañeros, aparecerán aquí.
            </p>
          </div>
        )}
      </div>
      
      {/* Modal para asignar puntos */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Asignar Puntos a {selectedStudent?.name} {selectedStudent?.lastName}
              </h2>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Puntos disponibles */}
            <div className="bg-purple-50 p-3 rounded-lg mb-4 flex items-center justify-between">
              <span className="text-purple-700 font-medium">Puntos disponibles:</span>
              <span className="font-bold text-purple-700">{availablePoints}</span>
            </div>
            
            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center space-x-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            
            {/* Selección de actividad */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona una acción</label>
              <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                {filteredActivities.map(activity => (
                  <div 
                    key={activity.id}
                    onClick={() => handleActivitySelect(activity)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedActivity?.id === activity.id ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-gray-800">{activity.name}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full bg-${categoryColors[activity.category].color}-100 text-${categoryColors[activity.category].color}-700`}>
                        {categoryTranslations[activity.category].name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <div className="mt-2 text-right">
                      <span className="font-bold text-purple-600">{activity.defaultPoints} puntos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Ajuste de puntos */}
            {selectedActivity && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Puntos a asignar</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max={availablePoints}
                    value={pointsToAssign}
                    onChange={(e) => setPointsToAssign(Math.min(Number(e.target.value), availablePoints))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="ml-2 text-sm text-gray-500">de {availablePoints} disponibles</span>
                </div>
              </div>
            )}
            
            {/* Comentarios */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios (opcional)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Añade un comentario personal..."
              />
            </div>
            
            {/* Botones de acción */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignPoints}
                disabled={!selectedActivity || pointsToAssign <= 0 || pointsToAssign > availablePoints || loading}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${!selectedActivity || pointsToAssign <= 0 || pointsToAssign > availablePoints ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Award size={18} />
                    <span>Asignar Puntos</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Mensaje de éxito */}
            {showSuccessMessage && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">¡Puntos Asignados!</h3>
                  <p className="text-gray-600">Has asignado {pointsToAssign} puntos a {selectedStudent?.name} {selectedStudent?.lastName}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}