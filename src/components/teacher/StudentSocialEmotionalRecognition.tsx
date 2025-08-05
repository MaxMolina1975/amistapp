import { useState, useEffect } from 'react';
import { Search, Filter, Award, Send, User, Users } from 'lucide-react';
import { SocialEmotionalAction, socialEmotionalActions } from './SocialEmotionalActions';
import { useStudents } from '../../lib/types/student';
import { useAuth } from '../../lib/context/AuthContext';

// Tipo para los estudiantes (simplificado para este componente)
interface Student {
  id: string;
  name: string;
  avatarUrl?: string;
}

// Props para el componente
interface StudentSocialEmotionalRecognitionProps {
  students?: Student[];
  onSendRecognition?: (studentId: string, action: SocialEmotionalAction, message: string) => Promise<void>;
}



// Componente principal
export function StudentSocialEmotionalRecognition({ 
  students, 
  onSendRecognition 
}: StudentSocialEmotionalRecognitionProps) {
  const { currentUser } = useAuth();
  const { students: fetchedStudents, loading: studentsLoading, error: studentsError, refetch: refetchStudents } = useStudents(currentUser?.id);
  
  // Use provided students or fetch them if not provided
  const studentsToUse = students || fetchedStudents;
  // Estados
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedAction, setSelectedAction] = useState<SocialEmotionalAction | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [searchStudentTerm, setSearchStudentTerm] = useState('');
  const [searchActionTerm, setSearchActionTerm] = useState('');
  const [selectedCompetence, setSelectedCompetence] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Loading and error handling
  if (studentsLoading && !students) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <span className="ml-3 text-gray-600">Cargando estudiantes...</span>
        </div>
      </div>
    );
  }

  if (studentsError && !students) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar los estudiantes</h3>
            <p className="text-gray-600 mb-4">No se pudieron cargar los datos de los estudiantes.</p>
            <button
              onClick={refetchStudents}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar estudiantes según el término de búsqueda
  const filteredStudents = studentsToUse.filter(student =>
    student.name.toLowerCase().includes(searchStudentTerm.toLowerCase())
  );

  // Filtrar acciones según los criterios seleccionados
  const filteredActions = socialEmotionalActions.filter(action => {
    const matchesSearch = 
      action.action.toLowerCase().includes(searchActionTerm.toLowerCase()) ||
      action.message.toLowerCase().includes(searchActionTerm.toLowerCase());
    const matchesCompetence = selectedCompetence === 'all' || action.competence === selectedCompetence;
    const matchesLevel = selectedLevel === 'all' || action.level === selectedLevel;
    
    return matchesSearch && matchesCompetence && matchesLevel;
  });

  // Actualizar el mensaje personalizado cuando se selecciona una acción
  useEffect(() => {
    if (selectedAction) {
      setCustomMessage(selectedAction.message);
    } else {
      setCustomMessage('');
    }
  }, [selectedAction]);

  // Manejar el envío del reconocimiento
  const handleSendRecognition = async () => {
    if (!selectedStudent || !selectedAction) {
      setErrorMessage('Por favor, selecciona un estudiante y una acción');
      return;
    }

    setIsSending(true);
    setErrorMessage('');

    try {
      if (onSendRecognition) {
        await onSendRecognition(selectedStudent.id, selectedAction, customMessage);
      }
      
      // Simulación de éxito si no hay función de envío real
      setSuccessMessage(`Reconocimiento enviado a ${selectedStudent.name}`);
      
      // Resetear selecciones después del envío exitoso
      setTimeout(() => {
        setSelectedStudent(null);
        setSelectedAction(null);
        setCustomMessage('');
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Error al enviar el reconocimiento. Inténtalo de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  // Mapeo de competencias para mostrar en la UI
  const competenceLabels: Record<string, { name: string, color: string }> = {
    'regulacion-emocional': { name: 'Regulación emocional', color: 'blue' },
    'competencia-social': { name: 'Competencia social', color: 'green' },
    'conciencia-emocional': { name: 'Conciencia emocional', color: 'purple' }
  };

  // Mapeo de niveles para mostrar en la UI
  const levelLabels: Record<string, { name: string, color: string }> = {
    'bajo': { name: 'Bajo', color: 'blue' },
    'medio': { name: 'Medio', color: 'amber' },
    'alto': { name: 'Alto', color: 'green' }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Reconocimiento de Acciones Socioemocionales
        </h2>
        <p className="text-gray-600">
          Reconoce las acciones positivas de tus estudiantes y envíales un mensaje de felicitación
        </p>
      </div>

      {/* Mensajes de éxito o error */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de selección de estudiante */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Seleccionar Estudiante
          </h3>
          
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={searchStudentTerm}
              onChange={(e) => setSearchStudentTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredStudents.length > 0 ? (
              <ul className="space-y-2">
                {filteredStudents.map((student) => (
                  <li key={student.id}>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${selectedStudent?.id === student.id ? 'bg-violet-100 text-violet-700' : 'hover:bg-gray-100'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-3 overflow-hidden">
                        {student.avatarUrl ? (
                          <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-full h-full p-1 text-gray-500" />
                        )}
                      </div>
                      <span>{student.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Users className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                <p>No se encontraron estudiantes</p>
              </div>
            )}
          </div>

          {selectedStudent && (
            <div className="mt-4 p-3 bg-violet-50 rounded-lg">
              <p className="text-sm font-medium text-violet-700">Estudiante seleccionado:</p>
              <p className="text-violet-900">{selectedStudent.name}</p>
            </div>
          )}
        </div>

        {/* Sección de selección de acción */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Seleccionar Acción Socioemocional
          </h3>

          <div className="space-y-3 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar acción..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                value={searchActionTerm}
                onChange={(e) => setSearchActionTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por competencia
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  value={selectedCompetence}
                  onChange={(e) => setSelectedCompetence(e.target.value)}
                >
                  <option value="all">Todas las competencias</option>
                  <option value="regulacion-emocional">Regulación emocional</option>
                  <option value="competencia-social">Competencia social</option>
                  <option value="conciencia-emocional">Conciencia emocional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por nivel
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option value="all">Todos los niveles</option>
                  <option value="bajo">Nivel bajo</option>
                  <option value="medio">Nivel medio</option>
                  <option value="alto">Nivel alto</option>
                </select>
              </div>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredActions.length > 0 ? (
              <ul className="space-y-2">
                {filteredActions.map((action) => (
                  <li key={action.id}>
                    <button
                      onClick={() => setSelectedAction(action)}
                      className={`w-full text-left px-3 py-2 rounded-lg ${selectedAction?.id === action.id ? 'bg-violet-100 text-violet-700' : 'hover:bg-gray-100'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{action.action}</span>
                        <span className="text-sm text-violet-600">{action.points} pts</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className={`px-2 py-0.5 rounded-full bg-${competenceLabels[action.competence].color}-100 text-${competenceLabels[action.competence].color}-700 mr-2`}>
                          {competenceLabels[action.competence].name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full bg-${levelLabels[action.level].color}-100 text-${levelLabels[action.level].color}-700`}>
                          {levelLabels[action.level].name}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Filter className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                <p>No se encontraron acciones</p>
                <p className="text-sm">Intenta cambiar los filtros o términos de búsqueda.</p>
              </div>
            )}
          </div>

          {selectedAction && (
            <div className="mt-4 p-3 bg-violet-50 rounded-lg">
              <p className="text-sm font-medium text-violet-700">Acción seleccionada:</p>
              <p className="text-violet-900">{selectedAction.action}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sección de mensaje personalizado */}
      {(selectedStudent && selectedAction) && (
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Mensaje de Reconocimiento
          </h3>
          
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent min-h-[120px]"
            placeholder="Escribe un mensaje personalizado..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSendRecognition}
              disabled={isSending || !customMessage.trim()}
              className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Reconocimiento
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          <p className="mb-1"><strong>Regulación emocional:</strong> Capacidad para manejar las emociones de forma apropiada.</p>
          <p className="mb-1"><strong>Competencia social:</strong> Habilidades para establecer relaciones positivas.</p>
          <p className="mb-1"><strong>Conciencia emocional:</strong> Capacidad para reconocer y comprender las emociones.</p>
        </div>
      </div>
    </div>
  );
}