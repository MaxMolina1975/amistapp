import { useState, useEffect } from 'react';
import { User, ProfileSettings } from '../lib/types';

export function useProfile(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<ProfileSettings>({
    notifications: true,
    emailNotifications: true,
    language: 'es',
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // Simular carga de datos
      const mockUser: User = {
        id: userId,
        fullName: 'Juan Pérez',
        role: 'student',
        availablePoints: 350,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setUser(mockUser);
    } catch (err) {
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setError(null);
      // TODO: Implement API call
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      setError('Error al actualizar el perfil');
      return false;
    }
  };

  const updateSettings = async (updates: Partial<ProfileSettings>) => {
    try {
      setError(null);
      // TODO: Implement API call
      setSettings(prev => ({ ...prev, ...updates }));
      return true;
    } catch (err) {
      setError('Error al actualizar la configuración');
      return false;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setError(null);
      // TODO: Implement API call
      const mockUrl = URL.createObjectURL(file);
      setUser(prev => prev ? { ...prev, avatarUrl: mockUrl } : null);
      return true;
    } catch (err) {
      setError('Error al subir la imagen');
      return false;
    }
  };

  return {
    user,
    settings,
    loading,
    error,
    updateProfile,
    updateSettings,
    uploadAvatar,
    refreshProfile: loadProfile
  };
}