import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Heart, Trophy, Flag } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/context/AuthContext';

// Definir los keyframes para la animación de pulsación
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
  }
  .float-animation {
    animation: float 3s ease-in-out infinite;
  }
  .pulse-animation {
    animation: pulse 2s infinite;
  }
  .center-button {
    transition: all 0.3s ease;
  }
  .center-button:hover {
    transform: scale(1.1);
  }
  .center-button:active {
    transform: scale(0.95);
  }
`;
document.head.appendChild(style);

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  // Clases para estandarizar los iconos y su posicionamiento
  const regularIconClass = "w-6 h-6 mb-1 mx-auto";
  const centerIconClass = "w-8 h-8 text-white float-animation";
  const buttonClass = "flex flex-col items-center justify-center py-3 text-sm transition-colors duration-300 ease-in-out hover:text-violet-600 flex-1";

  // Función para determinar la ruta de perfil según el rol del usuario
  const getProfilePath = () => {
    if (!currentUser) return '/login';
    
    switch (currentUser.role) {
      case 'student':
        return '/estudiante/perfil';
      case 'teacher':
        return '/teacher/perfil';
      case 'tutor':
        return '/tutor/perfil';
      default:
        return '/login';
    }
  };

  // Función para determinar la ruta de premios según el rol del usuario
  const getRewardsPath = () => {
    if (!currentUser) return '/rewards';
    
    switch (currentUser.role) {
      case 'teacher':
        return '/teacher/rewards/hub';
      default:
        return '/rewards';
    }
  };

  // Función para determinar la ruta de reportes según el rol del usuario
  const getReportPath = () => {
    if (!currentUser) return '/report';
    
    switch (currentUser.role) {
      case 'teacher':
        // Si estamos en la página de reportes mejorados (análisis socioemocional), mantener esa ruta
        if (location.pathname.includes('/enhanced')) {
          return '/teacher/reports/enhanced';
        }
        // Si estamos en la página de reportes de bullying, mantener esa ruta
        if (location.pathname.includes('/bullying')) {
          return '/teacher/reports/bullying';
        }
        // Por defecto para profesores, dirigir a la página de reportes de bullying
        return '/teacher/reports/bullying';
      default:
        return '/report';
    }
  };

  const navigation = [
    { name: 'Inicio', icon: Home, path: '/' },
    { name: 'Perfil', icon: User, path: getProfilePath() },
    { name: 'Emociones', icon: Heart, path: '/emotions', isCenter: true },
    { name: 'Premios', icon: Trophy, path: getRewardsPath() },
    { name: currentUser?.role === 'teacher' ? 'Reportes' : 'Reportar', 
      icon: Flag, 
      path: currentUser?.role === 'teacher' ? '/teacher/reports/bullying' : getReportPath() },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 safe-bottom z-40">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-evenly items-center">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            
            if (item.isCenter) {
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'center-button flex flex-col items-center py-3 text-sm -mt-5 relative',
                    'transition-all duration-300 ease-in-out',
                    'hover:text-violet-600',
                    isActive ? 'text-violet-600' : 'text-slate-500'
                  )}
                >
                  <div className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center',
                    'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg',
                    'pulse-animation'
                  )}>
                    <item.icon className={centerIconClass} />
                  </div>
                  <span className="mt-1 font-medium">{item.name}</span>
                </button>
              );
            }
            
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={cn(
                  buttonClass,
                  isActive ? 'text-violet-600' : 'text-slate-500'
                )}
              >
                <div className="flex justify-center w-full">
                  <item.icon className={regularIconClass} />
                </div>
                <span className="font-medium text-center w-full">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}