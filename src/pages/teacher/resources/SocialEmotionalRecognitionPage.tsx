import { useState } from 'react';
import { ArrowLeft, HelpCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StudentSocialEmotionalRecognition } from '../../../components/teacher/StudentSocialEmotionalRecognition';
import { SocialEmotionalAction } from '../../../components/teacher/SocialEmotionalActions';



export function SocialEmotionalRecognitionPage() {
  const navigate = useNavigate();
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Función para manejar el envío de reconocimientos
  const handleSendRecognition = async (studentId: string, action: SocialEmotionalAction, message: string) => {
    // Aquí se implementaría la lógica para enviar el reconocimiento a la API
    console.log('Enviando reconocimiento:', { studentId, action, message });
    
    // Simulación de una llamada a API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-6">
      <header className="mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reconocimiento Socioemocional</h1>
            <p className="text-gray-600">Reconoce las acciones positivas de tus estudiantes</p>
          </div>
        </div>
      </header>

      <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <Award className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">¿Cómo funciona el reconocimiento socioemocional?</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Esta herramienta te permite reconocer acciones socioemocionales positivas en tus estudiantes y enviarles un mensaje personalizado de felicitación.</p>
              <button 
                onClick={() => setShowInfoModal(true)}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Más información
              </button>
            </div>
          </div>
        </div>
      </div>

      <StudentSocialEmotionalRecognition 
        onSendRecognition={handleSendRecognition}
      />

      {/* Modal de información */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800">Sobre el Reconocimiento Socioemocional</h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                El reconocimiento socioemocional es una herramienta pedagógica que permite a los docentes identificar y valorar las acciones positivas que realizan los estudiantes en el ámbito socioemocional.
              </p>

              <h3 className="font-semibold mt-4">Beneficios del reconocimiento socioemocional:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fortalece la autoestima y motivación de los estudiantes</li>
                <li>Promueve un clima escolar positivo</li>
                <li>Refuerza comportamientos deseados</li>
                <li>Desarrolla habilidades socioemocionales clave para la vida</li>
                <li>Mejora el rendimiento académico</li>
              </ul>

              <h3 className="font-semibold mt-4">¿Cómo utilizar esta herramienta?</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Selecciona un estudiante de la lista</li>
                <li>Elige la acción socioemocional que deseas reconocer</li>
                <li>Personaliza el mensaje si lo deseas</li>
                <li>Envía el reconocimiento</li>
              </ol>

              <p className="mt-4">
                Cada acción está clasificada según la competencia socioemocional que desarrolla (regulación emocional, competencia social o conciencia emocional) y su nivel de complejidad (bajo, medio o alto).
              </p>

              <p>
                Los mensajes predefinidos están diseñados para reforzar positivamente la acción realizada, pero puedes personalizarlos para hacerlos más significativos para cada estudiante.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}