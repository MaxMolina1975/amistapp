import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';
import { StudentWithStats } from '../../lib/types/student';
import { StudentStatsCard } from '../../components/teacher/StudentStatsCard';
import { 
  Users, 
  Activity, 
  Calendar, 
  ChevronDown, 
  BarChart3, 
  Book, 
  MessageSquare, 
  Bell
} from 'lucide-react';
import ChatNotification from '../../components/chat/ChatNotification';
import RecentContacts from '../../components/chat/RecentContacts';
import TutorChat from "../../components/chat/TutorChat";
import { PromotionCarousel } from '../../components/carousel';
import '../../components/carousel/styles/carousel.css';
import { useStudents } from '../../lib/types/student';

export function TutorDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<StudentWithStats | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  
  // Obtener estudiantes reales del tutor
  const { students: myStudents, loading, error } = useStudents(undefined, currentUser?.id?.toString());
  
  const openStudentStats = (student: StudentWithStats) => {
    setSelectedStudent(student);
    setShowStatsModal(true);
  };
  
  const closeStatsModal = () => {
    setShowStatsModal(false);
    setSelectedStudent(null);
  };
  
  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido, {currentUser?.name || 'Tutor'}
        </h1>
        <p className="text-gray-600">Panel de control para acompañar el desarrollo socioemocional</p>
      </header>

      {/* Promotion Carousel */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Novedades y Características</h2>
        <PromotionCarousel />
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Resumen</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                <p className="text-lg font-bold text-gray-800">{myStudents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Actividades</p>
                <p className="text-lg font-bold text-gray-800">5</p>
              </div>
            </div>
          </div>
          
          {/* Nuevo botón para mensajes directos */}
          <div 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/mensajes')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 relative">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <ChatNotification variant="badge" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Mensajes</p>
                <p className="text-lg font-bold text-gray-800">Chat privado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Estudiantes a cargo</h2>
        
        {myStudents.length > 0 ? (
          <div className="space-y-4">
            {myStudents.map(student => (
              <div 
                key={student.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {student.profileImage ? (
                          <img 
                            src={student.profileImage}
                            alt={`${student.name} ${student.lastName}`}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <span className="text-blue-600 font-medium">
                            {student.name[0]}{student.lastName[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.name} {student.lastName}</p>
                        <p className="text-sm text-gray-500">Grado: {student.grade}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`mr-3 px-2 py-1 rounded-full text-xs ${
                        student.stats.emotionalIndex >= 80 ? 'bg-green-100 text-green-700' :
                        student.stats.emotionalIndex >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {student.stats.emotionalIndex >= 80 ? 'Buen progreso' :
                         student.stats.emotionalIndex >= 60 ? 'Progreso regular' :
                         'Necesita atención'}
                      </div>
                      
                      <button
                        onClick={() => openStudentStats(student)}
                        className="text-violet-600 hover:text-violet-800"
                      >
                        <BarChart3 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Resumen de esta semana</h3>
                    <button
                      onClick={() => openStudentStats(student)}
                      className="text-sm text-violet-600 hover:text-violet-800 flex items-center"
                    >
                      Ver más
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white p-2 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Índice Emocional</p>
                      <p className="text-sm font-bold text-gray-800">{student.stats.emotionalIndex}%</p>
                    </div>
                    
                    <div className="bg-white p-2 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Participación</p>
                      <p className="text-sm font-bold text-gray-800">{student.stats.participationRate}%</p>
                    </div>
                    
                    <div className="bg-white p-2 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Asistencia</p>
                      <p className="text-sm font-bold text-gray-800">{student.stats.attendanceRate}%</p>
                    </div>
                    
                    <div className="bg-white p-2 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Puntos</p>
                      <p className="text-sm font-bold text-gray-800">{student.stats.points}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No hay estudiantes asignados</h3>
            <p className="text-gray-500 mb-4">Aún no tienes ningún estudiante bajo tu tutoría</p>
            <button 
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
              onClick={() => navigate('/tutor/vincular')}
            >
              Vincular estudiante
            </button>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Próximas actividades</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Taller de comunicación familiar</p>
                <p className="text-sm text-gray-500">Mañana, 16:00</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Reunión de seguimiento</p>
                <p className="text-sm text-gray-500">Viernes, 15:30</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Recursos para tutores</h2>
        <div className="grid grid-cols-1 gap-4">
          <div 
            onClick={() => navigate('/tutor/recursos/guia-tutores')} 
            className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Book className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Guía para el acompañamiento socioemocional</h3>
                <p className="text-sm text-gray-600 mt-1">Consejos para apoyar el desarrollo de habilidades sociales y emocionales</p>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/tutor/recursos/estrategias-comunicacion')} 
            className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Book className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Comunicación efectiva en el hogar</h3>
                <p className="text-sm text-gray-600 mt-1">Herramientas para mejorar la comunicación con los niños y adolescentes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de mensajes recientes */}
      <div className="mt-8">
        <RecentContacts title="Estudiantes a cargo" filter="student" />
      </div>

      {/* Panel principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Columna izquierda y central */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notificaciones */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-indigo-500" />
              Notificaciones
            </h2>
            <ChatNotification limit={3} />
          </div>
          
          {/* Chat con estudiantes */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
              Mensajes recientes
            </h2>
            <TutorChat compact={true} onlyShowList={true} />
          </div>
        </div>
        
        {/* Columna derecha - Comunicación y notificaciones */}
        <div className="space-y-6">
          {/* Chat completo */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
              Comunicación con estudiantes y docentes
            </h2>
            <TutorChat compact={true} onlyShowList={false} />
          </div>
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
              
              <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
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
    </div>
  );
}

export default TutorDashboard;
