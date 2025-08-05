import React from 'react';
import { BarChart, Gift, Award, Trophy, Info, Users } from 'lucide-react';

export function TutorRewardsInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sistema de Premios</h1>
        <p className="text-gray-600">Información para tutores sobre el funcionamiento del sistema de premios</p>
      </header>

      {/* Sección de introducción */}
      <section className="mb-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            <Info className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">¿Qué son los premios en AMISTAPP?</h2>
        </div>
        <p className="text-gray-700 mb-4">
          El sistema de premios es una herramienta pedagógica diseñada para motivar comportamientos positivos 
          y reconocer el desarrollo socioemocional de los estudiantes.
        </p>
        <p className="text-gray-700">
          Como tutor, podrás visualizar los premios que han obtenido tus estudiantes vinculados y comprender 
          cómo este sistema contribuye a su desarrollo integral.
        </p>
      </section>

      {/* Gráfico explicativo */}
      <section className="mb-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <BarChart className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Impacto de los premios</h2>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="h-64 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Motivación</span>
                <span className="text-sm font-medium text-gray-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex justify-between mb-2 mt-4">
                <span className="text-sm font-medium text-gray-600">Participación en clase</span>
                <span className="text-sm font-medium text-gray-600">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-500 h-4 rounded-full" style={{ width: '78%' }}></div>
              </div>
              
              <div className="flex justify-between mb-2 mt-4">
                <span className="text-sm font-medium text-gray-600">Comportamiento positivo</span>
                <span className="text-sm font-medium text-gray-600">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-purple-500 h-4 rounded-full" style={{ width: '92%' }}></div>
              </div>
              
              <div className="flex justify-between mb-2 mt-4">
                <span className="text-sm font-medium text-gray-600">Desarrollo socioemocional</span>
                <span className="text-sm font-medium text-gray-600">80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-indigo-500 h-4 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">Impacto medido en estudiantes que utilizan el sistema de premios regularmente</p>
        </div>
        
        <p className="text-gray-700">
          Los estudios muestran que el reconocimiento positivo a través de premios mejora significativamente 
          la motivación intrínseca y el compromiso de los estudiantes con su aprendizaje socioemocional.
        </p>
      </section>

      {/* Cómo funciona */}
      <section className="mb-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <Gift className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">¿Cómo funciona el sistema?</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="font-bold text-indigo-600">1</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Asignación de puntos</h3>
              <p className="text-gray-600">Los docentes asignan puntos a los estudiantes por comportamientos positivos, participación y logros académicos.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="font-bold text-indigo-600">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Acumulación de puntos</h3>
              <p className="text-gray-600">Los estudiantes acumulan puntos a lo largo del tiempo, visualizando su progreso en su panel personal.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="font-bold text-indigo-600">3</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Canje por premios</h3>
              <p className="text-gray-600">Al alcanzar ciertos umbrales, los estudiantes pueden canjear sus puntos por premios virtuales o físicos establecidos por el docente.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="font-bold text-indigo-600">4</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Seguimiento por tutores</h3>
              <p className="text-gray-600">Como tutor, puedes ver el historial de premios de tus estudiantes vinculados y entender su progreso socioemocional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de premios */}
      <section className="mb-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Tipos de premios disponibles</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-indigo-600 mr-2" />
              <h3 className="font-medium text-gray-800">Insignias virtuales</h3>
            </div>
            <p className="text-gray-600 text-sm">Reconocimientos digitales que los estudiantes pueden mostrar en sus perfiles.</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-medium text-gray-800">Privilegios en clase</h3>
            </div>
            <p className="text-gray-600 text-sm">Beneficios especiales como ser ayudante del profesor o elegir actividades.</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Gift className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-800">Premios físicos</h3>
            </div>
            <p className="text-gray-600 text-sm">Pequeños obsequios o materiales educativos que el docente puede entregar.</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Trophy className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-medium text-gray-800">Reconocimientos especiales</h3>
            </div>
            <p className="text-gray-600 text-sm">Certificados y menciones por logros destacados o mejoras significativas.</p>
          </div>
        </div>
      </section>

      {/* Beneficios para padres/tutores */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Beneficios para tutores</h2>
        </div>
        
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-gray-700">Visualización del progreso socioemocional de tus estudiantes a través de los premios obtenidos.</p>
          </li>
          
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-gray-700">Comprensión de las áreas en las que destacan tus estudiantes y aquellas que requieren apoyo.</p>
          </li>
          
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-gray-700">Oportunidad para reforzar en casa los comportamientos positivos reconocidos en la escuela.</p>
          </li>
          
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-gray-700">Mayor comunicación y alineación entre el hogar y la escuela en cuanto a objetivos educativos.</p>
          </li>
        </ul>
      </section>
    </div>
  );
}