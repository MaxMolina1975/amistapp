import { useState } from 'react';
import { ArrowLeft, HelpCircle, Download } from 'lucide-react';
// Actualizar la importación para usar la exportación por defecto
import SocialEmotionalActions, { SocialEmotionalAction } from '../../../components/teacher/SocialEmotionalActions';
import { useNavigate } from 'react-router-dom';

export function SocialEmotionalActionsPage() {
  const navigate = useNavigate();
  const [showInfoModal, setShowInfoModal] = useState(false);

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
            <h1 className="text-2xl font-bold text-gray-800">Acciones Socioemocionales</h1>
            <p className="text-gray-600">Guía de acciones positivas para reconocer en tus estudiantes</p>
          </div>
        </div>
      </header>

      <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <HelpCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">¿Cómo usar esta tabla?</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Esta tabla muestra acciones socioemocionales positivas que puedes reconocer en tus estudiantes. Cada acción está asociada a una competencia socioemocional, puntos y un nivel de dificultad.</p>
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

      <div className="mb-6 flex justify-end">
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
          <Download className="w-4 h-4 mr-2 text-gray-600" />
          <span className="text-gray-700">Descargar PDF</span>
        </button>
      </div>

      <SocialEmotionalActions />

      {/* Modal de información */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800">Sobre las Acciones Socioemocionales</h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                Las acciones socioemocionales son comportamientos positivos que contribuyen al desarrollo de habilidades socioemocionales en los estudiantes. Estas acciones están organizadas en tres competencias principales:
              </p>

              <div className="pl-4 border-l-4 border-blue-200 py-2">
                <h3 className="font-semibold text-blue-800">Regulación emocional</h3>
                <p className="text-sm">Capacidad para manejar las emociones de forma apropiada, controlar impulsos, y mantener la calma en situaciones difíciles.</p>
              </div>

              <div className="pl-4 border-l-4 border-green-200 py-2">
                <h3 className="font-semibold text-green-800">Competencia social</h3>
                <p className="text-sm">Habilidades para establecer relaciones positivas, comunicarse efectivamente, trabajar en equipo y resolver conflictos.</p>
              </div>

              <div className="pl-4 border-l-4 border-purple-200 py-2">
                <h3 className="font-semibold text-purple-800">Conciencia emocional</h3>
                <p className="text-sm">Capacidad para reconocer y comprender las propias emociones y las de los demás, expresar sentimientos y desarrollar empatía.</p>
              </div>

              <h3 className="font-semibold mt-4">Niveles de competencia</h3>
              <p>
                Cada acción está clasificada según su nivel de dificultad o complejidad:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-medium text-blue-700">Bajo:</span> Acciones básicas que representan los primeros pasos en el desarrollo de una competencia.</li>
                <li><span className="font-medium text-amber-700">Medio:</span> Acciones que requieren un nivel intermedio de habilidad socioemocional.</li>
                <li><span className="font-medium text-green-700">Alto:</span> Acciones avanzadas que demuestran un alto nivel de desarrollo socioemocional.</li>
              </ul>

              <h3 className="font-semibold mt-4">Relación con IDPS</h3>
              <p>
                Los Indicadores de Desarrollo Personal y Social (IDPS) son mediciones complementarias a los resultados académicos que realiza la Agencia de Calidad de la Educación en Chile. Las acciones socioemocionales de esta tabla están alineadas con estos indicadores, especialmente con:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-medium">Clima de convivencia escolar</span></li>
                <li><span className="font-medium">Autoestima académica y motivación escolar</span></li>
                <li><span className="font-medium">Participación y formación ciudadana</span></li>
              </ul>
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