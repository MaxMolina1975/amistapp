import { useState } from 'react';
import { 
  Save, 
  User, 
  Bell, 
  Lock, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Eye, 
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../../lib/context/AuthContext';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function TeacherSettings() {
  const { currentUser, logout } = useAuth();
  
  // Estado para los formularios
  const [fullName, setFullName] = useState(currentUser?.name || 'Nombre Docente');
  const [email, setEmail] = useState(currentUser?.email || 'docente@amistaap.edu');
  const [phone, setPhone] = useState('123456789');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Configuración de notificaciones
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'student_activity',
      label: 'Actividad de estudiantes',
      description: 'Recibe notificaciones cuando los estudiantes completen tareas o tengan cambios significativos.',
      enabled: true
    },
    {
      id: 'tutor_messages',
      label: 'Mensajes de tutores',
      description: 'Recibe notificaciones cuando los tutores envíen mensajes o respondan a tus comunicaciones.',
      enabled: true
    },
    {
      id: 'emotional_alerts',
      label: 'Alertas emocionales',
      description: 'Recibe notificaciones inmediatas cuando un estudiante presente indicadores de riesgo emocional.',
      enabled: true
    },
    {
      id: 'system_updates',
      label: 'Actualizaciones del sistema',
      description: 'Recibe notificaciones sobre nuevas características, actualizaciones y mantenimientos programados.',
      enabled: false
    }
  ]);
  
  // Configuración de privacidad
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: 'share_profile',
      label: 'Compartir perfil con tutores',
      description: 'Permite que los tutores vean tu información de contacto profesional.',
      enabled: true
    },
    {
      id: 'anonymous_data',
      label: 'Compartir datos anónimos para mejoras',
      description: 'Ayuda a mejorar la plataforma compartiendo datos de uso anónimos.',
      enabled: true
    },
    {
      id: 'public_reports',
      label: 'Informes públicos en la institución',
      description: 'Permite que otros docentes vean tus informes generales (sin datos personales de estudiantes).',
      enabled: false
    }
  ]);
  
  // Manejadores para formularios
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de guardado exitoso
    setSuccessMessage('Perfil actualizado correctamente');
    setTimeout(() => setSuccessMessage(null), 3000);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (newPassword !== confirmPassword) {
      // Mostrar error
      return;
    }
    
    // Simulación de guardado exitoso
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccessMessage('Contraseña actualizada correctamente');
    setTimeout(() => setSuccessMessage(null), 3000);
  };
  
  // Manejador para cambiar configuración de notificaciones
  const toggleNotificationSetting = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id ? {...setting, enabled: !setting.enabled} : setting
      )
    );
  };
  
  // Manejador para cambiar configuración de privacidad
  const togglePrivacySetting = (id: string) => {
    setPrivacySettings(prev => 
      prev.map(setting => 
        setting.id === id ? {...setting, enabled: !setting.enabled} : setting
      )
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600">Administra tu perfil y preferencias</p>
      </header>
      
      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{successMessage}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navegación lateral */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-4">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Opciones de Configuración</h2>
            </div>
            <nav>
              <a href="#profile" className="flex items-center px-4 py-3 border-l-4 border-violet-500 bg-violet-50">
                <User className="h-5 w-5 mr-3 text-violet-500" />
                <span className="text-violet-700 font-medium">Perfil</span>
              </a>
              <a href="#password" className="flex items-center px-4 py-3 border-l-4 border-transparent hover:bg-gray-50 transition-colors">
                <Lock className="h-5 w-5 mr-3 text-gray-500" />
                <span className="text-gray-700">Contraseña</span>
              </a>
              <a href="#notifications" className="flex items-center px-4 py-3 border-l-4 border-transparent hover:bg-gray-50 transition-colors">
                <Bell className="h-5 w-5 mr-3 text-gray-500" />
                <span className="text-gray-700">Notificaciones</span>
              </a>
              <a href="#privacy" className="flex items-center px-4 py-3 border-l-4 border-transparent hover:bg-gray-50 transition-colors">
                <Shield className="h-5 w-5 mr-3 text-gray-500" />
                <span className="text-gray-700">Privacidad</span>
              </a>
              <a href="#help" className="flex items-center px-4 py-3 border-l-4 border-transparent hover:bg-gray-50 transition-colors">
                <HelpCircle className="h-5 w-5 mr-3 text-gray-500" />
                <span className="text-gray-700">Ayuda</span>
              </a>
              <button 
                onClick={() => logout && logout()} 
                className="w-full flex items-center px-4 py-3 border-l-4 border-transparent hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="h-5 w-5 mr-3 text-red-500" />
                <span className="text-red-600">Cerrar Sesión</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sección de Perfil */}
          <section id="profile" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <h2 className="font-semibold text-gray-800">Información de Perfil</h2>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </section>
          
          {/* Sección de Contraseña */}
          <section id="password" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-gray-500" />
                <h2 className="font-semibold text-gray-800">Cambiar Contraseña</h2>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Actualizar contraseña
                  </button>
                </div>
              </form>
            </div>
          </section>
          
          {/* Sección de Notificaciones */}
          <section id="notifications" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-gray-500" />
                <h2 className="font-semibold text-gray-800">Preferencias de Notificaciones</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id={setting.id}
                        type="checkbox"
                        checked={setting.enabled}
                        onChange={() => toggleNotificationSetting(setting.id)}
                        className="focus:ring-violet-500 h-4 w-4 text-violet-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={setting.id} className="font-medium text-gray-700">
                        {setting.label}
                      </label>
                      <p className="text-gray-500">{setting.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar preferencias
                </button>
              </div>
            </div>
          </section>
          
          {/* Sección de Privacidad */}
          <section id="privacy" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-gray-500" />
                <h2 className="font-semibold text-gray-800">Privacidad y Seguridad</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {privacySettings.map((setting) => (
                  <div key={setting.id} className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id={setting.id}
                        type="checkbox"
                        checked={setting.enabled}
                        onChange={() => togglePrivacySetting(setting.id)}
                        className="focus:ring-violet-500 h-4 w-4 text-violet-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={setting.id} className="font-medium text-gray-700">
                        {setting.label}
                      </label>
                      <p className="text-gray-500">{setting.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar configuración
                </button>
              </div>
            </div>
          </section>
          
          {/* Sección de Ayuda */}
          <section id="help" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-gray-500" />
                <h2 className="font-semibold text-gray-800">Ayuda y Soporte</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Centro de Ayuda</h3>
                  <p className="text-gray-600 mb-3">Encuentra respuestas a preguntas comunes en nuestro centro de ayuda.</p>
                  <a 
                    href="#" 
                    className="text-violet-600 hover:text-violet-700 font-medium flex items-center"
                  >
                    Visitar Centro de Ayuda
                    <span className="ml-1">→</span>
                  </a>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Contactar Soporte</h3>
                  <p className="text-gray-600 mb-3">¿Necesitas asistencia personalizada? Nuestro equipo está disponible para ayudarte.</p>
                  <a 
                    href="mailto:soporte@amistaap.edu" 
                    className="text-violet-600 hover:text-violet-700 font-medium flex items-center"
                  >
                    Enviar mensaje a Soporte
                    <span className="ml-1">→</span>
                  </a>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Tutoriales y Guías</h3>
                  <p className="text-gray-600 mb-3">Aprende a utilizar todas las funcionalidades de AMISTAAP con nuestros tutoriales.</p>
                  <a 
                    href="#" 
                    className="text-violet-600 hover:text-violet-700 font-medium flex items-center"
                  >
                    Ver tutoriales
                    <span className="ml-1">→</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
