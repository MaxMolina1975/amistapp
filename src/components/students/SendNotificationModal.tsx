import { useState } from 'react';
import { X, Mail, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { StudentWithStats } from '../../lib/types/student';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentWithStats[];
  preselectedStudentIds?: (string | number)[];
}

export function SendNotificationModal({ isOpen, onClose, students, preselectedStudentIds = [] }: SendNotificationModalProps) {
  const [selectedStudentIds, setSelectedStudentIds] = useState<(string | number)[]>(preselectedStudentIds);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Toggle selección de estudiante
  const toggleStudentSelection = (studentId: string | number) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter(id => id !== studentId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  // Seleccionar todos los estudiantes
  const selectAllStudents = () => {
    setSelectedStudentIds(students.map(student => student.id));
  };

  // Deseleccionar todos los estudiantes
  const deselectAllStudents = () => {
    setSelectedStudentIds([]);
  };

  // Enviar notificación
  const handleSendNotification = async () => {
    if (selectedStudentIds.length === 0) {
      setStatus({
        type: 'error',
        message: 'Debes seleccionar al menos un estudiante'
      });
      return;
    }

    if (!subject.trim()) {
      setStatus({
        type: 'error',
        message: 'El asunto no puede estar vacío'
      });
      return;
    }

    if (!message.trim()) {
      setStatus({
        type: 'error',
        message: 'El mensaje no puede estar vacío'
      });
      return;
    }

    setIsSending(true);
    setStatus({ type: null, message: '' });

    try {
      // En una aplicación real, aquí haríamos una llamada a la API
      // Simulamos el proceso con un timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Obtener emails de los tutores de los estudiantes seleccionados
      const selectedStudents = students.filter(student => selectedStudentIds.includes(student.id));
      const tutorEmails = selectedStudents
        .map(student => student.tutorEmail)
        .filter(email => email) as string[];

      // Verificar que haya al menos un email de tutor
      if (tutorEmails.length === 0) {
        throw new Error('Los estudiantes seleccionados no tienen tutores asignados con email');
      }

      // Aquí simularíamos el envío del mensaje
      console.log('Enviando notificación a:', tutorEmails);
      console.log('Asunto:', subject);
      console.log('Mensaje:', message);

      // Mostrar mensaje de éxito
      setStatus({
        type: 'success',
        message: `Notificación enviada exitosamente a ${tutorEmails.length} tutores`
      });

      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        if (status.type === 'success') {
          setSubject('');
          setMessage('');
          setSelectedStudentIds([]);
          onClose();
        }
      }, 2000);
    } catch (error) {
      // Manejar error
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al enviar la notificación'
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-violet-600" />
            Enviar Notificación a Tutores
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Lista de estudiantes (panel izquierdo) */}
          <div className="w-full md:w-1/2 p-4 border-r border-gray-200 overflow-y-auto">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Seleccionar Estudiantes</h3>
              <div className="flex space-x-2">
                <button
                  onClick={selectAllStudents}
                  className="text-xs text-violet-600 hover:text-violet-800"
                >
                  Seleccionar todos
                </button>
                <button
                  onClick={deselectAllStudents}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Deseleccionar todos
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {students.map(student => (
                <div 
                  key={student.id}
                  className={`p-3 rounded-lg flex items-center space-x-3 cursor-pointer transition-colors ${
                    selectedStudentIds.includes(student.id)
                      ? 'bg-violet-50 border border-violet-200'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleStudentSelection(student.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.includes(student.id)}
                    onChange={() => toggleStudentSelection(student.id)}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{student.name} {student.lastName}</p>
                    <p className="text-sm text-gray-500">{student.grade} {student.group}</p>
                  </div>
                  {student.tutorEmail ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Con tutor
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                      Sin tutor
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Formulario de mensaje (panel derecho) */}
          <div className="w-full md:w-1/2 p-4 flex flex-col">
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Asunto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej: Información importante sobre actividades"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                disabled={isSending}
              />
            </div>

            <div className="mb-4 flex-grow">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje a los tutores..."
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                disabled={isSending}
              />
            </div>

            {/* Variables disponibles */}
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700 mb-2">Puedes usar estas variables en tu mensaje:</p>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{'{nombre_estudiante}'}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{'{nombre_tutor}'}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{'{grado_grupo}'}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{'{fecha_actual}'}</span>
              </div>
            </div>

            {/* Status message */}
            {status.type && (
              <div className={`mb-4 p-3 rounded-md ${
                status.type === 'success' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center">
                  {status.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <p className={`text-sm ${
                    status.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {status.message}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-auto flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                disabled={isSending}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSendNotification}
                className={`px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 flex items-center ${
                  isSending ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Notificación
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
