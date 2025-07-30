import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { Settings, User, Bell, Eye, Lock, LogOut, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConfiguracionUsuario {
  notificaciones: {
    recordatorios: boolean;
    actividadesNuevas: boolean;
    mensajesDirectos: boolean;
    actualizacionesSistema: boolean;
  };
  privacidad: {
    perfilPublico: boolean;
    mostrarProgreso: boolean;
    mostrarLogros: boolean;
  };
  temaOscuro: boolean;
}

export function Configuracion() {
  const { currentUser, logout } = useAuth();
  const [configuracion, setConfiguracion] = useState<ConfiguracionUsuario>({
    notificaciones: {
      recordatorios: true,
      actividadesNuevas: true,
      mensajesDirectos: true,
      actualizacionesSistema: false
    },
    privacidad: {
      perfilPublico: true,
      mostrarProgreso: true,
      mostrarLogros: true
    },
    temaOscuro: false
  });
  
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNuevo, setPasswordNuevo] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Aquí cargaríamos la configuración del usuario desde una API o Firebase
    // Por ahora usamos datos de ejemplo predefinidos
  }, [currentUser]);

  const handleToggleNotificacion = (tipo: keyof typeof configuracion.notificaciones) => {
    setConfiguracion(prevConfig => ({
      ...prevConfig,
      notificaciones: {
        ...prevConfig.notificaciones,
        [tipo]: !prevConfig.notificaciones[tipo]
      }
    }));
  };

  const handleTogglePrivacidad = (tipo: keyof typeof configuracion.privacidad) => {
    setConfiguracion(prevConfig => ({
      ...prevConfig,
      privacidad: {
        ...prevConfig.privacidad,
        [tipo]: !prevConfig.privacidad[tipo]
      }
    }));
  };

  const handleToggleTema = () => {
    setConfiguracion(prevConfig => ({
      ...prevConfig,
      temaOscuro: !prevConfig.temaOscuro
    }));
  };

  const handleGuardarConfiguracion = () => {
    // Aquí enviaríamos la configuración a una API o Firebase
    toast.success('Configuración guardada correctamente');
  };

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordNuevo !== passwordConfirmar) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (passwordNuevo.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      // Aquí llamaríamos a una API para cambiar la contraseña
      // await cambiarPassword(passwordActual, passwordNuevo);
      
      // Simulamos una respuesta exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Contraseña actualizada correctamente');
      setPasswordActual('');
      setPasswordNuevo('');
      setPasswordConfirmar('');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      toast.error('Error al cambiar la contraseña. Verifica tus datos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
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
            <Settings className="h-8 w-8 text-gray-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Configuración
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sección de perfil */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  Información de Perfil
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                        {currentUser?.name ? (
                          <span className="text-2xl font-bold text-gray-600">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 rounded-full bg-violet-600 p-1.5 text-white hover:bg-violet-700">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                        <dd className="mt-1 text-sm text-gray-900">{currentUser?.name || 'Estudiante Ejemplo'}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
                        <dd className="mt-1 text-sm text-gray-900">{currentUser?.email || 'estudiante@ejemplo.com'}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Grado</dt>
                        <dd className="mt-1 text-sm text-gray-900">6° Básico</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Escuela</dt>
                        <dd className="mt-1 text-sm text-gray-900">Escuela Ejemplo</dd>
                      </div>
                    </dl>
                    
                    <div className="mt-5">
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                        Editar perfil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de notificaciones */}
          <div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-gray-500" />
                  Notificaciones
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Recordatorios de actividades</p>
                    <p className="text-xs text-gray-500">Recibe alertas de tareas y evaluaciones por vencer</p>
                  </div>
                  <button 
                    onClick={() => handleToggleNotificacion('recordatorios')}
                    className={`${
                      configuracion.notificaciones.recordatorios ? 'bg-violet-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
                  >
                    <span className={`${
                      configuracion.notificaciones.recordatorios ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Actividades nuevas</p>
                    <p className="text-xs text-gray-500">Recibe notificaciones cuando se añadan nuevas actividades</p>
                  </div>
                  <button 
                    onClick={() => handleToggleNotificacion('actividadesNuevas')}
                    className={`${
                      configuracion.notificaciones.actividadesNuevas ? 'bg-violet-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
                  >
                    <span className={`${
                      configuracion.notificaciones.actividadesNuevas ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mensajes directos</p>
                    <p className="text-xs text-gray-500">Recibe notificaciones de mensajes de compañeros y profesores</p>
                  </div>
                  <button 
                    onClick={() => handleToggleNotificacion('mensajesDirectos')}
                    className={`${
                      configuracion.notificaciones.mensajesDirectos ? 'bg-violet-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
                  >
                    <span className={`${
                      configuracion.notificaciones.mensajesDirectos ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Actualizaciones del sistema</p>
                    <p className="text-xs text-gray-500">Recibe notificaciones sobre nuevas funcionalidades</p>
                  </div>
                  <button 
                    onClick={() => handleToggleNotificacion('actualizacionesSistema')}
                    className={`${
                      configuracion.notificaciones.actualizacionesSistema ? 'bg-violet-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
                  >
                    <span className={`${
                      configuracion.notificaciones.actualizacionesSistema ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de privacidad */}
          <div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-gray-500" />
                  Privacidad
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Perfil público</p>
                    <p className="text-xs text-gray-500">Tu perfil puede ser visto por otros estudiantes</p>
                  </div>
                  <button 
                    onClick={() => handleTogglePrivacidad('perfilPublico')}
                    className={`${
                      configuracion.privacidad.perfilPublico ? 'bg-violet-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
                  >
                    <span className={`${
                      configuracion.privacidad.perfilPublico ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mostrar progreso</p>
                    <p className="text-xs text-gray-500">Otros pueden ver tu progreso en actividades</p>
                  </div>
                  <button 
                    onClick={() => handleTogglePrivacidad('mostrarProgreso')}
                    className={`${
                      configuracion.privacidad.mostrarProgreso ? 'bg-violet-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
                  >
                    <span className={`${
                      configuracion.privacidad.mostrarProgreso ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mostrar logros</p>
                    <p className="text-xs text-gray-500">Otros pueden ver tus medallas y logros</p>
                  </div>
                  <button 
                    onClick={() => handleTogglePrivacidad('mostrarLogros')}
                    className={`${
                      configuracion.privacidad.mostrarLogros ? 'bg-violet-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
                  >
                    <span className={`${
                      configuracion.privacidad.mostrarLogros ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tema oscuro</p>
                    <p className="text-xs text-gray-500">Cambia al modo oscuro para reducir la fatiga visual</p>
                  </div>
                  <button 
                    onClick={handleToggleTema}
                    className={`${
                      configuracion.temaOscuro ? 'bg-violet-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
                  >
                    <span className={`${
                      configuracion.temaOscuro ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </button>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  onClick={handleGuardarConfiguracion}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>

          {/* Sección de seguridad */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-gray-500" />
                  Seguridad
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Cambiar contraseña</h4>
                
                <form onSubmit={handleCambiarPassword} className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      value={passwordActual}
                      onChange={(e) => setPasswordActual(e.target.value)}
                      required
                      className="mt-1 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      value={passwordNuevo}
                      onChange={(e) => setPasswordNuevo(e.target.value)}
                      required
                      className="mt-1 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={passwordConfirmar}
                      onChange={(e) => setPasswordConfirmar(e.target.value)}
                      required
                      className="mt-1 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Cambiando...' : 'Cambiar contraseña'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Otras opciones de seguridad</h4>
                  
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de ayuda */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-gray-500" />
                  Ayuda y soporte
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-violet-300 hover:shadow-sm transition-all">
                    <h4 className="font-medium text-gray-900 mb-2">Centro de ayuda</h4>
                    <p className="text-sm text-gray-600 mb-3">Encuentra respuestas a preguntas frecuentes y guías de uso</p>
                    <a href="#" className="text-sm text-violet-600 font-medium hover:text-violet-800">
                      Visitar centro de ayuda →
                    </a>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-violet-300 hover:shadow-sm transition-all">
                    <h4 className="font-medium text-gray-900 mb-2">Contactar soporte</h4>
                    <p className="text-sm text-gray-600 mb-3">¿Necesitas ayuda personalizada? Contacta con nuestro equipo</p>
                    <a href="#" className="text-sm text-violet-600 font-medium hover:text-violet-800">
                      Enviar mensaje →
                    </a>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-violet-300 hover:shadow-sm transition-all">
                    <h4 className="font-medium text-gray-900 mb-2">Tutoriales</h4>
                    <p className="text-sm text-gray-600 mb-3">Videos explicativos sobre cómo usar la plataforma</p>
                    <a href="#" className="text-sm text-violet-600 font-medium hover:text-violet-800">
                      Ver tutoriales →
                    </a>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-violet-300 hover:shadow-sm transition-all">
                    <h4 className="font-medium text-gray-900 mb-2">Reportar problema</h4>
                    <p className="text-sm text-gray-600 mb-3">¿Encontraste un error? Ayúdanos a mejorar</p>
                    <a href="#" className="text-sm text-violet-600 font-medium hover:text-violet-800">
                      Reportar →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Configuracion;
