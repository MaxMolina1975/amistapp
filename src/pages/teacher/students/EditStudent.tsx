import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Home,
  Users,
  AlertTriangle,
  Loader
} from 'lucide-react';
import { StudentWithStats } from '../../../lib/types/student';
import { useAuth } from '../../../lib/context/AuthContext';
import { studentApi } from '../../../lib/api/student';

export function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentWithStats | null>(null);
  
  // Estado del formulario
  const [studentData, setStudentData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    grade: '1ro',
    group: 'A',
    tutorName: '',
    tutorEmail: '',
    tutorPhone: '',
    observations: ''
  });
  
  // Opciones para los selectores
  const gradeOptions = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
  const groupOptions = ['A', 'B', 'C', 'D'];
  
  // Obtener token de autenticación
  const { token } = useAuth();

  // Cargar datos del estudiante
  useEffect(() => {
    const loadStudent = async () => {
      try {
        if (!token) {
          throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
        }

        // Obtener estudiante desde la API
        const foundStudent = await studentApi.getStudentById(token, id);
        
        if (!foundStudent) {
          throw new Error('Estudiante no encontrado');
        }
        
        setStudent(foundStudent);
        
        // Inicializar el formulario con los datos del estudiante
        setStudentData({
          name: foundStudent.name,
          lastName: foundStudent.lastName,
          email: foundStudent.email || '',
          phone: foundStudent.phone || '',
          birthDate: foundStudent.birthDate || '',
          address: foundStudent.address || '',
          grade: foundStudent.grade,
          group: foundStudent.group,
          tutorName: foundStudent.tutorName || '',
          tutorEmail: foundStudent.tutorEmail || '',
          tutorPhone: foundStudent.tutorPhone || '',
          observations: foundStudent.observations || ''
        });
      } catch (error) {
        if (error instanceof Error) {
          setFormError(error.message);
        } else {
          setFormError('Error al cargar datos del estudiante');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStudent();
  }, [id]);
  
  // Cambiar valores del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Validación básica
      if (!studentData.name || !studentData.lastName || !studentData.email) {
        throw new Error('Por favor completa los campos obligatorios: nombre, apellido y correo electrónico');
      }
      
      if (!token) {
        throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
      }

      if (!id) {
        throw new Error('ID de estudiante no válido');
      }
      
      // Crear objeto de estudiante para enviar a la API
      const updatedStudent = {
        name: studentData.name,
        lastName: studentData.lastName,
        email: studentData.email,
        phone: studentData.phone,
        birthDate: studentData.birthDate,
        address: studentData.address,
        grade: studentData.grade,
        group: studentData.group,
        tutorName: studentData.tutorName,
        tutorEmail: studentData.tutorEmail,
        tutorPhone: studentData.tutorPhone,
        observations: studentData.observations
      };
      
      // Enviar a la API
      const result = await studentApi.updateStudent(token, id, updatedStudent);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Redirigir a la lista de estudiantes con mensaje de éxito
      navigate('/teacher/students/management', { 
        state: { successMessage: 'Estudiante actualizado correctamente' } 
      });
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('Hubo un error al actualizar el estudiante. Inténtalo de nuevo.');
      }
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 text-violet-600 animate-spin mb-2" />
          <p className="text-gray-600">Cargando datos del estudiante...</p>
        </div>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg flex flex-col items-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Estudiante no encontrado</h2>
          <p className="text-gray-600 mb-4">No se pudo encontrar el estudiante con el ID especificado.</p>
          <button
            onClick={() => navigate('/teacher/students/management')}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editar Estudiante</h1>
        <p className="text-gray-600">Modifica la información de {student.name} {student.lastName}</p>
      </header>
      
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        {formError && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{formError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información personal */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={studentData.name}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={studentData.lastName}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={studentData.email}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={studentData.phone}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={studentData.birthDate}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={studentData.address}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <Home className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Información académica */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Información Académica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                  Grado <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="grade"
                    name="grade"
                    value={studentData.grade}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                    required
                  >
                    {gradeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="group"
                    name="group"
                    value={studentData.group}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                    required
                  >
                    {groupOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Información del tutor */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Información del Tutor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tutorName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Tutor
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="tutorName"
                    name="tutorName"
                    value={studentData.tutorName}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="tutorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico del Tutor
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="tutorEmail"
                    name="tutorEmail"
                    value={studentData.tutorEmail}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="tutorPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono del Tutor
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="tutorPhone"
                    name="tutorPhone"
                    value={studentData.tutorPhone}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Observaciones */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Observaciones</h2>
            <div>
              <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios adicionales
              </label>
              <textarea
                id="observations"
                name="observations"
                rows={4}
                value={studentData.observations}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Incluye cualquier información adicional relevante sobre el estudiante..."
              />
            </div>
          </div>
          
          {/* Estadísticas actuales - Solo lectura */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas Actuales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-violet-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Índice Emocional</p>
                <p className="text-xl font-semibold text-violet-700">{student.stats.emotionalIndex}%</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Puntos Acumulados</p>
                <p className="text-xl font-semibold text-blue-700">{student.stats.points}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Logros Desbloqueados</p>
                <p className="text-xl font-semibold text-green-700">{student.stats.achievementsCount}</p>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/teacher/students/management')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 flex items-center"
            >
              <X className="h-5 w-5 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Save className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
