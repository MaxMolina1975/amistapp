import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Users, 
  Gift, 
  AlertTriangle, 
  Crown, 
  Coins, 
  BookOpen,
  BarChart,
  UserPlus,
  Settings,
  School,
  CalendarDays,
  BookmarkCheck,
  Award,
  MessageSquare
} from 'lucide-react';
import { useAuth } from "../../lib/context/AuthContext";
import TeacherStudentChat from "../../components/chat/TeacherStudentChat";
import ChatNotification from "../../components/chat/ChatNotification";
import RecentContacts from "../../components/chat/RecentContacts";

interface CursoResumen {
  id: string;
  nombre: string;
  grado: string;
  cantidadEstudiantes: number;
  nivel: string;
  seccion: string;
}

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  avatar?: string;
  progreso: number;
  ultimaActividad: string;
  alertas: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [cursoActual, setCursoActual] = useState<string>("Todos los cursos");
  const [periodoStats, setPeriodoStats] = useState<string>("Este mes");
  
  // Datos de ejemplo para el dashboard
  const subscriptionStatus = {
    isActive: true,
    expiresAt: "2025-03-20",
    plan: "Anual Premium",
    availablePoints: 850,
  };

  const cursos: CursoResumen[] = [
    { id: "C001", nombre: "6° Básico A", grado: "6° Básico", cantidadEstudiantes: 32, nivel: "Básico", seccion: "A" },
    { id: "C002", nombre: "7° Básico B", grado: "7° Básico", cantidadEstudiantes: 28, nivel: "Básico", seccion: "B" },
    { id: "C003", nombre: "8° Básico A", grado: "8° Básico", cantidadEstudiantes: 30, nivel: "Básico", seccion: "A" }
  ];

  const estudiantes: Estudiante[] = [
    { 
      id: "E001", 
      nombre: "Sofía", 
      apellido: "García", 
      avatar: "https://randomuser.me/api/portraits/women/44.jpg", 
      progreso: 78, 
      ultimaActividad: "2 horas atrás",
      alertas: 0
    },
    { 
      id: "E002", 
      nombre: "Mateo", 
      apellido: "Rodríguez", 
      avatar: "https://randomuser.me/api/portraits/men/32.jpg", 
      progreso: 92, 
      ultimaActividad: "1 día atrás",
      alertas: 0
    },
    { 
      id: "E003", 
      nombre: "Valentina", 
      apellido: "López", 
      avatar: "https://randomuser.me/api/portraits/women/67.jpg", 
      progreso: 45, 
      ultimaActividad: "3 horas atrás",
      alertas: 2
    },
    { 
      id: "E004", 
      nombre: "Santiago", 
      apellido: "Martínez", 
      avatar: "https://randomuser.me/api/portraits/men/75.jpg", 
      progreso: 65, 
      ultimaActividad: "Justo ahora",
      alertas: 1
    }
  ];

  const statistics = {
    totalEstudiantes: cursos.reduce((acc, curso) => acc + curso.cantidadEstudiantes, 0),
    cursosActivos: cursos.length,
    promedioEmocional: 7.8,
    interaccionesPositivas: 85,
    alertasPendientes: estudiantes.reduce((acc, est) => acc + est.alertas, 0),
    tasaCompletitud: 72,
    estudiantesActivos: 88,
    logrosPrincipales: 64
  };

  const actividadesRecientes = [
    { id: 1, tipo: "tarea", nombre: "Reconocimiento de emociones", curso: "6° Básico A", fecha: "Hoy, 14:30" },
    { id: 2, tipo: "evaluacion", nombre: "Test de inteligencia emocional", curso: "7° Básico B", fecha: "Ayer, 10:15" },
    { id: 3, tipo: "material", nombre: "Guía de trabajo cooperativo", curso: "8° Básico A", fecha: "22/03/2025" },
    { id: 4, tipo: "reunion", nombre: "Reunión con tutores", curso: "Todos", fecha: "20/03/2025" }
  ];

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  const handleCambiarCurso = (cursoID: string) => {
    const curso = cursos.find(c => c.id === cursoID);
    setCursoActual(curso ? curso.nombre : "Todos los cursos");
  };

  const handleCambiarPeriodo = (periodo: string) => {
    setPeriodoStats(periodo);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel Docente
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Bienvenido, {currentUser?.name || "Docente"}
              </p>
            </div>
            <div className="flex space-x-3">
              <select 
                className="px-3 py-2 bg-violet-50 border border-violet-200 rounded-md text-sm text-violet-700"
                value={cursoActual}
                onChange={(e) => handleCambiarCurso(e.target.value)}
              >
                <option value="todos">Todos los cursos</option>
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Subscription Status */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center mb-4">
            <Crown className="w-6 h-6 mr-2" />
            <h2 className="text-lg font-semibold">Suscripción {subscriptionStatus.plan}</h2>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Expira: {subscriptionStatus.expiresAt}</p>
              <div className="flex items-center mt-2">
                <Coins className="w-5 h-5 mr-2" />
                <p className="font-semibold">{subscriptionStatus.availablePoints} puntos disponibles</p>
              </div>
            </div>
            <button 
              onClick={() => handleActionClick('/teacher/subscription')}
              className="bg-white text-violet-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-50 transition-colors"
            >
              Renovar
            </button>
          </div>
        </div>

        {/* Selección de periodo para estadísticas */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Estadísticas y Métricas</h2>
          <select 
            className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700"
            value={periodoStats}
            onChange={(e) => handleCambiarPeriodo(e.target.value)}
          >
            <option value="Este mes">Este mes</option>
            <option value="Último trimestre">Último trimestre</option>
            <option value="Este año">Este año</option>
          </select>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Estudiantes</h3>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">{statistics.totalEstudiantes}</span>
              <span className="text-sm text-gray-500 ml-2">totales</span>
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium text-green-600">{statistics.estudiantesActivos}%</span>
              <span className="text-sm text-gray-500 ml-1">activos hoy</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <School className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Cursos</h3>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">{statistics.cursosActivos}</span>
              <span className="text-sm text-gray-500 ml-2">activos</span>
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium text-blue-600">Ver detalles</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <BookmarkCheck className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Completitud</h3>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">{statistics.tasaCompletitud}%</span>
              <span className="text-sm text-gray-500 ml-2">promedio</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${statistics.tasaCompletitud}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer" 
            onClick={() => handleActionClick('/mensajes')}>
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mr-3">
                <MessageSquare className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Mensajes</h3>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">3</span>
              <span className="text-sm text-gray-500 ml-2">no leídos</span>
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium text-violet-600">Abrir chat</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estudiantes recientes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Estudiantes Destacados</h3>
                <button 
                  onClick={() => handleActionClick('/teacher/students')}
                  className="text-sm text-violet-600 hover:text-violet-700"
                >
                  Ver todos
                </button>
              </div>
              <ul className="divide-y divide-gray-200">
                {estudiantes.map((estudiante) => (
                  <li key={estudiante.id} className="px-4 py-4 flex items-center hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mr-4">
                      {estudiante.avatar ? (
                        <img
                          src={estudiante.avatar}
                          alt={`${estudiante.nombre} ${estudiante.apellido}`}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {estudiante.nombre.charAt(0)}{estudiante.apellido.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {estudiante.nombre} {estudiante.apellido}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Última actividad: {estudiante.ultimaActividad}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <p className="text-sm text-gray-500">Progreso</p>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                estudiante.progreso > 75 ? 'bg-green-500' : 
                                estudiante.progreso > 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${estudiante.progreso}%` }}>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{estudiante.progreso}%</span>
                        </div>
                      </div>
                      
                      {estudiante.alertas > 0 && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100">
                            <span className="text-xs font-medium text-red-600">{estudiante.alertas}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-3 bg-gray-50 text-center">
                <button 
                  onClick={() => handleActionClick('/teacher/students/add')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Añadir estudiante
                </button>
              </div>
            </div>
          </div>

          {/* Panel de mensajes y comunicación */}
          <div>
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Comunicación</h3>
                <button 
                  onClick={() => handleActionClick('/mensajes')}
                  className="text-sm text-violet-600 hover:text-violet-700 flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Mensajes
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <img 
                        src="https://randomuser.me/api/portraits/women/44.jpg" 
                        alt="Sofía García" 
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sofía García</p>
                      <p className="text-xs text-gray-500 truncate">¿Cuándo es la próxima entrega del proyecto?</p>
                    </div>
                    <span className="text-xs text-gray-500">10m</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-violet-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <img 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Mateo Rodríguez" 
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Mateo Rodríguez</p>
                      <p className="text-xs text-gray-500 truncate">He completado todas las actividades</p>
                    </div>
                    <span className="text-xs text-gray-500">1h</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => handleActionClick('/mensajes')}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700"
                  >
                    Ver todos los mensajes
                  </button>
                </div>
              </div>
            </div>
            
            {/* Actividades recientes */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {actividadesRecientes.map((actividad) => (
                  <li key={actividad.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-md flex items-center justify-center
                        ${actividad.tipo === 'tarea' ? 'bg-blue-100' : 
                          actividad.tipo === 'evaluacion' ? 'bg-red-100' : 
                          actividad.tipo === 'material' ? 'bg-green-100' : 'bg-purple-100'}`}>
                        {actividad.tipo === 'tarea' && <BookOpen className="h-4 w-4 text-blue-600" />}
                        {actividad.tipo === 'evaluacion' && <Award className="h-4 w-4 text-red-600" />}
                        {actividad.tipo === 'material' && <BookmarkCheck className="h-4 w-4 text-green-600" />}
                        {actividad.tipo === 'reunion' && <Users className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {actividad.nombre}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {actividad.curso} • {actividad.fecha}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-3 bg-gray-50 text-center">
                <button 
                  onClick={() => handleActionClick('/teacher/courses')}
                  className="text-sm text-violet-600 hover:text-violet-700"
                >
                  Ver todas las actividades
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cuarta fila - Comunicación */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Chat con estudiantes */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
              Comunicación con Estudiantes
            </h2>
            <TeacherStudentChat compact={true} onlyShowList={false} />
          </div>
          
          {/* Notificaciones y contactos recientes */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Notificaciones</h2>
              <ChatNotification limit={3} />
            </div>
          </div>
        </div>

        {/* Sección de mensajes recientes */}
        <div className="mt-8">
          <RecentContacts title="Estudiantes recientes" filter="student" />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <button 
            onClick={() => handleActionClick('/teacher/courses')}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:border-violet-200 hover:shadow transition-all text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <School className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Gestionar Cursos</h3>
            <p className="mt-1 text-sm text-gray-500">Configurar y organizar cursos</p>
          </button>

          <button 
            onClick={() => handleActionClick('/teacher/students')}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:border-violet-200 hover:shadow transition-all text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Estudiantes</h3>
            <p className="mt-1 text-sm text-gray-500">Administrar estudiantes</p>
          </button>
          
          <button 
            onClick={() => handleActionClick('/teacher/rewards/hub')}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:border-violet-200 hover:shadow transition-all text-center"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <Gift className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Premios</h3>
            <p className="mt-1 text-sm text-gray-500">Gestionar sistema de premios</p>
          </button>

          <button 
            onClick={() => handleActionClick('/teacher/reports/enhanced')}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:border-violet-200 hover:shadow transition-all text-center"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <BarChart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Análisis Socioemocional</h3>
            <p className="mt-1 text-sm text-gray-500">Ver señales y progreso emocional</p>
          </button>

          <button 
            onClick={() => handleActionClick('/teacher/settings')}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:border-violet-200 hover:shadow transition-all text-center"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Configuración</h3>
            <p className="mt-1 text-sm text-gray-500">Personalizar ajustes</p>
          </button>

          <button 
            onClick={() => handleActionClick('/mensajes')}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:border-violet-200 hover:shadow transition-all text-center relative"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 relative">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <ChatNotification variant="badge" />
            </div>
            <h3 className="font-semibold text-gray-800">Mensajes</h3>
            <p className="mt-1 text-sm text-gray-500">Chats privados</p>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
