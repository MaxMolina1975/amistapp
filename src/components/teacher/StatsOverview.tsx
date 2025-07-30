import React from 'react';
import { TeacherStats } from '../../lib/types';
import { Users, AlertTriangle, LineChart, Gift } from 'lucide-react';

interface StatsOverviewProps {
  stats: TeacherStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-800">Estudiantes</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="font-semibold text-gray-800">Reportes Activos</h3>
        <p className="text-2xl font-bold text-red-600">{stats.activeReports}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
          <LineChart className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-800">Índice Emocional</h3>
        <p className="text-2xl font-bold text-green-600">{stats.averageEmotionalIndex.toFixed(1)}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
          <Gift className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="font-semibold text-gray-800">Premios Activos</h3>
        <p className="text-2xl font-bold text-purple-600">{stats.activeRewards}</p>
      </div>
    </div>
  );
}