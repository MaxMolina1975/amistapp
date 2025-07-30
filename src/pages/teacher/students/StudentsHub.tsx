import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  LineChart,
  BarChart, 
  FileText,
  Mail,
  Download
} from 'lucide-react';
import { useStudents } from '../../../lib/types/student';
import { useAuth } from '../../../lib/context/AuthContext';

export function StudentsHub() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { students, loading, error } = useStudents(currentUser?.id);
  
  // Datos para mostrar en la página
  const studentsCount = students.length;
  const atRiskStudents = students.filter(student => student.stats.emotionalIndex < 60).length;
  const highPerformingStudents = students.filter(student => student.stats.academicPerformance >= 85).length;
  const averageEmotionalIndex = studentsCount > 0 ? Math.round(
    students.reduce((sum, student) => sum + student.stats.emotionalIndex, 0) / studentsCount
  ) : 0;
  
  // Funciones para navegar a diferentes secciones
  const navigateToSection = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar estudiantes: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Estudiantes</h1>
        <p className="text-gray-600">Gestiona y monitorea a tus estudiantes</p>
      </header>
      
      {/* Resumen estadístico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Estudiantes</p>
              <p className="text-2xl font-bold text-gray-800">{studentsCount}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Índice Emocional</p>
              <p className="text-2xl font-bold text-gray-800">{averageEmotionalIndex}%</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <LineChart className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Estudiantes en Riesgo</p>
              <p className="text-2xl font-bold text-gray-800">{atRiskStudents}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <Users className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Alto Rendimiento</p>
              <p className="text-2xl font-bold text-gray-800">{highPerformingStudents}</p>
            </div>
            <div className="p-2 bg-violet-100 rounded-full">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Secciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-violet-300 transition-colors cursor-pointer"
          onClick={() => navigateToSection('/teacher/students/management')}
        >
          <div className="flex items-start mb-4">
            <div className="p-3 bg-violet-100 rounded-lg mr-4">
              <Users className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Gestión de Estudiantes</h2>
              <p className="text-gray-600">Administra la lista de estudiantes, visualiza su información y estadísticas</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Buscar</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Filtrar</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Ver estadísticas</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Contactar tutores</span>
          </div>
        </div>
        
        <div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-violet-300 transition-colors cursor-pointer"
          onClick={() => navigateToSection('/teacher/students/add')}
        >
          <div className="flex items-start mb-4">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Añadir Estudiantes</h2>
              <p className="text-gray-600">Registra nuevos estudiantes en el sistema, asigna tutores y configura sus perfiles</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Formulario</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Validación</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Asignar tutor</span>
          </div>
        </div>
      </div>
      
      {/* Acciones secundarias */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Relacionadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
          onClick={() => navigateToSection('/teacher/reports')}
        >
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <BarChart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Reportes y Análisis</h3>
            <p className="text-sm text-gray-500">Estadísticas detalladas del desempeño emocional y académico</p>
          </div>
        </div>
        
        <div 
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
          onClick={() => navigateToSection('/teacher/templates')}
        >
          <div className="p-2 bg-amber-100 rounded-lg mr-3">
            <FileText className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Plantillas de Reportes</h3>
            <p className="text-sm text-gray-500">Genera informes para tutores y administradores</p>
          </div>
        </div>
        
        <div 
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
          onClick={() => navigateToSection('/teacher/communications')}
        >
          <div className="p-2 bg-indigo-100 rounded-lg mr-3">
            <Mail className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Comunicaciones</h3>
            <p className="text-sm text-gray-500">Notificaciones y mensajes a estudiantes y tutores</p>
          </div>
        </div>
        
        <div 
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
          onClick={() => navigateToSection('/teacher/export')}
        >
          <div className="p-2 bg-teal-100 rounded-lg mr-3">
            <Download className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Exportar Datos</h3>
            <p className="text-sm text-gray-500">Descarga información en formatos CSV, PDF o Excel</p>
          </div>
        </div>
      </div>
      
      {/* Guía rápida */}
      <div className="mt-8 bg-violet-50 rounded-xl p-6 border border-violet-100">
        <h2 className="text-lg font-semibold text-violet-800 mb-3">Guía Rápida: Gestión de Estudiantes</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-violet-200 text-violet-700 text-xs mr-3 mt-0.5">1</span>
            <p className="text-violet-700">Para <strong>gestionar estudiantes</strong>, utiliza la sección "Gestión de Estudiantes" donde podrás ver toda la información.</p>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-violet-200 text-violet-700 text-xs mr-3 mt-0.5">2</span>
            <p className="text-violet-700">Si deseas <strong>añadir un nuevo estudiante</strong>, ve a "Añadir Estudiantes" y completa el formulario requerido.</p>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-violet-200 text-violet-700 text-xs mr-3 mt-0.5">3</span>
            <p className="text-violet-700">Puedes <strong>contactar a los tutores</strong> directamente desde la vista de gestión de estudiantes.</p>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-violet-200 text-violet-700 text-xs mr-3 mt-0.5">4</span>
            <p className="text-violet-700">Accede a <strong>estadísticas detalladas</strong> y <strong>reportes</strong> desde la sección correspondiente.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
