import React, { useState } from 'react';
import { User, Camera, Edit2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { AvatarCatalog } from './AvatarCatalog';

interface ProfileHeaderProps {
  user: {
    fullName: string;
    role: string;
    avatarUrl?: string;
  };
  onEdit: () => void;
  onAvatarChange: (avatarUrl: string) => void;
  isEditing: boolean;
}

export function ProfileHeader({ user, onEdit, onAvatarChange, isEditing }: ProfileHeaderProps) {
  const [showAvatarCatalog, setShowAvatarCatalog] = useState(false);

  const handleAvatarSelect = (avatarUrl: string) => {
    onAvatarChange(avatarUrl);
    setShowAvatarCatalog(false);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-violet-600 dark:text-violet-300" />
          )}
        </div>
        <button 
          onClick={() => setShowAvatarCatalog(true)}
          className="absolute bottom-0 right-0 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {isEditing ? (
                <input 
                  type="text" 
                  defaultValue={user.fullName}
                  className="border-b border-violet-300 focus:outline-none focus:border-violet-600 bg-transparent dark:text-gray-200"
                />
              ) : (
                user.fullName
              )}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            icon={<Edit2 className="w-4 h-4" />}
          >
            {isEditing ? 'Guardar' : 'Editar'}
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showAvatarCatalog}
        onClose={() => setShowAvatarCatalog(false)}
        title="Cambiar Avatar"
      >
        <AvatarCatalog
          onSelect={handleAvatarSelect}
          role={user.role.toLowerCase() as 'student' | 'teacher'}
        />
      </Modal>
    </div>
  );
}