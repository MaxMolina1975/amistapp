import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Settings, 
  Bell, 
  Shield, 
  LogOut, 
  Edit2, 
  Camera,
  Star,
  Users,
  Book,
  Lock,
  History,
  School,
  Award,
  Calendar
} from 'lucide-react';

export function TeacherProfile() {
  const [notifications, setNotifications] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const teacherStats = {
    students: 32,
    courses: 2,
    activeReports: 3,
    pointsToDistribute: 1000
  };

  const activityHistory = [
    { date: '2024-03-15', type: 'points', description: 'Puntos otorgados a María López', amount: '-50' },
    { date: '2024-03-14', type: 'report', description: 'Reporte resuelto: Conflicto en clase', status: 'Resuelto' },
    { date: '2024-03-13', type: 'course', description: 'Nuevo estudiante: Carlos Ruiz', status: 'Agregado' },
    { date: '2024-03-12', type: 'points', description: 'Recarga mensual de puntos', amount: '+1000' },
  ];

  const courseInfo = {
    name: 'Clase 2024-A',
    code: 'CURSO-2024-A1',
    startDate: '01/03/2024',
    studentsCount: 32
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Perfil Docente</h1>
        <p className="text-gray-600">Gestiona tu información y cursos</p>
      </header>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-indigo-600" />
            </div>
            <button 
              className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white"
              onClick={() => {/* Implementar carga de foto */}}
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {editMode ? (
                    <input 
                      type="text" 
                      defaultValue="Prof. García"
                      className="border-b border-indigo-300 focus:outline-none focus:border-indigo-600 bg-transparent"
                    />
                  ) : (
                    "Prof. García"
                  )}
                </h2>
                <p className="text-gray-500">Docente Principal</p>
              </div>
              <button 
                onClick={() => setEditMode(!editMode)}
                className="p-2 text-gray-400 hover:text-indigo-600"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Course Information */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <School className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-medium text-gray-800">{courseInfo.name}</h3>
              <p className="text-sm text-gray-500">
                Código: {courseInfo.code} • {courseInfo.studentsCount} estudiantes
              </p>
            </div>
          </div>
          <div className="mt-4 bg-indigo-50 rounded-lg p-3">
            <p className="text-sm text-indigo-600">
              Inicio del curso: {courseInfo.startDate}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-700">Estudiantes</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-primary">32</span>
            <span className="text-sm text-gray-500 ml-2">activos</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-700">Recompensas</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-primary">15</span>
            <span className="text-sm text-gray-500 ml-2">entregadas</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-indigo-50">
          <Award className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <span className="block text-sm font-medium text-gray-800">Asignar Puntos</span>
        </button>

        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-indigo-50">
          <Calendar className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <span className="block text-sm font-medium text-gray-800">Programar Actividad</span>
        </button>
      </div>

      {/* Activity History */}
      <div className="mb-6">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div className="flex items-center">
            <History className="w-5 h-5 text-gray-500 mr-3" />
            <span className="text-gray-700">Historial de Actividad</span>
          </div>
          <div className={`transform transition-transform ${showHistory ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </button>
        
        {showHistory && (
          <div className="mt-4 space-y-3">
            {activityHistory.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{item.description}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  {item.amount && (
                    <span className={`font-medium ${
                      item.amount.startsWith('+') ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {item.amount} pts
                    </span>
                  )}
                  {item.status && (
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.status === 'Resuelto' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-400" />
            <div>
              <h3 className="font-semibold text-gray-800">Notificaciones</h3>
              <p className="text-sm text-gray-500">Alertas y actividad</p>
            </div>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors ${
              notifications ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
              notifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <Lock className="w-5 h-5 text-gray-500 mr-3" />
          <div className="flex-1 text-left">
            <span className="text-gray-700 font-medium">Cambiar Contraseña</span>
            <p className="text-sm text-gray-500">Actualiza tu contraseña periódicamente</p>
          </div>
        </button>

        <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <Settings className="w-5 h-5 text-gray-500 mr-3" />
          <div className="flex-1 text-left">
            <span className="text-gray-700 font-medium">Configuración del Curso</span>
            <p className="text-sm text-gray-500">Gestiona las opciones del curso</p>
          </div>
        </button>

        <button className="w-full bg-red-50 p-4 rounded-xl shadow-sm border border-red-100 flex items-center justify-center text-red-600">
          <LogOut className="w-5 h-5 mr-2" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}