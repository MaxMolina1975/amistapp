import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../config/apiConfig';

// Crear el contexto con un valor predeterminado
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
// Debe ser llamado dentro de componentes funcionales
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Componente proveedor del contexto
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (token) {
          // Configurar el token en los headers para todas las solicitudes
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verificar si el token es válido haciendo una petición al servidor
          const response = await axios.get(`${apiConfig.API_URL}/auth/profile`);
          
          // Verificar que response.data y response.data.user existan antes de acceder a sus propiedades
          if (response.data && response.data.user && response.data.user.role === 'admin') {
            setCurrentUser(response.data.user);
          } else {
            // Si el usuario no es admin o no existe, limpiar el token
            localStorage.removeItem('admin_token');
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        localStorage.removeItem('admin_token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setError(null);
      // Usar la ruta de login general, no la de admin
      const response = await axios.post(`${apiConfig.API_URL}/auth/login`, { email: email.trim(), password });
      
      // Verificar que response.data contenga token
      if (!response.data || !response.data.token) {
        throw new Error('Respuesta de autenticación inválida: falta token');
      }
      
      const { token, user } = response.data;
      
      // Verificar que el usuario tenga la información necesaria
      if (!user || typeof user !== 'object') {
        throw new Error('Respuesta de autenticación inválida: información de usuario incompleta');
      }
      
      // Verificar que el usuario sea administrador
      if (user.role !== 'admin') {
        throw new Error('Acceso denegado. Solo administradores pueden acceder.');
      }
      
      // Guardar el token en localStorage como string
      localStorage.setItem('admin_token', token);
      
      // Configurar el token en los headers para todas las solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('admin_token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    loading,
    error,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}