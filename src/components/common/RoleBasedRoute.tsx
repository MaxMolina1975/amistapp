import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';

interface RoleBasedRouteProps {
  studentComponent: React.ComponentType;
  teacherComponent: React.ComponentType;
  tutorComponent?: React.ComponentType;
  fallbackPath?: string;
}

/**
 * Componente que renderiza diferentes componentes según el rol del usuario
 * Redirige a estudiantes, docentes y tutores a sus respectivas interfaces
 */
export function RoleBasedRoute({
  studentComponent: StudentComponent,
  teacherComponent: TeacherComponent,
  tutorComponent: TutorComponent,
  fallbackPath = '/login'
}: RoleBasedRouteProps) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  // Si el usuario no está autenticado, intentar recuperar datos del localStorage antes de redirigir
  if (!isAuthenticated || !currentUser) {
    // Intentar recuperar el usuario del localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      console.log('RoleBasedRoute: Recuperando usuario del localStorage');
      // No redirigir si hay datos en localStorage, permitir que AuthContext los procese
      return null;
    }
    
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Renderizar el componente correspondiente según el rol
  if (currentUser.role === 'teacher' || currentUser.role === 'admin') {
    return <TeacherComponent />;
  } else if (currentUser.role === 'student') {
    return <StudentComponent />;
  } else if (currentUser.role === 'tutor') {
    // Si existe un componente específico para tutores, usarlo
    return TutorComponent ? <TutorComponent /> : <TeacherComponent />;
  }

  // Si el rol no está definido o no es válido, redirigir al login
  console.log('RoleBasedRoute: Rol no reconocido', currentUser.role);
  return <Navigate to={fallbackPath} state={{ from: location }} replace />;
}