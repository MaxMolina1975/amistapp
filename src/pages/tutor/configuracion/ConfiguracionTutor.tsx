import { useState } from 'react';
import { useAuth } from '../../../lib/context/AuthContext';
import {
  Bell,
  Moon,
  Lock,
  User,
  LogOut,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ConfiguracionTutor() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // Para el formulario de cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleSavePreferences = () => {
    setSaveStatus('saving');
    
    // Simulación de guardado en API
    setTimeout(() => {
      // Aquí se guardarían los datos en una implementación real
      // Por ejemplo:
      // const preferencesData = {
      //   darkMode,
      //   notifications,
      //   emailUpdates,
      //   twoFactorEnabled
      // };
      // saveUserPreferences(currentUser?.id, preferencesData);
      
      setSaveStatus('success');
      
      // Resetear mensaje después de 3 segundos
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Validaciones básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Simulación de cambio de contraseña
    setTimeout(() => {
      // Aquí iría la lógica real de cambio de contraseña
      // updatePassword(currentUser.id, currentPassword, newPassword)
      
      // Limpiar campos y cerrar modal
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
      
      // Mostrar mensaje de éxito
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    
    // En una implementación real, aquí se mostraría un modal de configuración
    // o se redigiría a una página específica para configurar 2FA
    if (!twoFactorEnabled) {
      // Simulación de activación de 2FA
      console.log('Activando 2FA...');
      // Aquí se podría abrir un modal con un QR code, etc.
    } else {
      // Simulación de desactivación de 2FA
      console.log('Desactivando 2FA...');
    }
  };

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600">Gestiona tus preferencias y cuenta</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Perfil */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-violet-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Perfil</h2>
              <p className="text-gray-600 text-sm mb-3">Gestiona tu información personal</p>
              
              <div className="mt-3 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={currentUser?.name || "Tutor de Prueba"}
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input 
                    type="email"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={currentUser?.email || "tutor.test@amistaap.edu"}
                    readOnly
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                    onClick={() => navigate('/tutor/perfil')}
                  >
                    Editar perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Seguridad</h2>
              <p className="text-gray-600 text-sm mb-3">Contraseña y seguridad de la cuenta</p>
              
              <div className="mt-3 space-y-4">
                <button 
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Cambiar contraseña
                </button>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <h3 className="font-medium text-gray-800">Verificación en dos pasos</h3>
                    <p className="text-sm text-gray-500">Añade una capa adicional de seguridad</p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      id="toggle-2fa"
                      className="sr-only"
                      checked={twoFactorEnabled}
                      onChange={toggleTwoFactor}
                    />
                    <label
                      htmlFor="toggle-2fa"
                      className={`block ${twoFactorEnabled ? 'bg-violet-500' : 'bg-gray-300'} rounded-full h-6 w-12 cursor-pointer`}
                    ></label>
                    <span 
                      className={`absolute top-1 bg-white rounded-full h-4 w-4 transition-transform ${
                        twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Notificaciones</h2>
              <p className="text-gray-600 text-sm mb-3">Controla cómo te notificamos</p>
              
              <div className="mt-3 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Notificaciones push</h3>
                    <p className="text-sm text-gray-500">Notificaciones en tu dispositivo</p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      id="toggle-notifications"
                      className="sr-only"
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                    />
                    <label
                      htmlFor="toggle-notifications"
                      className={`block ${notifications ? 'bg-violet-500' : 'bg-gray-300'} rounded-full h-6 w-12 cursor-pointer`}
                    ></label>
                    <span 
                      className={`absolute top-1 bg-white rounded-full h-4 w-4 transition-transform ${
                        notifications ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    ></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Actualizaciones por email</h3>
                    <p className="text-sm text-gray-500">Recibe informes semanales por correo</p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      id="toggle-email"
                      className="sr-only"
                      checked={emailUpdates}
                      onChange={() => setEmailUpdates(!emailUpdates)}
                    />
                    <label
                      htmlFor="toggle-email"
                      className={`block ${emailUpdates ? 'bg-violet-500' : 'bg-gray-300'} rounded-full h-6 w-12 cursor-pointer`}
                    ></label>
                    <span 
                      className={`absolute top-1 bg-white rounded-full h-4 w-4 transition-transform ${
                        emailUpdates ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <Moon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Apariencia</h2>
              <p className="text-gray-600 text-sm mb-3">Personaliza la interfaz</p>
              
              <div className="mt-3 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Modo oscuro</h3>
                    <p className="text-sm text-gray-500">Reducir el brillo de la pantalla</p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      id="toggle-dark"
                      className="sr-only"
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                    <label
                      htmlFor="toggle-dark"
                      className={`block ${darkMode ? 'bg-violet-500' : 'bg-gray-300'} rounded-full h-6 w-12 cursor-pointer`}
                    ></label>
                    <span 
                      className={`absolute top-1 bg-white rounded-full h-4 w-4 transition-transform ${
                        darkMode ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suscripción */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Suscripción</h2>
              <p className="text-gray-600 text-sm mb-3">Gestiona tu plan de suscripción</p>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-100 mb-4">
                <div className="flex items-center text-green-800">
                  <span className="font-medium">Suscripción Anual Activa</span>
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    Hasta el 20 marzo, 2026
                  </span>
                </div>
              </div>
              
              <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={() => navigate('/tutor/subscription')}
              >
                Gestionar suscripción
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-4">
        <button
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors w-full"
          onClick={handleSavePreferences}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Guardando...' : 'Guardar cambios'}
        </button>
        
        {saveStatus === 'success' && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
            <p className="text-green-700 text-sm">Cambios guardados correctamente</p>
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-center">
            <p className="text-red-700 text-sm">Error al guardar los cambios. Inténtalo de nuevo.</p>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full mt-4"
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* Modal para cambiar contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cambiar contraseña</h3>
            
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña actual
                  </label>
                  <input 
                    type="password"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <input 
                    type="password"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar nueva contraseña
                  </label>
                  <input 
                    type="password"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                {passwordError && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-red-700 text-sm">{passwordError}</p>
                  </div>
                )}
                
                <div className="flex justify-end pt-4 space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                  >
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfiguracionTutor;
