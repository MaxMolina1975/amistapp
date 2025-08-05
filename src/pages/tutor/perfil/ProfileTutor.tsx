import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Settings, 
  Edit3, 
  Camera, 
  Save, 
  Users,
  BookOpen, 
  Calendar,
  AlertCircle,
  LogOut,
  Clock
} from 'lucide-react';
import { useAuth } from '../../../lib/context/AuthContext';
import { UserProfileUpdate } from '../../../lib/types/auth';
import toast from 'react-hot-toast';

interface EstadisticasTutor {
  estudiantesAsignados: number;
  sesionesRealizadas: number;
  alertasPendientes: number;
  reportesGenerados: number;
  horasRegistradas: number;
}

interface ActividadHistorial {
  id: string;
  tipo: 'sesion' | 'alerta' | 'reporte' | 'estudiante' | 'sistema';
  titulo: string;
  descripcion: string;
  fecha: string;
  hora?: string;
  icono?: React.ReactNode;
}

export function ProfileTutor() {
  const navigate = useNavigate();
  const { currentUser, logout: authLogout, updateUserProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [perfilActualizado, setPerfilActualizado] = useState({
    nombre: currentUser?.name || '',
    apellido: currentUser?.lastName || '',
    telefono: currentUser?.phone || '',
    especialidad: currentUser?.specialty || 'Psicopedagogía',
    acercaDeMi: currentUser?.bio || 'Tutor especializado en apoyo emocional y desarrollo de habilidades sociales en adolescentes.'
  });
  
  const [historialExpandido, setHistorialExpandido] = useState(false);
  const [cargando, setCargando] = useState(false);
  
  // Datos de ejemplo para estadísticas del tutor
  const estadisticas: EstadisticasTutor = {
    estudiantesAsignados: 15,
    sesionesRealizadas: 48,
    alertasPendientes: 3,
    reportesGenerados: 12,
    horasRegistradas: 76
  };
  
  // Datos de ejemplo para el historial de actividades
  const historialActividades: ActividadHistorial[] = [
    {
      id: '1',
      tipo: 'sesion',
      titulo: 'Sesión de tutoría',
      descripcion: 'Sesión con Miguel Suárez (8° Básico A)',
      fecha: '24/03/2025',
      hora: '14:30 - 15:30',
      icono: <Calendar className="h-5 w-5 text-green-500" />
    },
    {
      id: '2',
      tipo: 'alerta',
      titulo: 'Alerta emocional',
      descripcion: 'Alerta de Ana López (6° Básico B): Ansiedad recurrente',
      fecha: '22/03/2025',
      icono: <AlertCircle className="h-5 w-5 text-red-500" />
    },
    {
      id: '3',
      tipo: 'reporte',
      titulo: 'Reporte generado',
      descripcion: 'Informe mensual enviado a coordinación académica',
      fecha: '20/03/2025',
      icono: <BookOpen className="h-5 w-5 text-blue-500" />
    },
    {
      id: '4',
      tipo: 'estudiante',
      titulo: 'Estudiante asignado',
      descripcion: 'Se te ha asignado a Carlos Méndez (7° Básico A)',
      fecha: '18/03/2025',
      icono: <Users className="h-5 w-5 text-purple-500" />
    },
    {
      id: '5',
      tipo: 'sistema',
      titulo: 'Registro de horas',
      descripcion: 'Has registrado 8 horas de tutoría esta semana',
      fecha: '15/03/2025',
      icono: <Clock className="h-5 w-5 text-orange-500" />
    }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPerfilActualizado(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    try {
      if (!updateUserProfile) {
        throw new Error('La función de actualización no está disponible');
      }
      
      const updateData: UserProfileUpdate = {
        name: perfilActualizado.nombre,
        lastName: perfilActualizado.apellido,
        phone: perfilActualizado.telefono,
        specialty: perfilActualizado.especialidad,
        bio: perfilActualizado.acercaDeMi
      };
      
      await updateUserProfile(updateData);
      
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar perfil. Inténtalo nuevamente');
    } finally {
      setCargando(false);
    }
  };
  
  const handleCerrarSesion = async () => {
    try {
      await authLogout();
      navigate('/login-tutor');
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-green-500" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Perfil Tutor
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Información de perfil */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit3 className="h-4 w-4 mr-1.5" />
                  Editar
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={cargando}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {cargando ? (
                      'Guardando...'
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1.5" />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 flex flex-col items-center">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {currentUser?.profilePicture ? (
                        <img 
                          src={currentUser.profilePicture} 
                          alt={`${currentUser.name} ${currentUser.lastName || ''}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-gray-500">
                          {currentUser?.name?.charAt(0) || 'T'}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full text-white hover:bg-green-700"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="mt-3 bg-green-100 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-green-800">Tutor</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Nombre
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="nombre"
                          id="nombre"
                          value={perfilActualizado.nombre}
                          onChange={handleChange}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{perfilActualizado.nombre || 'No especificado'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                        Apellido
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="apellido"
                          id="apellido"
                          value={perfilActualizado.apellido}
                          onChange={handleChange}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{perfilActualizado.apellido || 'No especificado'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo electrónico
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{currentUser?.email || 'No especificado'}</p>
                    </div>
                    
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                        Teléfono
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="telefono"
                          id="telefono"
                          value={perfilActualizado.telefono}
                          onChange={handleChange}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{perfilActualizado.telefono || 'No especificado'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">
                        Especialidad
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="especialidad"
                          id="especialidad"
                          value={perfilActualizado.especialidad}
                          onChange={handleChange}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{perfilActualizado.especialidad}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="acercaDeMi" className="block text-sm font-medium text-gray-700">
                      Acerca de mí
                    </label>
                    {isEditing ? (
                      <textarea
                        name="acercaDeMi"
                        id="acercaDeMi"
                        rows={3}
                        value={perfilActualizado.acercaDeMi}
                        onChange={handleChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{perfilActualizado.acercaDeMi}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Estadísticas del tutor */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Panel de Estadísticas</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 flex flex-col items-center">
                <div className="bg-purple-100 p-2 rounded-full mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-sm text-gray-500">Estudiantes</p>
                <p className="text-xl font-bold text-purple-700">{estadisticas.estudiantesAsignados}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
                <div className="bg-green-100 p-2 rounded-full mb-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-500">Sesiones</p>
                <p className="text-xl font-bold text-green-700">{estadisticas.sesionesRealizadas}</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 flex flex-col items-center">
                <div className="bg-red-100 p-2 rounded-full mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-sm text-gray-500">Alertas</p>
                <p className="text-xl font-bold text-red-700">{estadisticas.alertasPendientes}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                <div className="bg-blue-100 p-2 rounded-full mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-500">Reportes</p>
                <p className="text-xl font-bold text-blue-700">{estadisticas.reportesGenerados}</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 flex flex-col items-center">
                <div className="bg-orange-100 p-2 rounded-full mb-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-sm text-gray-500">Horas</p>
                <p className="text-xl font-bold text-orange-700">{estadisticas.horasRegistradas}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de actividades */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Historial de Actividad</h3>
            <button
              type="button"
              onClick={() => setHistorialExpandido(!historialExpandido)}
              className="text-sm text-green-600 hover:text-green-800"
            >
              {historialExpandido ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="divide-y divide-gray-200">
              {historialActividades.slice(0, historialExpandido ? undefined : 3).map((actividad) => (
                <li key={actividad.id} className="py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {actividad.icono}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{actividad.titulo}</p>
                      <p className="text-sm text-gray-500">{actividad.descripcion}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end">
                      <p className="text-sm text-gray-500">{actividad.fecha}</p>
                      {actividad.hora && (
                        <p className="text-sm text-gray-500">{actividad.hora}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Acciones</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 space-y-3">
            <div>
              <button
                type="button"
                onClick={() => navigate('/tutor/settings')}
                className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 shadow-sm text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <Settings className="mr-3 h-5 w-5 text-gray-500" />
                  <span>Configuración</span>
                </div>
                <span>→</span>
              </button>
            </div>
            
            <div>
              <button
                type="button"
                onClick={handleCerrarSesion}
                className="w-full flex justify-between items-center px-4 py-3 border border-red-300 shadow-sm text-sm rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5 text-red-500" />
                  <span>Cerrar sesión</span>
                </div>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileTutor;
