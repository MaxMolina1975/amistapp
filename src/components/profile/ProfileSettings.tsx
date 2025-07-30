import React from 'react';
import { Mail, Bell, Lock, Settings as SettingsIcon } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ProfileSettingsProps {
  settings: {
    email: string;
    notifications: boolean;
  };
  onUpdateSettings: (settings: { notifications: boolean }) => void;
  onChangePassword: () => void;
  onOpenSettings: () => void;
  isEditing: boolean;
}

export function ProfileSettings({
  settings,
  onUpdateSettings,
  onChangePassword,
  onOpenSettings,
  isEditing
}: ProfileSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <Mail className="w-5 h-5 text-gray-500 mr-3" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input 
              type="email" 
              value={settings.email}
              className="w-full bg-transparent focus:outline-none text-gray-600"
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Notificaciones</label>
              <p className="text-sm text-gray-500">Recibe alertas importantes</p>
            </div>
          </div>
          <button 
            onClick={() => onUpdateSettings({ notifications: !settings.notifications })}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.notifications ? 'bg-violet-600' : 'bg-gray-200'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
              settings.notifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={onChangePassword}
        icon={<Lock className="w-5 h-5" />}
      >
        <div className="flex-1 text-left">
          <span className="text-gray-700 font-medium">Cambiar Contraseña</span>
          <p className="text-sm text-gray-500">Actualiza tu contraseña periódicamente</p>
        </div>
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={onOpenSettings}
        icon={<SettingsIcon className="w-5 h-5" />}
      >
        <div className="flex-1 text-left">
          <span className="text-gray-700 font-medium">Configuración de Cuenta</span>
          <p className="text-sm text-gray-500">Privacidad y preferencias</p>
        </div>
      </Button>
    </div>
  );
}