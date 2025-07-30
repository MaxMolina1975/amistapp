import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';

interface StudentRouteProps {
    children: React.ReactNode;
}

export function StudentRoute({ children }: StudentRouteProps) {
    const { currentUser, isAuthenticated, loading } = useAuth();

    // Logs detallados para depuración
    console.log('StudentRoute - Usuario actual:', currentUser);
    console.log('StudentRoute - Tipo de usuario:', typeof currentUser);
    console.log('StudentRoute - isAuthenticated:', isAuthenticated);
    
    if (currentUser && typeof currentUser === 'object' && currentUser.role) {
        console.log('StudentRoute - Rol del usuario:', currentUser.role);
    } else {
        console.log('StudentRoute - Role es undefined o currentUser no es un objeto válido');
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    // Verificación más segura del rol de estudiante
    const isStudentRole = 
        currentUser && 
        typeof currentUser === 'object' && 
        currentUser.role && 
        (currentUser.role === 'student' || 
         currentUser.role.toLowerCase() === 'student' ||
         currentUser.role.includes('student'));

    if (!isAuthenticated || !isStudentRole) {
        console.log('Acceso denegado para estudiante. Usuario:', currentUser);
        return <Navigate to="/login-estudiante" />;
    }

    return <>{children}</>;
}
