import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/context/AuthContext';
import { StudentWithStats } from '../../../lib/types/student';
import { 
  Calendar, 
  BarChart2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Award,
  BookOpen,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Tipos para el historial emocional y actividades
interface EmotionalRecord {
  date: string;
  emotion: string;
  notes: string;
  score: number;
}

interface Activity {
  id: number;
  type: 'assignment' | 'emotional' | 'reward' | 'other';
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export function PerfilEstudiante() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser: _ } = useAuth(); 
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<StudentWithStats | null>(null);
  const [emotionalHistory, setEmotionalHistory] = useState<EmotionalRecord[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  
  // Obtener datos del estudiante
  useEffect(() => {
    if (!id) return;
    
    const fetchStudentData = async () => {
      setIsLoading(true);
      
      try {
        // Obtener datos del estudiante desde la API
        const response = await fetch(`/api/students/${id}`);
        
        if (!response.ok) {
          throw new Error('No se pudo obtener la información del estudiante');
        }
        
        const studentData = await response.json();
        setStudent(studentData);
        
        // Obtener historial emocional
        const emotionalResponse = await fetch(`/api/students/${id}/emotions`);
        if (emotionalResponse.ok) {
          const emotionalData = await emotionalResponse.json();
          setEmotionalHistory(emotionalData);
        }
        
        // Obtener actividades recientes
        const activitiesResponse = await fetch(`/api/students/${id}/activities`);
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData);
        }
      } catch (error) {
        console.error('Error al cargar los datos del estudiante:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentData();
  }, [id]);

  const getEmotionColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-blue-100 text-blue-700';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'feliz': return '😊';
      case 'ansioso': return '😰';
      case 'triste': return '😔';
      case 'motivado': return '🤩';
      case 'calmado': return '😌';
      default: return '😐';
    }
  };

  const handleBack = () => {
    navigate('/tutor/estudiantes');
  };

  const handleContact = () => {
    // En una implementación real, podría abrir un modal o navegar a una página de mensajes
    setShowContactInfo(!showContactInfo);
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Cargando información del estudiante...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no se encuentra el estudiante
  if (!student) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">Estudiante no encontrado</h3>
          <p className="text-gray-500 mb-4">No se pudo encontrar información para el estudiante solicitado</p>
          <button 
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            onClick={handleBack}
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Encabezado con botón de regreso */}
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBack}
          className="mr-3 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Perfil de Estudiante</h1>
          <p className="text-gray-600">Detalles y seguimiento</p>
        </div>
      </div>

      {/* Tarjeta de perfil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 flex flex-col md:flex-row items-center md:items-start">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
            {student.profileImage ? (
              <img 
                src={student.profileImage}
                alt={`${student.name} ${student.lastName}`}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <span className="text-3xl text-blue-600 font-medium">
                {student.name[0]}{student.lastName[0]}
              </span>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {student.name} {student.lastName}
            </h2>
            <p className="text-gray-600 mb-3">Grado: {student.grade}</p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              <div className={`px-3 py-1 rounded-full text-sm ${
                student.stats.emotionalIndex >= 80 ? 'bg-green-100 text-green-700' :
                student.stats.emotionalIndex >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {student.stats.emotionalIndex >= 80 ? 'Buen progreso' :
                student.stats.emotionalIndex >= 60 ? 'Progreso regular' :
                'Necesita atención'}
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {student.stats.points} puntos
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Asistencia: {student.stats.attendanceRate}%
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 mt-4">
              <button 
                onClick={handleContact}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                <span>Contactar</span>
              </button>
              
              <button 
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                <span>Programar reunión</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Información de contacto expandible */}
        {showContactInfo && (
          <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-100">
            <h3 className="font-medium text-gray-800 mb-3">Información de contacto</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Correo electrónico</p>
                  <p className="text-gray-600">estudiante.{student.id}@amistaap.edu</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Teléfono</p>
                  <p className="text-gray-600">+{Math.floor(Math.random() * 900000000) + 100000000}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Dirección</p>
                  <p className="text-gray-600">Av. Educación 123, Ciudad Escolar</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indicadores principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <BarChart2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Índice Emocional</p>
              <p className="text-xl font-bold text-gray-800">{student.stats.emotionalIndex}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                student.stats.emotionalIndex >= 80 ? 'bg-green-500' :
                student.stats.emotionalIndex >= 60 ? 'bg-blue-500' :
                student.stats.emotionalIndex >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${student.stats.emotionalIndex}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Basado en registro de emociones y participación
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Puntos Acumulados</p>
              <p className="text-xl font-bold text-gray-800">{student.stats.points}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${Math.min((student.stats.points / 500) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {student.stats.points} de 500 puntos para próximo nivel
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Participación</p>
              <p className="text-xl font-bold text-gray-800">{student.stats.participationRate}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-500 h-2.5 rounded-full" 
              style={{ width: `${student.stats.participationRate}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Basado en participación en actividades y ejercicios
          </p>
        </div>
      </div>

      {/* Historial emocional */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-amber-600">😊</span>
            </div>
            <h3 className="font-medium text-gray-800">Historial Emocional Reciente</h3>
          </div>
          <button
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="text-violet-600 hover:text-violet-800 flex items-center text-sm"
          >
            <span>{showAllHistory ? 'Ver menos' : 'Ver todo'}</span>
            {showAllHistory ? 
              <ChevronUp className="h-4 w-4 ml-1" /> : 
              <ChevronDown className="h-4 w-4 ml-1" />
            }
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {(showAllHistory ? emotionalHistory : emotionalHistory.slice(0, 3)).map((entry, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">{getEmotionIcon(entry.emotion)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-800">{entry.emotion}</h4>
                    <div className={`px-2 py-0.5 rounded-full text-xs ${getEmotionColor(entry.score)}`}>
                      {entry.score}/100
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{entry.notes}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(entry.date).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actividades recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800">Actividades Recientes</h3>
          </div>
          <button
            onClick={() => setShowAllActivities(!showAllActivities)}
            className="text-violet-600 hover:text-violet-800 flex items-center text-sm"
          >
            <span>{showAllActivities ? 'Ver menos' : 'Ver todo'}</span>
            {showAllActivities ? 
              <ChevronUp className="h-4 w-4 ml-1" /> : 
              <ChevronDown className="h-4 w-4 ml-1" />
            }
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {(showAllActivities ? recentActivities : recentActivities.slice(0, 3)).map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  activity.type === 'assignment' ? 'bg-green-100' :
                  activity.type === 'emotional' ? 'bg-amber-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'assignment' && <BookOpen className="w-5 h-5 text-green-600" />}
                  {activity.type === 'emotional' && <span className="text-amber-600">😊</span>}
                  {activity.type === 'reward' && <Award className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                    <h4 className="font-medium text-gray-800">{activity.title}</h4>
                    <div className={`px-2 py-0.5 rounded-full text-xs ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    } md:ml-2 mt-1 md:mt-0 inline-block md:inline`}>
                      {activity.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {new Date(activity.date).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observaciones y notas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Observaciones del Tutor</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Añadir nueva nota
          </label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 h-24"
            placeholder="Escribe tus observaciones sobre el estudiante..."
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors">
            Guardar observación
          </button>
        </div>
      </div>
    </div>
  );
}

export default PerfilEstudiante;
