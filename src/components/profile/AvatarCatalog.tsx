import React from 'react';

interface AvatarCatalogProps {
  onSelect: (avatar: string) => void;
  role: 'student' | 'teacher';
}

export function AvatarCatalog({ onSelect, role }: AvatarCatalogProps) {
  const avatars = Array.from({ length: 50 }, (_, index) => {
    const avatarNumber = index + 1;
    return {
      url: `/avatars/avatar${avatarNumber}.png`,
      label: `Avatar ${avatarNumber}`,
      color: 'bg-gray-100'
    };
  });

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Selecciona un Avatar
      </h3>
      <div className="grid grid-cols-5 gap-4">
        {avatars.map((avatar, index) => (
          <div
            key={avatar.url}
            className={`p-2 cursor-pointer ${avatar.color} rounded hover:opacity-80 transition-opacity`}
            onClick={() => onSelect(avatar.url)}
          >
            <img 
              src={avatar.url} 
              alt={avatar.label} 
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/avatars/avatar1.png';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}