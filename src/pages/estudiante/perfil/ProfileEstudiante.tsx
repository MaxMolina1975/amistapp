import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Settings, 
  Edit3, 
  Camera, 
  Save, 
  Award, 
  BookOpen, 
  Heart, 
  LogOut, 
  Clock
} from 'lucide-react';
import { useAuth } from '../../../lib/context/AuthContext';
import { UserProfileUpdate } from '../../../lib/types/auth';
import toast from 'react-hot-toast';
import UserProfileCard from '../../../components/user/UserProfileCard';

interface EstadisticasEstudiante {
  puntosActuales: number;
  logrosDesbloqueados: number;
  tareasCompletadas: number;
  nivelEmocional: number;
  asistencia: number;
}

interface ActividadHistorial {
  id: string;
  tipo: 'logro' | 'puntos' | 'tarea' | 'emocional';
  titulo: string;
  descripcion: string;
  fecha: string;
  valor?: number | string;
  icono?: React.ReactNode;
}

export function ProfileEstudiante() {
  const navigate = useNavigate();
  const { currentUser, logout: authLogout, updateUserProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [perfilActualizado, setPerfilActualizado] = useState({
    nombre: currentUser?.name || '',
    apellido: currentUser?.lastName || '',
    telefono: currentUser?.phone || '',
    acercaDeMi: currentUser?.bio || 'Soy un estudiante utilizando la plataforma AMISTAPP para mejorar mis habilidades socio-emocionales.'
  });
  
  const [historialExpandido, setHistorialExpandido] = useState(false);
  const [cargando, setCargando] = useState(false);
  
  // Datos de ejemplo para estadísticas del estudiante
  const estadisticas: EstadisticasEstudiante = {
    puntosActuales: 750,
    logrosDesbloqueados: 8,
    tareasCompletadas: 24,
    nivelEmocional: 85,
    asistencia: 92
  };
  
  // Datos de ejemplo para el historial de actividades
  const historialActividades: ActividadHistorial[] = [
    {
      id: '1',
      tipo: 'logro',
      titulo: 'Logro desbloqueado',
      descripcion: 'Has conseguido el logro "Comunicador Efectivo"',
      fecha: '24/03/2025',
      valor: '50 puntos',
      icono: <Award className="h-5 w-5 text-yellow-500" />
    },
    {
      id: '2',
      tipo: 'tarea',
      titulo: 'Tarea completada',
      descripcion: 'Has completado la actividad "Reconocimiento de emociones"',
      fecha: '22/03/2025',
      valor: '25 puntos',
      icono: <BookOpen className="h-5 w-5 text-blue-500" />
    },
    {
      id: '3',
      tipo: 'emocional',
      titulo: 'Registro emocional',
      descripcion: 'Has registrado cómo te sentiste durante la semana',
      fecha: '20/03/2025',
      valor: 'Positivo',
      icono: <Heart className="h-5 w-5 text-red-500" />
    },
    {
      id: '4',
      tipo: 'puntos',
      titulo: 'Puntos recibidos',
      descripcion: 'Tu profesor te ha otorgado puntos por participación en clase',
      fecha: '18/03/2025',
      valor: '+100 puntos',
      icono: <Award className="h-5 w-5 text-green-500" />
    },
    {
      id: '5',
      tipo: 'tarea',
      titulo: 'Tarea completada',
      descripcion: 'Has completado la actividad "Manejo de conflictos"',
      fecha: '15/03/2025',
      valor: '30 puntos',
      icono: <BookOpen className="h-5 w-5 text-blue-500" />
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
      
      // Crear objeto con formato adecuado para la API
      const updateData: UserProfileUpdate = {
        name: perfilActualizado.nombre,
        lastName: perfilActualizado.apellido,
        phone: perfilActualizado.telefono,
        bio: perfilActualizado.acercaDeMi
      };
      
      // Llamada al sistema REST local
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
      navigate('/login-estudiante');
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
            <UserIcon className="h-8 w-8 text-violet-500" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Mi Perfil
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Información de perfil */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
            </div>
            <UserProfileCard
              id={Number(currentUser?.id || 0)}
              name={perfilActualizado.nombre + ' ' + perfilActualizado.apellido}
              role="student"
              photoUrl={currentUser?.profilePicture || ''}
              grade="9° Grado"
              collaborationPoints={estadisticas.puntosActuales}
              showMessageButton={false}
              className="w-full"
            />
            <div className="px-4 py-5 sm:p-6">
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
                      className="mt-1 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                      className="mt-1 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                      className="mt-1 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{perfilActualizado.telefono || 'No especificado'}</p>
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
                    className="mt-1 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{perfilActualizado.acercaDeMi}</p>
                )}
              </div>
            </div>
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
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
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
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
          </form>
        </div>

        {/* Estadísticas del estudiante */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Mis Estadísticas</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-violet-50 rounded-lg p-4 flex flex-col items-center">
                <div className="bg-violet-100 p-2 rounded-full mb-2">
                  <Award className="h-5 w-5 text-violet-600" />
                </div>
                <p className="text-sm text-gray-500">Puntos</p>
                <p className="text-xl font-bold text-violet-700">{estadisticas.puntosActuales}</p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center">
                <div className="bg-yellow-100 p-2 rounded-full mb-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <p className="text-sm text-gray-500">Logros</p>
                <p className="text-xl font-bold text-yellow-700">{estadisticas.logrosDesbloqueados}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                <div className="bg-blue-100 p-2 rounded-full mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-500">Tareas</p>
                <p className="text-xl font-bold text-blue-700">{estadisticas.tareasCompletadas}</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 flex flex-col items-center">
                <div className="bg-red-100 p-2 rounded-full mb-2">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-sm text-gray-500">Regulación</p>
                <p className="text-xl font-bold text-red-700">{estadisticas.nivelEmocional}%</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
                <div className="bg-green-100 p-2 rounded-full mb-2">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-500">Asistencia</p>
                <p className="text-xl font-bold text-green-700">{estadisticas.asistencia}%</p>
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
              className="text-sm text-violet-600 hover:text-violet-800"
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
                    <div className="flex-shrink-0 flex items-center">
                      <p className="text-sm text-gray-500 mr-4">{actividad.fecha}</p>
                      {actividad.valor && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          actividad.tipo === 'logro' ? 'bg-yellow-100 text-yellow-800' :
                          actividad.tipo === 'puntos' ? 'bg-green-100 text-green-800' :
                          actividad.tipo === 'tarea' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {actividad.valor}
                        </span>
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
                onClick={() => navigate('/estudiante/settings')}
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

export default ProfileEstudiante;
