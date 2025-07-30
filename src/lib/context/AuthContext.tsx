import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, UserProfileUpdate } from '../types/auth';
import { NotificationService } from '../services/notificationService';
import { registerServiceWorker, areNotificationsAvailable } from '../utils/serviceWorkerRegistration';
import { signIn as firebaseSignIn } from '../firebase/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar sesión del localStorage al inicializar
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // No iniciar sesión automáticamente con cuenta demo
    // para que el usuario deba autenticarse explícitamente
    
    setLoading(false);
  }, []);


  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null); // Limpiar errores previos
    
    try {
      console.log('Intentando iniciar sesión con:', { email });

      // ELIMINAR: Credenciales demo comentadas
      /*
      const demoCredentials = {
        // Credenciales demo eliminadas
      };
      */
      
      // Solo autenticación real con backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      
      if (data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        console.log('Inicio de sesión exitoso');
        return true;
      }
      
      throw new Error('Respuesta de autenticación inválida');
      
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setError(error instanceof Error ? error.message : 'Error de autenticación');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authProvider');
    
    // Actualizar estado
    setCurrentUser(null);
    setIsAuthenticated(false);
    setError(null); // Limpiar errores
  };
  
  const clearError = () => {
    setError(null);
  };
  
  // Esta función se llama cuando el usuario cierra la aplicación
  // No elimina la sesión para que persista cuando vuelva a abrir la app
  const handleAppClose = () => {
    // No hacemos nada, para mantener la sesión activa
    console.log('App cerrada, manteniendo sesión activa');
  };

  // Función para actualizar el perfil del usuario
  const updateUserProfile = async (updates: UserProfileUpdate): Promise<void> => {
    if (!currentUser || !isAuthenticated) {
      throw new Error('No hay usuario autenticado');
    }
    
    try {
      // En un escenario real, aquí se realizaría una llamada a la API REST
      // para actualizar los datos del usuario en el servidor
      
      // Para nuestro ejemplo, actualizamos localmente
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) throw new Error('No se encontró token de autenticación');
      
      const updatedUser = { ...currentUser, ...updates };
      
      // Actualizar en localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Actualizar estado
      setCurrentUser(updatedUser);
      
      console.log('Perfil actualizado:', updatedUser);
      
      // Simulación de latencia de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return Promise.reject(error);
    }
  };

    // Función para registrar un nuevo usuario
  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role: 'teacher' | 'tutor' | 'student';
    [key: string]: any;
  }): Promise<boolean> => {
    setLoading(true);
    
    try {
      console.log('Intentando registrar usuario:', { email: userData.email, role: userData.role });
      
      try {
        // Intentar registrar con el servidor REST
        let endpoint = '';
        
        // Seleccionar el endpoint correcto según el rol
        const baseURL = import.meta.env.DEV ? 'http://localhost:3007' : '';
        if (userData.role === 'teacher') {
          endpoint = `${baseURL}/teacher/register`;
        } else if (userData.role === 'tutor') {
          endpoint = `${baseURL}/tutor/register`;
        } else if (userData.role === 'student') {
          endpoint = `${baseURL}/student/register`;
        }
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
          signal: AbortSignal.timeout(5000)
        });
        
        const responseText = await response.text();
        
        try {
          const data = responseText ? JSON.parse(responseText) : {};
          
          if (!response.ok) {
            console.error('Error de respuesta REST:', response.status, data);
            throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
          }
          
          const { token, user } = data;
          
          if (!token || !user) {
            throw new Error('Respuesta incompleta del servidor: falta token o datos de usuario');
          }
          
          // Guardar datos de sesión
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Actualizar estado
          setCurrentUser(user);
          setIsAuthenticated(true);
          
          setLoading(false);
          return true;
        } catch (parseError) {
          console.error('Error al analizar respuesta JSON:', parseError);
          console.log('Respuesta recibida:', responseText);
          throw new Error(`Error al procesar la respuesta del servidor`);
        }
      } catch (restError) {
        console.error('Error con el servidor REST:', restError);
        
        // Si falla el registro con el servidor, usar modo de demostración como fallback
        console.log('Usando modo de demostración como fallback');
        
        const user: User = {
          id: Math.floor(Math.random() * 10000),
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: new Date().toISOString()
        };
        
        // Añadir campos adicionales según el rol
        if (userData.role === 'teacher') {
          user.school = userData.school || '';
          user.subjects = userData.subjects || '';
        } else if (userData.role === 'tutor') {
          user.relationship = userData.relationship || 'parent';
        } else if (userData.role === 'student') {
          user.school = userData.school || '';
        }
        
        // Token demo
        const token = `demo-${userData.role}-token-${Date.now()}`;
        
        // Guardar datos de sesión
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Actualizar estado
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        setLoading(false);
        return true;
      }
    } catch (error: any) {
      console.error('Error de registro:', error);
      setLoading(false);
      return false;
    }
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    loading,
    error,
    clearError,
    updateUserProfile,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
