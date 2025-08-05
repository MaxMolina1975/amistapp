import React from 'react';
import { BarChart, FileText, AlertTriangle, Shield, Info, Users, PieChart, LineChart } from 'lucide-react';

export function TutorReportsInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sistema de Reportes</h1>
        <p className="text-gray-600">Información para tutores sobre el funcionamiento del sistema de reportes</p>
      </header>

      {/* Sección de introducción */}
      <section className="mb-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            <Info className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">¿Qué son los reportes en AMISTAPP?</h2>
        </div>
        <p className="text-gray-700 mb-4">
          El sistema de reportes es una herramienta diseñada para identificar, documentar y abordar situaciones 
          de conflicto, acoso escolar o problemas de convivencia en el entorno educativo.
        </p>
        <p className="text-gray-700">
          Como tutor, es importante que comprendas cómo funciona este sistema para poder apoyar a tus estudiantes 
          vinculados en caso de que se vean involucrados en alguna situación reportada.
        </p>
      </section>

      {/* Estadísticas y gráficos */}
      <section className="mb-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <BarChart className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Estadísticas de reportes</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Tipos de reportes</h3>
            <div className="h-48 flex items-center justify-center">
              {/* Gráfico circular simulado */}
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 0 0, 0 50%)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-yellow-500" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 100%, 50% 100%)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%)' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <PieChart className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Conflictos entre estudiantes (45%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Situaciones de acoso (30%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Problemas de convivencia (25%)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Efectividad de intervención</h3>
            <div className="h-48 flex items-center justify-center">
              {/* Gráfico de línea simulado */}
              <div className="w-full h-32 relative">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
                <div className="absolute left-0 bottom-0 top-0 w-px bg-gray-300"></div>
                
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-red-100"></div>
                <div className="absolute bottom-8 left-0 right-0 h-8 bg-yellow-100"></div>
                <div className="absolute bottom-16 left-0 right-0 h-8 bg-green-100"></div>
                <div className="absolute bottom-24 left-0 right-0 h-8 bg-blue-100"></div>
                
                <div className="absolute bottom-0 left-0 w-full h-full">
                  <svg className="w-full h-full" viewBox="0 0 100 32">
                    <path d="M0,32 L20,24 L40,16 L60,8 L80,4 L100,2" fill="none" stroke="#4f46e5" strokeWidth="2" />
                    <circle cx="0" cy="32" r="2" fill="#4f46e5" />
                    <circle cx="20" cy="24" r="2" fill="#4f46e5" />
                    <circle cx="40" cy="16" r="2" fill="#4f46e5" />
                    <circle cx="60" cy="8" r="2" fill="#4f46e5" />
                    <circle cx="80" cy="4" r="2" fill="#4f46e5" />
                    <circle cx="100" cy="2" r="2" fill="#4f46e5" />
                  </svg>
                </div>
                
                <div className="absolute -bottom-6 left-0 text-xs text-gray-500">Inicio</div>
                <div className="absolute -bottom-6 right-0 text-xs text-gray-500">3 meses</div>
                <div className="absolute -left-6 top-0 text-xs text-gray-500">100%</div>
                <div className="absolute -left-6 bottom-0 text-xs text-gray-500">0%</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Los datos muestran que la intervención temprana y el seguimiento continuo 
              reducen significativamente la recurrencia de incidentes reportados.
            </p>
          </div>
        </div>
        
        <p className="text-gray-700">
          Nuestras estadísticas indican que el uso sistemático del sistema de reportes, combinado con 
          intervenciones apropiadas, reduce en un 78% la incidencia de problemas de convivencia en los centros educativos.
        </p>
      </section>

      {/* Cómo funciona */}
      <section className="mb-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">¿Cómo funciona el sistema?</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="font-bold text-indigo-600">1</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Identificación del incidente</h3>
              <p className="text-gray-600">Los estudiantes o docentes pueden reportar situaciones de conflicto o acoso a través de la plataforma.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="font-bold text-indigo-600">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Documentación detallada</h3>
              <p className="text-gray-600">El sistema permite documentar los hechos, incluyendo fecha, lugar, personas involucradas y descripción del incidente.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="font-bold text-indigo-600">3</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Evaluación y clasificación</h3>
              <p className="text-gray-600">Los docentes evalúan la gravedad del incidente y lo clasifican según su naturaleza para determinar las acciones a seguir.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="font-bold text-indigo-600">4</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Intervención y seguimiento</h3>
              <p className="text-gray-600">Se implementan medidas de intervención y se realiza un seguimiento continuo para evaluar la efectividad de las acciones tomadas.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <span className="font-bold text-indigo-600">5</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Notificación a tutores</h3>
              <p className="text-gray-600">Los tutores son notificados cuando sus estudiantes vinculados están involucrados en un incidente reportado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de reportes */}
      <section className="mb-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Tipos de reportes</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="font-medium text-gray-800">Conflictos entre estudiantes</h3>
            </div>
            <p className="text-gray-600 text-sm">Desacuerdos, malentendidos o disputas menores que pueden resolverse mediante mediación.</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="font-medium text-gray-800">Situaciones de acoso</h3>
            </div>
            <p className="text-gray-600 text-sm">Comportamientos repetitivos de intimidación, exclusión o agresión hacia un estudiante.</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-medium text-gray-800">Incidentes graves</h3>
            </div>
            <p className="text-gray-600 text-sm">Situaciones que requieren intervención inmediata debido a su gravedad o potencial daño.</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-800">Reportes preventivos</h3>
            </div>
            <p className="text-gray-600 text-sm">Alertas tempranas sobre situaciones que podrían escalar si no se abordan adecuadamente.</p>
          </div>
        </div>
      </section>

      {/* Beneficios para tutores */}
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
            <p className="text-gray-700">Información oportuna sobre situaciones que afectan a tus estudiantes vinculados.</p>
          </li>
          
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-gray-700">Transparencia en el manejo de conflictos y situaciones de acoso escolar.</p>
          </li>
          
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-gray-700">Posibilidad de colaborar con la escuela en la implementación de estrategias de apoyo.</p>
          </li>
          
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-gray-700">Seguimiento del progreso y resolución de situaciones reportadas que involucran a tus estudiantes.</p>
          </li>
          
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-gray-700">Acceso a recursos y recomendaciones para apoyar a tus estudiantes en caso de ser necesario.</p>
          </li>
        </ul>
      </section>
    </div>
  );
}