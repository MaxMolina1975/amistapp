import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  Calendar, 
  Pencil, 
  Trash2, 
  Copy, 
  Search, 
  MoreVertical,
  X,
  Check,
  RefreshCw
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  level: string;
  studentsCount: number;
  description?: string;
  createdAt: string;
  isActive: boolean;
}

// Datos de ejemplo para cursos
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Matemáticas Avanzadas',
    code: 'MAT-2024-A1',
    level: '4to grado',
    studentsCount: 24,
    description: 'Curso de matemáticas con enfoque en álgebra y geometría',
    createdAt: '2024-01-10',
    isActive: true
  },
  {
    id: '2',
    name: 'Ciencias Naturales',
    code: 'NAT-2024-B2',
    level: '3er grado',
    studentsCount: 28,
    description: 'Introducción a la biología y medio ambiente',
    createdAt: '2024-01-15',
    isActive: true
  },
  {
    id: '3',
    name: 'Historia y Sociedad',
    code: 'HIS-2024-C3',
    level: '5to grado',
    studentsCount: 22,
    description: 'Historia mundial con enfoque en civilizaciones antiguas',
    createdAt: '2024-02-05',
    isActive: true
  },
  {
    id: '4',
    name: 'Programación Básica',
    code: 'PRG-2024-D4',
    level: '6to grado',
    studentsCount: 18,
    description: 'Introducción a la programación y pensamiento computacional',
    createdAt: '2024-02-20',
    isActive: false
  },
  {
    id: '5',
    name: 'Literatura y Expresión',
    code: 'LIT-2024-E5',
    level: '4to grado',
    studentsCount: 26,
    description: 'Lectura comprensiva y expresión escrita creativa',
    createdAt: '2024-03-01',
    isActive: true
  }
];

export function CoursesManagement() {
  const navigate = useNavigate();
  const [courses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  
  // Filtrar cursos según término de búsqueda
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.level.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Ordenar cursos: primero activos, luego por fecha de creación (más recientes primero)
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (a.isActive !== b.isActive) {
      return a.isActive ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // Copiar código de curso al portapapeles
  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setShowCopiedMessage(code);
      setTimeout(() => setShowCopiedMessage(null), 2000);
    });
  };
  
  // Mostrar confirmación para eliminar curso
  const confirmDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
    setShowActionMenu(null);
  };
  
  // Eliminar curso
  const deleteCourse = () => {
    // Aquí iría la lógica para eliminar el curso de la base de datos
    // Por ahora solo cerramos el modal
    setShowDeleteConfirm(false);
    setCourseToDelete(null);
  };
  
  // Cancelar eliminación
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCourseToDelete(null);
  };
  
  // Navegar a la página de edición de curso
  const editCourse = (courseId: string) => {
    navigate(`/teacher/courses/edit/${courseId}`);
    setShowActionMenu(null);
  };
  
  // Navegar a la página de detalles del curso
  const viewCourseDetails = (courseId: string) => {
    navigate(`/teacher/courses/details/${courseId}`);
  };

  // Manejar clic en el menú de acciones
  const toggleActionMenu = (courseId: string) => {
    if (showActionMenu === courseId) {
      setShowActionMenu(null);
    } else {
      setShowActionMenu(courseId);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Cursos</h1>
        <p className="text-gray-600">Administra los cursos que impartes</p>
      </header>
      
      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <button
          onClick={() => setShowAddCourse(true)}
          className="flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-md transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Crear Curso</span>
        </button>
      </div>
      
      {/* Información de resultados */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Mostrando {sortedCourses.length} curso(s)
          {searchTerm && <span> que coinciden con "{searchTerm}"</span>}
        </p>
      </div>
      
      {/* Lista de cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCourses.map((course) => (
          <div 
            key={course.id}
            className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all ${
              course.isActive ? 'border-gray-200 hover:border-violet-200' : 'border-gray-100 hover:border-gray-300 opacity-80'
            }`}
          >
            <div 
              className="p-4 cursor-pointer" 
              onClick={() => viewCourseDetails(course.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-800">{course.name}</h3>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActionMenu(course.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                  
                  {/* Menú de acciones */}
                  {showActionMenu === course.id && (
                    <div className="absolute right-0 z-10 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            editCourse(course.id);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Pencil className="h-4 w-4 mr-2 text-gray-500" />
                          Editar curso
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/teacher/courses/code/${course.id}`);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <RefreshCw className="h-4 w-4 mr-2 text-gray-500" />
                          Gestionar código
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyCodeToClipboard(course.code);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Copy className="h-4 w-4 mr-2 text-gray-500" />
                          Copiar código
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteCourse(course);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                          Eliminar curso
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <div 
                  className={`text-xs px-2 py-1 rounded-full ${
                    course.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {course.isActive ? 'Activo' : 'Inactivo'}
                </div>
                <span className="text-sm text-gray-500">{course.level}</span>
              </div>
              
              <div className="flex items-center mb-3">
                <div className="relative flex-grow group" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-mono mr-2">{course.code}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        copyCodeToClipboard(course.code);
                      }}
                      className="text-gray-400 hover:text-violet-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  {showCopiedMessage === course.code && (
                    <div className="absolute -top-8 left-0 bg-black text-white text-xs py-1 px-2 rounded">
                      ¡Código copiado!
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.studentsCount} estudiantes</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mensaje si no hay cursos */}
      {sortedCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-violet-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No se encontraron cursos</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `No hay cursos que coincidan con "${searchTerm}". Prueba con otro término de búsqueda.` 
              : 'Aún no has creado ningún curso. ¡Comienza ahora mismo!'}
          </p>
          <button
            onClick={() => setShowAddCourse(true)}
            className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Crear Primer Curso
          </button>
        </div>
      )}
      
      {/* Modal de confirmación para eliminar curso */}
      {showDeleteConfirm && courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Eliminar Curso</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas eliminar el curso <span className="font-semibold">{courseToDelete.name}</span>? 
              Esta acción no se puede deshacer y eliminará todos los datos relacionados.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={deleteCourse}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para añadir curso (simplificado, se implementaría completamente después) */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Crear Nuevo Curso</h3>
              <button 
                onClick={() => setShowAddCourse(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Completa el formulario para crear un nuevo curso. Los estudiantes podrán unirse usando el código generado.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="course-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Curso <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="course-name"
                  placeholder="Ej: Matemáticas Avanzadas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              
              <div>
                <label htmlFor="course-level" className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel o Grado <span className="text-red-500">*</span>
                </label>
                <select
                  id="course-level"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Selecciona un nivel</option>
                  <option value="1ro">1er grado</option>
                  <option value="2do">2do grado</option>
                  <option value="3ro">3er grado</option>
                  <option value="4to">4to grado</option>
                  <option value="5to">5to grado</option>
                  <option value="6to">6to grado</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="course-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="course-description"
                  placeholder="Describe brevemente el contenido del curso..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCourse(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí iría la lógica para guardar el curso
                  setShowAddCourse(false);
                }}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center"
              >
                <Check className="h-4 w-4 mr-2" />
                Crear Curso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
