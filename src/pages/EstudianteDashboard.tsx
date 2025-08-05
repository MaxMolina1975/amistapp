import React from 'react';
import { Gift, Shield, Users, Coins, Send } from 'lucide-react';
import { useAuth } from '../lib/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function EstudianteDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Usar datos reales del usuario o valores por defecto si no están disponibles
  const estudianteInfo = {
    puntos: currentUser?.points || 0,
    siguientePremio: 200, // TODO: Obtener del sistema de recompensas
    bonoMensual: currentUser?.monthlyBonus || 0,
    fechaRenovacion: currentUser?.renewalDate || 'Próximo mes'
  };
  
  const handleActionClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mi Panel</h1>
        <p className="text-gray-600">Gestiona tus puntos y actividades</p>
      </header>

      {/* Resumen de Puntos */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mis Puntos</h2>
          <Coins className="w-6 h-6 opacity-75" />
        </div>
        <div className="mb-4">
          <p className="text-3xl font-bold">{estudianteInfo.puntos}</p>
          <p className="text-sm opacity-75">Próximo premio: {estudianteInfo.siguientePremio} pts</p>
        </div>
        <div className="text-sm">
          <p className="opacity-75">Próximo bono mensual: {estudianteInfo.bonoMensual} pts</p>
          <p className="opacity-75">Renovación: {estudianteInfo.fechaRenovacion}</p>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          onClick={() => handleActionClick('/student/rewards')}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <span className="block text-sm font-medium text-gray-800">Canjear Premios</span>
        </button>

        <button 
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          onClick={() => handleActionClick('/student/report')}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <span className="block text-sm font-medium text-gray-800">Reportar</span>
        </button>

        <button 
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          onClick={() => handleActionClick('/student/send-points')}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
            <Send className="w-6 h-6 text-green-600" />
          </div>
          <span className="block text-sm font-medium text-gray-800">Enviar Puntos</span>
        </button>

        <button 
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          onClick={() => handleActionClick('/student/classmates')}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <span className="block text-sm font-medium text-gray-800">Compañeros</span>
        </button>
      </div>

      {/* Actividad Reciente */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Premio Canjeado</p>
                <p className="text-sm text-gray-500">Día sin uniforme</p>
              </div>
              <span className="text-red-600 font-medium">-200 pts</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Puntos Recibidos</p>
                <p className="text-sm text-gray-500">De: Profesor García</p>
              </div>
              <span className="text-green-600 font-medium">+50 pts</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Bono Mensual</p>
                <p className="text-sm text-gray-500">Renovación automática</p>
              </div>
              <span className="text-green-600 font-medium">+50 pts</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}