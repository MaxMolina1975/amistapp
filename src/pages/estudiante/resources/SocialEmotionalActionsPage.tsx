import { useState } from 'react';
import { ArrowLeft, HelpCircle, Download } from 'lucide-react';
// Importamos el componente de acciones socioemocionales
import SocialEmotionalActions, { SocialEmotionalAction } from '../../../components/teacher/SocialEmotionalActions';
import { useNavigate } from 'react-router-dom';

export function SocialEmotionalActionsPage() {
  const navigate = useNavigate();
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
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
            <p className="text-gray-600">Recursos para tu bienestar emocional</p>
          </div>
        </div>
      </header>

      <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <HelpCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">¿Qué son las acciones socioemocionales?</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Las acciones socioemocionales son comportamientos positivos que contribuyen a tu desarrollo personal y social. Estas acciones te ayudan a mejorar tus habilidades para manejar emociones, relacionarte con los demás y tomar decisiones responsables.</p>
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
                Las acciones socioemocionales son comportamientos positivos que contribuyen a tu desarrollo personal y social. Estas acciones están organizadas en tres competencias principales:
              </p>

              <div className="pl-4 border-l-4 border-blue-200 py-2">
                <h3 className="font-semibold text-blue-800">Regulación emocional</h3>
                <p className="text-sm">Capacidad para manejar tus emociones de forma apropiada, controlar impulsos, y mantener la calma en situaciones difíciles.</p>
              </div>

              <div className="pl-4 border-l-4 border-green-200 py-2">
                <h3 className="font-semibold text-green-800">Competencia social</h3>
                <p className="text-sm">Habilidades para establecer relaciones positivas, comunicarte efectivamente, trabajar en equipo y resolver conflictos.</p>
              </div>

              <div className="pl-4 border-l-4 border-purple-200 py-2">
                <h3 className="font-semibold text-purple-800">Conciencia emocional</h3>
                <p className="text-sm">Capacidad para reconocer y comprender tus propias emociones y las de los demás, expresar sentimientos y desarrollar empatía.</p>
              </div>

              <h3 className="font-semibold mt-4">¿Por qué son importantes?</h3>
              <p>
                Desarrollar estas habilidades te ayudará a:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Manejar mejor tus emociones y el estrés</li>
                <li>Mejorar tus relaciones con compañeros, profesores y familia</li>
                <li>Tomar decisiones más responsables</li>
                <li>Resolver conflictos de manera pacífica</li>
                <li>Aumentar tu bienestar general y rendimiento académico</li>
              </ul>

              <h3 className="font-semibold mt-4">¿Cómo puedo practicarlas?</h3>
              <p>
                Puedes practicar estas acciones en tu vida diaria, tanto en la escuela como en casa. Algunas sugerencias:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Identifica y nombra tus emociones cuando las sientas</li>
                <li>Practica técnicas de respiración cuando te sientas estresado</li>
                <li>Escucha activamente a tus compañeros</li>
                <li>Ofrece ayuda a quien lo necesite</li>
                <li>Participa en actividades grupales y colaborativas</li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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