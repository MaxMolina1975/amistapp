import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { CourseCodeGenerator } from '../../../components/teacher/CourseCodeGenerator';
import { courseCodeApi } from '../../../lib/api/courseCode';
import { teacherApi } from '../../../lib/api/teacher';
import { Course } from '../../../lib/types';

export function CourseCodeManagement() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState<boolean>(false);

  useEffect(() => {
    if (!courseId) return;
    
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener información del curso
        const courseData = await teacherApi.getCourseById(courseId);
        setCourse(courseData);
      } catch (err) {
        setError('Error al cargar la información del curso');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCourse();
  }, [courseId]);

  const handleGenerateCode = async (id: string): Promise<string> => {
    return await courseCodeApi.generateCode(id);
  };

  const handleUpdateCode = async (id: string, code: string): Promise<boolean> => {
    return await courseCodeApi.updateCode(id, code);
  };

  const handleShareCode = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareViaWhatsApp = () => {
    if (!course?.code) return;
    
    const message = `Únete a mi clase "${course.name}" en AmistApp usando el código: ${course.code}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const shareViaEmail = () => {
    if (!course?.code) return;
    
    const subject = `Invitación a la clase ${course.name} en AmistApp`;
    const body = `Hola,\n\nTe invito a unirte a mi clase "${course.name}" en AmistApp.\n\nUtiliza el siguiente código para registrarte: ${course.code}\n\nSaludos`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="animate-pulse">Cargando información del curso...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || 'No se pudo encontrar el curso'}
        </div>
        <button
          onClick={() => navigate('/teacher/courses')}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a la lista de cursos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <button
          onClick={() => navigate('/teacher/courses')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a la lista de cursos
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800">{course.name}</h1>
        <p className="text-gray-600">Gestión del código de acceso</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <CourseCodeGenerator
            courseId={courseId || ''}
            currentCode={course.code}
            onGenerateCode={handleGenerateCode}
            onUpdateCode={handleUpdateCode}
          />

          <div className="mt-6">
            <button
              onClick={handleShareCode}
              className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir Código
            </button>

            {showShareOptions && (
              <div className="mt-3 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h4 className="font-medium text-gray-800 mb-3">Compartir vía:</h4>
                <div className="space-y-2">
                  <button
                    onClick={shareViaWhatsApp}
                    className="flex items-center w-full px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={shareViaEmail}
                    className="flex items-center w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Correo Electrónico
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Instrucciones para Estudiantes</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 mb-1">Paso 1</h4>
              <p className="text-blue-700">El estudiante debe abrir la aplicación AmistApp y seleccionar "Registrarse".</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 mb-1">Paso 2</h4>
              <p className="text-blue-700">Durante el registro, debe ingresar el código del curso: <span className="font-mono font-bold">{course.code || '[Generar código]'}</span></p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-medium text-blue-800 mb-1">Paso 3</h4>
              <p className="text-blue-700">Al completar el registro, el estudiante quedará automáticamente vinculado a tu curso.</p>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Los estudiantes también pueden unirse más tarde usando la opción "Unirse a un curso" e ingresando el código.</p>
          </div>
        </div>
      </div>
    </div>
  );
}