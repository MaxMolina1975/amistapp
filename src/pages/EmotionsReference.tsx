import React from 'react';
import { 
  Heart, 
  Info, 
  BarChart, 
  Calendar, 
  ThumbsUp, 
  Frown, 
  Smile, 
  Meh,
  Star,
  TrendingUp,
  MessageCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export function EmotionsReference() {
  // Ejemplos de emociones para mostrar en la guía
  const emotionExamples = [
    { type: 'happy', icon: Smile, label: 'Feliz', color: 'green', description: 'El estudiante se siente contento, optimista y satisfecho.' },
    { type: 'calm', icon: Meh, label: 'Tranquilo', color: 'blue', description: 'El estudiante se siente en paz, relajado y sereno.' },
    { type: 'motivated', icon: ThumbsUp, label: 'Motivado', color: 'yellow', description: 'El estudiante se siente entusiasmado, con energía y ganas de participar.' },
    { type: 'sad', icon: Frown, label: 'Triste', color: 'purple', description: 'El estudiante se siente decaído, melancólico o desanimado.' }
  ];

  // Beneficios del registro emocional
  const benefits = [
    { title: 'Autoconocimiento', description: 'Ayuda a los estudiantes a identificar y nombrar sus emociones.' },
    { title: 'Seguimiento', description: 'Permite observar patrones emocionales a lo largo del tiempo.' },
    { title: 'Intervención temprana', description: 'Facilita detectar cambios emocionales significativos que requieran atención.' },
    { title: 'Comunicación', description: 'Mejora la comunicación entre estudiantes, docentes y tutores sobre el bienestar emocional.' },
    { title: 'Desarrollo de habilidades', description: 'Fomenta la inteligencia emocional y la autorregulación.' }
  ];

  // Cómo interpretar los datos
  const interpretationGuide = [
    { metric: 'Racha Diaria', icon: Calendar, description: 'Indica cuántos días consecutivos el estudiante ha registrado sus emociones. Una racha larga muestra compromiso con su bienestar emocional.' },
    { metric: 'Índice Semanal', icon: TrendingUp, description: 'Promedio de intensidad emocional positiva durante la semana. Un número más alto indica predominio de emociones positivas.' },
    { metric: 'Intensidad', icon: Star, description: 'Cada emoción se registra con una intensidad de 1 a 5. Mayor intensidad puede indicar experiencias emocionales más significativas.' },
    { metric: 'Notas', icon: MessageCircle, description: 'Comentarios adicionales que el estudiante agrega para contextualizar su estado emocional.' }
  ];

  // Recomendaciones para docentes y tutores
  const recommendations = [
    'Revisar regularmente los registros emocionales de los estudiantes',
    'Identificar patrones o cambios significativos en las emociones',
    'Iniciar conversaciones de apoyo cuando se detecten emociones negativas persistentes',
    'Celebrar y reforzar las rachas de registro como un hábito positivo',
    'Respetar la privacidad del estudiante y usar la información con sensibilidad',
    'Coordinar con el equipo de orientación escolar cuando sea necesario'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <Heart className="w-6 h-6 text-purple-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Guía de Emociones</h1>
        </div>
        <p className="text-gray-600">Referencia para docentes y tutores sobre el sistema de registro emocional</p>
      </header>

      {/* Introducción */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center mb-4">
          <Info className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">¿Qué es el registro emocional?</h2>
        </div>
        <p className="text-gray-700 mb-4">
          El registro emocional es una herramienta que permite a los estudiantes identificar, nombrar y registrar sus emociones diariamente. 
          Esta práctica fomenta la inteligencia emocional y proporciona información valiosa sobre el bienestar de los alumnos.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Nota:</strong> Los estudiantes son los únicos que pueden registrar sus emociones. Como docente o tutor, 
            usted tiene acceso a visualizar estos registros para brindar mejor apoyo, pero no puede modificarlos.
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cómo funciona el registro</h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium text-gray-800 mb-2">1. Selección de emoción</h3>
            <p className="text-gray-600 mb-3">El estudiante elige una emoción que representa cómo se siente.</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {emotionExamples.map((emotion) => (
                <div key={emotion.type} className={`bg-${emotion.color}-50 p-3 rounded-lg flex items-center`}>
                  <div className={`w-10 h-10 bg-${emotion.color}-100 rounded-full flex items-center justify-center mr-3`}>
                    <emotion.icon className={`w-5 h-5 text-${emotion.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{emotion.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium text-gray-800 mb-2">2. Intensidad de la emoción</h3>
            <p className="text-gray-600 mb-3">El estudiante indica qué tan intensa es la emoción en una escala de 1 a 5.</p>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Muy poco</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-gray-300" />
                  <Star className="w-5 h-5 text-gray-300" />
                </div>
                <span className="text-sm text-gray-500">Muy intenso</span>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium text-gray-800 mb-2">3. Notas adicionales</h3>
            <p className="text-gray-600 mb-3">Opcionalmente, el estudiante puede agregar una nota explicando más detalles.</p>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600 italic">"Me sentí muy feliz durante la clase de ciencias porque entendí bien el tema y pude participar."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interpretación */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center mb-4">
          <BarChart className="w-5 h-5 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Cómo interpretar los datos</h2>
        </div>
        
        <div className="space-y-4">
          {interpretationGuide.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <item.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{item.metric}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Beneficios del registro emocional</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-1">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recomendaciones */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center mb-4">
          <HelpCircle className="w-5 h-5 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Recomendaciones para educadores</h2>
        </div>
        
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-green-600 text-xs font-medium">{index + 1}</span>
              </div>
              <p className="text-gray-700">{recommendation}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Situaciones de alerta */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Situaciones de alerta</h2>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg mb-4">
          <p className="text-red-800 text-sm">
            <strong>Preste especial atención a:</strong>
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-red-800 text-sm">
            <li>Cambios bruscos en el patrón emocional</li>
            <li>Emociones negativas de alta intensidad por períodos prolongados</li>
            <li>Ausencia repentina de registros en estudiantes que solían ser constantes</li>
            <li>Notas que mencionen situaciones preocupantes (conflictos, desesperanza, etc.)</li>
          </ul>
        </div>
        
        <p className="text-gray-700">
          Si detecta alguna de estas situaciones, considere hablar con el estudiante en privado o coordinar 
          con el departamento de orientación escolar para brindar el apoyo necesario.
        </p>
      </section>

      {/* Ejemplos de visualización */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ejemplos de registros emocionales</h2>
        
        <div className="space-y-4">
          {emotionExamples.map((emotion) => (
            <div key={emotion.type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${emotion.color}-100 rounded-full flex items-center justify-center`}>
                    <emotion.icon className={`w-5 h-5 text-${emotion.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{emotion.label}</p>
                    <p className="text-sm text-gray-500">Hace 2 días</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{emotion.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}