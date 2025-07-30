import React from 'react';
import { Star, Gift, Heart, Shield } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    points: number;
    rewards: number;
    emotions: number;
    reports: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-700">Puntos</h3>
        </div>
        <p className="text-2xl font-bold text-violet-600">{stats.points}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-2">
          <Gift className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-700">Premios</h3>
        </div>
        <p className="text-2xl font-bold text-purple-600">{stats.rewards}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-2">
          <Heart className="w-5 h-5 text-pink-500" />
          <h3 className="font-semibold text-gray-700">Emociones</h3>
        </div>
        <p className="text-2xl font-bold text-pink-600">{stats.emotions}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-gray-700">Reportes</h3>
        </div>
        <p className="text-2xl font-bold text-red-600">{stats.reports}</p>
      </div>
    </div>
  );
}