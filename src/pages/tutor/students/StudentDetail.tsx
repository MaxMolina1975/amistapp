import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/context/AuthContext';
import { useStudents, StudentWithStats } from '../../../lib/types/student';
import { 
  ArrowLeft, User, Mail, Phone, Calendar, MapPin, 
  School, BarChart3, Activity, Users 
} from 'lucide-react';

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { students, loading, error } = useStudents(undefined, currentUser?.id);
  const [student, setStudent] = useState<StudentWithStats | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'activities'>('profile');

  useEffect(() => {
    if (students.length > 0 && id) {
      const foundStudent = students.find(s => s.id.toString() === id);
      setStudent(foundStudent || null);
    }
  }, [students, id]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Cargando información del estudiante...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">Error al cargar estudiante: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">Estudiante no encontrado</h3>
        <p className="text-gray-500 mb-4">No se encontró información para el estudiante solicitado</p>
        <button 
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          onClick={() => navigate('/tutor/students')}
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/tutor/students')}
          className="mr-3 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Perfil de estudiante</h1>
          <p className="text-gray-600">Información detallada y seguimiento</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-violet-100 flex items-center justify-center">
              {student.profileImage ? (
                <img 
                  src={student.profileImage}
                  alt={`${student.name} ${student.lastName}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{student.name} {student.lastName}</h2>
              <p className="text-gray-600">{student.grade} {student.group} • {student.age} años</p>
              <div className="flex gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  student.stats.emotionalIndex >= 80 ? 'bg-green-100 text-green-700' :
                  student.stats.emotionalIndex >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {student.stats.emotionalIndex >= 80 ? 'Buen progreso' :
                   student.stats.emotionalIndex >= 60 ? 'Progreso regular' :
                   'Necesita atención'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100">
          <div className="flex">
            <button 
              className={`px-4 py-3 font-medium ${
                activeTab === 'profile' 
                  ? 'text-violet-600 border-b-2 border-violet-600' 
                  : 'text-gray-500 hover:text-violet-600'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Información personal
            </button>
            <button 
              className={`px-4 py-3 font-medium ${
                activeTab === 'stats' 
                  ? 'text-violet-600 border-b-2 border-violet-600' 
                  : 'text-gray-500 hover:text-violet-600'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              Estadísticas
            </button>
            <button 
              className={`px-4 py-3 font-medium ${
                activeTab === 'activities' 
                  ? 'text-violet-600 border-b-2 border-violet-600' 
                  : 'text-gray-500 hover:text-violet-600'
              }`}
              onClick={() => setActiveTab('activities')}
            >
              Actividades
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Información de contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Correo electrónico</p>
                      <p className="font-medium">{student.email || 'No registrado'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{student.phone || 'No registrado'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha de nacimiento</p>
                      <p className="font-medium">{student.birthDate || 'No registrada'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="font-medium">{student.address || 'No registrada'}</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-800">Información personal</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Nombre preferido</p>
                      <p className="font-medium">{student.preferredName || 'No especificado'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Activity className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Hobbies</p>
                      <p className="font-medium">
                        {student.hobbies && student.hobbies.length > 0 
                          ? student.hobbies.join(', ') 
                          : 'No especificados'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BarChart3 className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Intereses</p>
                      <p className="font-medium">
                        {student.interests && student.interests.length > 0 
                          ? student.interests.join(', ') 
                          : 'No especificados'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Información académica</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <School className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Grado y grupo</p>
                      <p className="font-medium">{student.grade} {student.group}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Tutor</p>
                      <p className="font-medium">{student.tutorName || 'No asignado'}</p>
                      <p className="text-sm text-gray-500">{student.tutorEmail || ''}</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-800">Observaciones</h3>
                <p className="text-gray-700">{student.observations || 'No hay observaciones registradas.'}</p>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center mr-2">
                      <Activity className="w-4 h-4 text-violet-600" />
                    </div>
                    <h4 className="font-medium">Índice Emocional</h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{student.stats.emotionalIndex}%</div>
                    <div className={`text-sm px-2 py-1 rounded-full ${
                      student.stats.trends.emotionalIndex > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {student.stats.trends.emotionalIndex > 0 ? '+' : ''}{student.stats.trends.emotionalIndex}%
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-medium">Participación</h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{student.stats.participationRate}%</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="font-medium">Asistencia</h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{student.stats.attendanceRate}%</div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4 text-gray-800">Habilidades socioemocionales</h3>
              <div className="space-y-4 mb-6">
                {Object.entries(student.stats.skills).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{key}</span>
                      <span className="text-sm text-gray-500">{value}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-violet-600 h-2.5 rounded-full" 
                        style={{width: `${value * 10}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              <p className="text-center text-gray-500 my-8">
                No hay actividades registradas para este estudiante
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
