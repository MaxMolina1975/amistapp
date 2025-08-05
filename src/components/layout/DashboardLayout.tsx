import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Award, Settings, MessageSquare, Gift } from 'lucide-react';
import { useAuth } from '../../lib/context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar qué items de navegación mostrar según el rol
  const getNavigationItems = () => {
    const role = currentUser?.role;
    
    // Items de navegación para estudiantes
    if (role === 'student') {
      return [
        { label: 'Inicio', icon: <Home className="w-5 h-5" />, path: '/estudiante/dashboard' },
        { label: 'Compañeros', icon: <Users className="w-5 h-5" />, path: '/estudiante/compañeros' },
        { label: 'Logros', icon: <Award className="w-5 h-5" />, path: '/estudiante/logros' },
        { label: 'Mensajes', icon: <MessageSquare className="w-5 h-5" />, path: '/mensajes' },
        { label: 'Config', icon: <Settings className="w-5 h-5" />, path: '/estudiante/configuracion' },
      ];
    }
    
    // Items de navegación para docentes
    else if (role === 'teacher') {
      return [
        { label: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/teacher/dashboard' },
        { label: 'Asignar Puntos', icon: <Award className="w-5 h-5" />, path: '/teacher/points' },
        { label: 'Estudiantes', icon: <Users className="w-5 h-5" />, path: '/teacher/students' },
        { label: 'Premios', icon: <Gift className="w-5 h-5" />, path: '/teacher/rewards/hub' },
        { label: 'Config', icon: <Settings className="w-5 h-5" />, path: '/teacher/settings' },
      ];
    }
    
    // Items de navegación para tutores
    else if (role === 'tutor') {
      return [
        { label: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/tutor/dashboard' },
        { label: 'Estudiantes', icon: <Users className="w-5 h-5" />, path: '/tutor/estudiantes' },
        { label: 'Progreso', icon: <Calendar className="w-5 h-5" />, path: '/tutor/progreso' },
        { label: 'Mensajes', icon: <MessageSquare className="w-5 h-5" />, path: '/mensajes' },
        { label: 'Config', icon: <Settings className="w-5 h-5" />, path: '/tutor/configuracion' },
      ];
    }
    
    // Por defecto, mostrar navegación mínima
    return [
      { label: 'Inicio', icon: <Home className="w-5 h-5" />, path: '/' },
      { label: 'Mensajes', icon: <MessageSquare className="w-5 h-5" />, path: '/mensajes' },
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Contenido principal */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Barra de navegación inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 ${
                location.pathname === item.path ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;
