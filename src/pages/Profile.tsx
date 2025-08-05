import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileStats } from '../components/profile/ProfileStats';
import { ActivityHistory } from '../components/profile/ActivityHistory';
import { ProfileSettings } from '../components/profile/ProfileSettings';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // TODO: Get actual user ID from auth context
  const {
    user,
    settings,
    loading,
    error,
    updateProfile,
    updateSettings,
    uploadAvatar
  } = useProfile('user123');

  const stats = {
    points: 350,
    rewards: 5,
    emotions: 28,
    reports: 2
  };

  const activityHistory = [
    { id: '1', type: 'points', description: 'Puntos por participación', date: '2024-03-15', amount: '+50' },
    { id: '2', type: 'reward', description: 'Canjeó premio: Día sin uniforme', date: '2024-03-14', amount: '-200' },
    { id: '3', type: 'emotion', description: 'Registró emoción: Feliz', date: '2024-03-13' },
    { id: '4', type: 'points', description: 'Bono mensual', date: '2024-03-12', amount: '+50' }
  ];

  const handleEdit = async () => {
    if (isEditing) {
      // TODO: Save changes
      await updateProfile({});
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    // TODO: Implement logout
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-4 py-6 flex items-center justify-center">
        <div className="text-gray-500">Cargando perfil...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal</p>
      </header>

      {error && (
        <Alert 
          variant="error" 
          className="mb-6"
          onClose={() => {/* Clear error */}}
        >
          {error}
        </Alert>
      )}

      <div className="space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <ProfileHeader
            user={user}
            onEdit={handleEdit}
            onAvatarChange={uploadAvatar}
            isEditing={isEditing}
          />
        </div>

        {/* Statistics */}
        <ProfileStats stats={stats} />

        {/* Activity History */}
        <ActivityHistory
          records={activityHistory}
          expanded={showHistory}
          onToggle={() => setShowHistory(!showHistory)}
        />

        {/* Settings */}
        <ProfileSettings
          settings={{
            email: 'juan.perez@ejemplo.com',
            notifications: settings.notifications
          }}
          onUpdateSettings={updateSettings}
          onChangePassword={() => {/* TODO */}}
          onOpenSettings={() => {/* TODO */}}
          isEditing={isEditing}
        />

        {/* Logout Button */}
        <Button
          variant="danger"
          className="w-full"
          onClick={handleLogout}
          icon={<LogOut className="w-5 h-5" />}
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}