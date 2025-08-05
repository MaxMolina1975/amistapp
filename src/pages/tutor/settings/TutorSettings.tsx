import { useState } from 'react';
import { useAuth } from '../../../lib/context/AuthContext';
import { 
  Bell, Moon, Globe, Lock, User, 
  Shield, Save, LogOut
} from 'lucide-react';

export default function TutorSettings() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('general');
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [activityReminders, setActivityReminders] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [reportNotifications, setReportNotifications] = useState(true);
  
  // Appearance settings state
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('es-ES');
  const [fontSize, setFontSize] = useState('medium');
  
  // Security settings state
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save settings to an API
    console.log('Settings saved');
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the password via API
    console.log('Password updated');
    
    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect happens in the auth context
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600">Personaliza tu cuenta y preferencias</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <span className="text-violet-600 font-medium text-lg">
                    {currentUser?.name?.[0] || 'T'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{currentUser?.name || 'Tutor'}</h3>
                  <p className="text-sm text-gray-500">{currentUser?.email || 'tutor@amistaap.edu'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <nav className="space-y-1">
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'general' ? 'bg-violet-50 text-violet-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('general')}
                >
                  <User className="w-5 h-5" />
                  <span>General</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'notifications' ? 'bg-violet-50 text-violet-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notificaciones</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'appearance' ? 'bg-violet-50 text-violet-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('appearance')}
                >
                  <Moon className="w-5 h-5" />
                  <span>Apariencia</span>
                </button>
                
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'security' ? 'bg-violet-50 text-violet-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('security')}
                >
                  <Lock className="w-5 h-5" />
                  <span>Seguridad</span>
                </button>
                
                <button 
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-red-600 hover:bg-red-50 mt-6"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar sesión</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="col-span-1 md:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* General settings */}
            {activeTab === 'general' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6">Información general</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                          defaultValue={currentUser?.name || 'Ana López'}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correo electrónico
                        </label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                          defaultValue={currentUser?.email || 'tutor@amistaap.edu'}
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          El correo electrónico no puede ser modificado
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                        placeholder="+123456789"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Biografía
                      </label>
                      <textarea 
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                        placeholder="Escribe algo sobre ti..."
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Guardar cambios
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Notification settings */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6">Configuración de notificaciones</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Notificaciones por correo</h3>
                        <p className="text-sm text-gray-500">Recibir notificaciones por correo electrónico</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Notificaciones en la aplicación</h3>
                        <p className="text-sm text-gray-500">Recibir notificaciones dentro de la aplicación</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={appNotifications}
                          onChange={() => setAppNotifications(!appNotifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>
                    
                    <hr className="border-gray-200" />
                    
                    <h3 className="font-medium">Tipos de notificaciones</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Recordatorios de actividades</h4>
                        <p className="text-sm text-gray-500">Recibir recordatorios de próximas actividades</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={activityReminders}
                          onChange={() => setActivityReminders(!activityReminders)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Nuevos mensajes</h4>
                        <p className="text-sm text-gray-500">Recibir notificaciones cuando recibas nuevos mensajes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={messageNotifications}
                          onChange={() => setMessageNotifications(!messageNotifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Informes nuevos</h4>
                        <p className="text-sm text-gray-500">Recibir notificaciones cuando se publiquen nuevos informes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={reportNotifications}
                          onChange={() => setReportNotifications(!reportNotifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Guardar cambios
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Appearance settings */}
            {activeTab === 'appearance' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6">Configuración de apariencia</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Modo oscuro</h3>
                        <p className="text-sm text-gray-500">Activar el tema oscuro de la aplicación</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={darkMode}
                          onChange={() => setDarkMode(!darkMode)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Idioma
                      </label>
                      <select 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="es-ES">Español (España)</option>
                        <option value="es-MX">Español (México)</option>
                        <option value="es-AR">Español (Argentina)</option>
                        <option value="en-US">English (United States)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tamaño de texto
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          className={`py-2 rounded-lg border ${
                            fontSize === 'small' 
                              ? 'bg-violet-50 border-violet-300 text-violet-700' 
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setFontSize('small')}
                        >
                          Pequeño
                        </button>
                        <button
                          type="button"
                          className={`py-2 rounded-lg border ${
                            fontSize === 'medium' 
                              ? 'bg-violet-50 border-violet-300 text-violet-700' 
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setFontSize('medium')}
                        >
                          Mediano
                        </button>
                        <button
                          type="button"
                          className={`py-2 rounded-lg border ${
                            fontSize === 'large' 
                              ? 'bg-violet-50 border-violet-300 text-violet-700' 
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setFontSize('large')}
                        >
                          Grande
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Guardar cambios
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Security settings */}
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6">Configuración de seguridad</h2>
                
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Autenticación de dos factores</h3>
                      <p className="text-sm text-gray-500">Aumenta la seguridad de tu cuenta con autenticación de dos factores</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={twoFactorAuth}
                        onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Cambiar contraseña</h3>
                    <form onSubmit={handlePasswordChange}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña actual
                          </label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nueva contraseña
                          </label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            La contraseña debe tener al menos 8 caracteres y contener al menos un número y un carácter especial
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar nueva contraseña
                          </label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2"
                            disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                          >
                            <Shield className="w-4 h-4" />
                            Actualizar contraseña
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-red-600 mb-2">Zona de peligro</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de estar seguro.
                    </p>
                    <button
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      Eliminar mi cuenta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
