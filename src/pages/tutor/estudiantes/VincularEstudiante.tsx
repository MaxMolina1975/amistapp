import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/context/AuthContext';
import {
  ArrowLeft,
  Search,
  UserPlus,
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// Datos de ejemplo para estudiantes disponibles para vincular
const availableStudents = [
  { id: 201, name: 'Carlos', lastName: 'Méndez', grade: '5to Primaria', code: 'EST2025201' },
  { id: 202, name: 'Sofía', lastName: 'Gutiérrez', grade: '4to Primaria', code: 'EST2025202' },
  { id: 203, name: 'Javier', lastName: 'Rodríguez', grade: '6to Primaria', code: 'EST2025203' },
  { id: 204, name: 'Ana', lastName: 'Martínez', grade: '3ro Primaria', code: 'EST2025204' },
  { id: 205, name: 'Miguel', lastName: 'Sánchez', grade: '5to Primaria', code: 'EST2025205' },
];

export function VincularEstudiante() {
  const navigate = useNavigate();
  const { currentUser: _ } = useAuth(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchMethod, setSearchMethod] = useState<'list' | 'code'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Filtrar estudiantes basado en la búsqueda
  const filteredStudents = availableStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelection = (studentId: number) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleBack = () => {
    navigate('/tutor/estudiantes');
  };

  const handleVincular = () => {
    setIsLoading(true);
    
    // Simulamos una petición al servidor
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulamos éxito
      if (searchMethod === 'list' && selectedStudents.length > 0) {
        setRequestStatus('success');
      } else if (searchMethod === 'code' && studentCode.trim() !== '') {
        // Verificamos si el código existe
        const studentExists = availableStudents.some(s => s.code === studentCode.trim());
        if (studentExists) {
          setRequestStatus('success');
        } else {
          setRequestStatus('error');
          setErrorMessage('El código de estudiante no existe. Verifica e intenta nuevamente.');
        }
      } else {
        setRequestStatus('error');
        setErrorMessage('Por favor, selecciona al menos un estudiante o ingresa un código válido.');
      }
    }, 1500);
  };

  return (
    <div className="p-4">
      {/* Encabezado con botón de regreso */}
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBack}
          className="mr-3 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vincular Estudiante</h1>
          <p className="text-gray-600">Asocia estudiantes a tu perfil de tutor</p>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6">
          <div className="space-y-4">
            {/* Pestañas de método de búsqueda */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`px-4 py-2 font-medium ${
                  searchMethod === 'list' 
                    ? 'text-violet-600 border-b-2 border-violet-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setSearchMethod('list')}
              >
                Buscar por nombre
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  searchMethod === 'code' 
                    ? 'text-violet-600 border-b-2 border-violet-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setSearchMethod('code')}
              >
                Usar código de vinculación
              </button>
            </div>

            {searchMethod === 'list' ? (
              <>
                {/* Búsqueda por lista */}
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Buscar estudiante por nombre, apellido o grado..."
                    className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>

                {/* Lista de estudiantes */}
                <div className="mt-4">
                  {filteredStudents.length > 0 ? (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {filteredStudents.map(student => (
                        <div 
                          key={student.id}
                          className={`p-3 rounded-lg border ${
                            selectedStudents.includes(student.id) 
                              ? 'border-violet-300 bg-violet-50' 
                              : 'border-gray-100 hover:border-gray-200'
                          } cursor-pointer transition-colors`}
                          onClick={() => handleStudentSelection(student.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm text-blue-600 font-medium">
                                  {student.name[0]}{student.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{student.name} {student.lastName}</p>
                                <p className="text-sm text-gray-500">
                                  {student.grade} | Código: {student.code}
                                </p>
                              </div>
                            </div>
                            
                            <div className={`w-6 h-6 rounded-full ${
                              selectedStudents.includes(student.id) 
                                ? 'bg-violet-500 text-white flex items-center justify-center' 
                                : 'border border-gray-300'
                            }`}>
                              {selectedStudents.includes(student.id) && (
                                <span className="text-white font-bold text-xs">✓</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No se encontraron estudiantes</h3>
                      <p className="text-gray-500">
                        {searchTerm ? `No hay coincidencias para "${searchTerm}"` : 'Ingresa un término de búsqueda'}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Búsqueda por código */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de vinculación del estudiante
                  </label>
                  <input 
                    type="text"
                    placeholder="Ingresa el código (ejemplo: EST2025123)"
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Este código se puede obtener del perfil del estudiante o de la administración escolar.
                  </p>
                </div>
              </>
            )}

            {/* Estado de la solicitud */}
            {requestStatus === 'success' && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-100 flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">¡Vinculación exitosa!</h4>
                  <p className="text-sm text-green-700">
                    Los estudiantes seleccionados han sido vinculados correctamente a tu perfil de tutor.
                  </p>
                </div>
              </div>
            )}

            {requestStatus === 'error' && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Error en la vinculación</h4>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end pt-2">
              <button 
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 mr-3"
              >
                Cancelar
              </button>
              <button 
                onClick={handleVincular}
                disabled={isLoading || (searchMethod === 'list' && selectedStudents.length === 0) || (searchMethod === 'code' && !studentCode)}
                className={`px-4 py-2 ${
                  isLoading || (searchMethod === 'list' && selectedStudents.length === 0) || (searchMethod === 'code' && !studentCode)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-violet-600 text-white hover:bg-violet-700'
                } rounded-lg flex items-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    <span>Vincular {searchMethod === 'list' ? `(${selectedStudents.length})` : ''}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-4">
        <h3 className="font-medium text-blue-800 mb-2">¿Cómo funciona la vinculación?</h3>
        <p className="text-sm text-blue-700 mb-3">
          Como tutor, puedes vincular estudiantes a tu perfil para realizar seguimiento de su progreso socioemocional y académico.
        </p>
        <ol className="text-sm text-blue-700 space-y-2 list-decimal pl-4">
          <li>Busca al estudiante por nombre, apellido o grado, o utiliza su código de vinculación.</li>
          <li>Selecciona los estudiantes que deseas vincular a tu perfil.</li>
          <li>Haz clic en "Vincular" para completar el proceso.</li>
          <li>Una vez vinculados, podrás ver su progreso y recibir notificaciones sobre su desarrollo.</li>
        </ol>
      </div>
    </div>
  );
}

export default VincularEstudiante;
