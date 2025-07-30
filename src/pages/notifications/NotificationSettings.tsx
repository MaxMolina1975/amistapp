import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, FileText, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../../lib/context/AuthContext';
import { AlertType } from '../../lib/services/AlertService';

interface NotificationPreference {
  type: AlertType;
  enabled: boolean;
  sound: boolean;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const NotificationSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      type: AlertType.MESSAGE,
      enabled: true,
      sound: true,
      label: 'Mensajes',
      description: 'Notificaciones cuando recibas nuevos mensajes',
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />
    },
    {
      type: AlertType.REPORT,
      enabled: true,
      sound: true,
      label: 'Reportes',
      description: 'Notificaciones sobre nuevos reportes de alumnos',
      icon: <FileText className="h-5 w-5 text-orange-500" />
    },
    {
      type: AlertType.IMPORTANT,
      enabled: true,
      sound: true,
      label: 'Notificaciones importantes',
      description: 'Alertas del sistema y comunicados importantes',
      icon: <Bell className="h-5 w-5 text-purple-500" />
    },
    {
      type: AlertType.EMOTIONAL,
      enabled: true,
      sound: true,
      label: 'Alertas emocionales',
      description: 'Notificaciones sobre el estado emocional de los alumnos',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
    },
    {
      type: AlertType.BULLYING,
      enabled: true,
      sound: true,
      label: 'Alertas de bullying',
      description: 'Notificaciones urgentes sobre posibles casos de acoso',
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  ]);
  
  // Cargar preferencias guardadas al iniciar
  useEffect(() => {
    if (!currentUser) return;
    
    // Aquí se cargarían las preferencias desde Firestore
    const loadPreferences = async () => {
      try {
        // En una implementación real, aquí se cargarían las preferencias del usuario
        // Por ahora usamos las predeterminadas
        console.log('Cargando preferencias de notificaciones para:', currentUser.id);
      } catch (error) {
        console.error('Error al cargar preferencias:', error);
      }
    };
    
    loadPreferences();
  }, [currentUser]);
  
  // Guardar preferencias cuando cambien
  useEffect(() => {
    if (!currentUser) return;
    
    const savePreferences = async () => {
      try {
        // En una implementación real, aquí se guardarían las preferencias
        console.log('Guardando preferencias de notificaciones:', preferences);
        // Ejemplo: await setDoc(doc(db, 'notification_preferences', currentUser.id), { preferences });
      } catch (error) {
        console.error('Error al guardar preferencias:', error);
      }
    };
    
    // Usar un debounce para no guardar en cada cambio
    const timeoutId = setTimeout(savePreferences, 1000);
    return () => clearTimeout(timeoutId);
  }, [preferences, currentUser]);
  
  // Cambiar estado de habilitado/deshabilitado
  const toggleEnabled = (index: number) => {
    setPreferences(prev => {
      const updated = [...prev];
      updated[index].enabled = !updated[index].enabled;
      return updated;
    });
  };
  
  // Cambiar estado de sonido
  const toggleSound = (index: number) => {
    setPreferences(prev => {
      const updated = [...prev];
      updated[index].sound = !updated[index].sound;
      return updated;
    });
  };
  
  // Probar sonido de notificación
  const testSound = (type: AlertType) => {
    const sounds: Record<AlertType, string> = {
      [AlertType.MESSAGE]: '/sounds/message.mp3',
      [AlertType.REPORT]: '/sounds/report.mp3',
      [AlertType.IMPORTANT]: '/sounds/important.mp3',
      [AlertType.EMOTIONAL]: '/sounds/emotional.mp3',
      [AlertType.BULLYING]: '/sounds/urgent.mp3',
      [AlertType.ACADEMIC]: '/sounds/notification.mp3',
      [AlertType.BEHAVIORAL]: '/sounds/notification.mp3',
      [AlertType.ATTENDANCE]: '/sounds/notification.mp3'
    };
    
    try {
      const audio = new Audio(sounds[type]);
      audio.play().catch(error => {
        console.warn('No se pudo reproducir el sonido de prueba:', error);
      });
    } catch (error) {
      console.error('Error al reproducir sonido de prueba:', error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Configuración de notificaciones</h1>
          <p className="text-gray-600 mt-2">
            Personaliza cómo y cuándo quieres recibir notificaciones, incluso cuando la aplicación no esté en uso.
          </p>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Preferencias de notificaciones</h2>
          
          <div className="space-y-6">
            {preferences.map((pref, index) => (
              <div key={pref.type} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                  <div className="mt-1">{pref.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-800">{pref.label}</h3>
                    <p className="text-sm text-gray-600">{pref.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Botón para probar sonido */}
                  <button 
                    className="p-2 text-gray-500 hover:text-violet-600 rounded-full hover:bg-violet-50"
                    onClick={() => testSound(pref.type)}
                    title="Probar sonido"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                  
                  {/* Toggle de sonido */}
                  <div className="flex items-center">
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${pref.sound ? 'bg-violet-600' : 'bg-gray-200'}`}
                      onClick={() => toggleSound(index)}
                      disabled={!pref.enabled}
                    >
                      <span
                        className={`${pref.sound ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                    <span className="ml-2 text-sm text-gray-600">
                      {pref.sound ? 'Sonido activado' : 'Silencio'}
                    </span>
                  </div>
                  
                  {/* Toggle de habilitado/deshabilitado */}
                  <div className="flex items-center">
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${pref.enabled ? 'bg-violet-600' : 'bg-gray-200'}`}
                      onClick={() => toggleEnabled(index)}
                    >
                      <span
                        className={`${pref.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                    <span className="ml-2 text-sm text-gray-600">
                      {pref.enabled ? 'Activado' : 'Desactivado'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Información adicional</h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <Bell className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Las notificaciones te permitirán estar al tanto de mensajes, reportes y alertas importantes incluso cuando no estés usando la aplicación.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Para recibir notificaciones cuando la aplicación no esté en uso:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Asegúrate de permitir las notificaciones en tu navegador cuando se te solicite</li>
              <li>Mantén activa tu sesión en la aplicación</li>
              <li>Las notificaciones con sonido funcionarán incluso si la aplicación está minimizada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;