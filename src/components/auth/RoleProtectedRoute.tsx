import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
    const { currentUser, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    // Añadir logs detallados para depuración
    console.log('RoleProtectedRoute - Usuario actual:', currentUser);
    console.log('RoleProtectedRoute - isAuthenticated:', isAuthenticated);
    console.log('RoleProtectedRoute - Roles permitidos:', allowedRoles);
    
    if (currentUser) {
        console.log('RoleProtectedRoute - Rol del usuario:', currentUser.role);
        console.log('RoleProtectedRoute - ¿Tiene permiso?:', allowedRoles.includes(currentUser.role));
    }

    // Verificar si el usuario está autenticado y tiene un rol permitido
    if (!isAuthenticated || !currentUser || !allowedRoles.includes(currentUser.role)) {
        console.log('Acceso denegado. Usuario:', currentUser, 'Roles permitidos:', allowedRoles);
        // Redirigir a diferentes páginas de login según el rol requerido
        if (allowedRoles.includes('teacher') || allowedRoles.includes('tutor')) {
            return <Navigate to="/login" />;
        } else if (allowedRoles.includes('student')) {
            return <Navigate to="/login-estudiante" />;
        }
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
}
