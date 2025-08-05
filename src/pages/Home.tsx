import { GraduationCap, Users, Heart, Shield, Gift, Check, BookOpen } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { PromotionCarousel } from '../components/carousel';
import '../components/carousel/styles/carousel.css';
// Corregir la importación del logo
import logoImage from '../assets/images/logo.png';
import { useAuth } from '../lib/context/AuthContext';
import { useEffect } from 'react';

export function Home() {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirigir automáticamente al usuario a su panel según su rol
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'teacher' || currentUser.role === 'admin') {
        navigate('/teacher/dashboard');
      } else if (currentUser.role === 'student') {
        navigate('/estudiante/dashboard');
      } else if (currentUser.role === 'tutor') {
        navigate('/tutor/dashboard');
      }
    }
  }, [isAuthenticated, currentUser, navigate]);
  
  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 pt-12 pb-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            {/* Usar el logo con manejo de errores */}
            <img 
              src={logoImage || '/logoapp.png'} 
              alt="AMISTAPP Logo" 
              className="h-[6.6rem] object-contain" 
              onError={(e) => {
                // Si falla la carga, usar el logo de la carpeta pública
                e.currentTarget.src = '/logoapp.png';
              }}
            />
          </div>
          <p className="text-blue-100 mb-8">
            Fortaleciendo lazos, desarrollando educación socioemocional y  construyendo un ambiente escolar positivo en el aula.
          </p>
          <div className="flex justify-center space-x-2">
            <Heart className="w-6 h-6 text-pink-300" />
            <Users className="w-6 h-6 text-blue-300" />
            <GraduationCap className="w-6 h-6 text-green-300" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-8">
        <div className="max-w-xl mx-auto">
          {/* Access Cards */}
          <div className="space-y-4 mb-8 relative z-10">
            <Link
              to="/estudiante"
              className="block p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-violet-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Soy Estudiante</h3>
                  <p className="text-sm text-gray-600">Accede a tu espacio de aprendizaje</p>
                </div>
              </div>
            </Link>

            <Link
              to="/login"
              className="block p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-violet-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Soy Docente</h3>
                  <p className="text-sm text-gray-600">Gestiona tu clase y estudiantes</p>
                </div>
              </div>
            </Link>

            <Link
              to="/login-tutor"
              className="block p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-violet-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Soy Tutor</h3>
                  <p className="text-sm text-gray-600">Acompaña el desarrollo de tus hijos</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Promotion Carousel */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Novedades y Características</h2>
            <PromotionCarousel />
          </div>

          {/* Features Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Características</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Seguimiento Emocional</h3>
                <p className="text-xs text-gray-500">Monitorea el bienestar de los estudiantes</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Sistema de Puntos</h3>
                <p className="text-xs text-gray-500">Recompensa el comportamiento positivo</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Reportes Anónimos</h3>
                <p className="text-xs text-gray-500">Canal seguro de comunicación</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Gift className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Premios Personalizados</h3>
                <p className="text-xs text-gray-500">Catálogo de recompensas adaptable</p>
              </div>
            </div>
          </section>

          {/* Info Section */}
          <section className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">¿Por qué usarlo?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Mejora el ambiente escolar y fortalece las relaciones interpersonales</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Sistema de recompensas que motiva el comportamiento positivo</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Herramientas para la detección temprana de problemas</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}