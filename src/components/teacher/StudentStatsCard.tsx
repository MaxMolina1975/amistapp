import { BarChart3, CircleUser, Calendar, Clock } from 'lucide-react';
import { StudentWithStats } from '../../lib/types/student';

interface StudentStatsCardProps {
  student: StudentWithStats;
  showDetailedView?: boolean;
  className?: string;
}

export function StudentStatsCard({ student, showDetailedView = false, className }: StudentStatsCardProps) {
  // Obtener fecha de actualización en formato legible
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Convertir el estado de ánimo semanal a array para gráfico
  const weekdayLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const moodValues = [
    student.stats.weeklyMood.monday || 0,
    student.stats.weeklyMood.tuesday || 0,
    student.stats.weeklyMood.wednesday || 0,
    student.stats.weeklyMood.thursday || 0,
    student.stats.weeklyMood.friday || 0
  ];

  // Colores para los indicadores según valor
  const getColorClass = (value: number, threshold = 80) => {
    if (value >= threshold) return 'bg-green-500';
    if (value >= threshold - 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      {/* Vista resumida (para listado) */}
      {!showDetailedView && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                {student.profileImage ? (
                  <img 
                    src={student.profileImage} 
                    alt={`${student.name} ${student.lastName}`}
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                ) : (
                  <CircleUser className="w-6 h-6 text-violet-600" />
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-800">{student.name} {student.lastName}</h3>
                <p className="text-sm text-gray-500">{student.grade} {student.group}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Actualizado: {formatDate(student.stats.lastUpdate)}</span>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Índice Emocional</div>
              <div className="flex justify-center">
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getColorClass(student.stats.emotionalIndex)}`}>
                  <span className="text-white font-bold">{student.stats.emotionalIndex}%</span>
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Participación</div>
              <div className="flex justify-center">
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getColorClass(student.stats.participationRate)}`}>
                  <span className="text-white font-bold">{student.stats.participationRate}%</span>
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Puntos</div>
              <div className="text-xl font-bold text-violet-600">{student.stats.points}</div>
              <div className="text-xs text-gray-500">{student.stats.achievementsCount} logros</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Asistencia</div>
              <div className="flex justify-center">
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getColorClass(student.stats.attendanceRate)}`}>
                  <span className="text-white font-bold">{student.stats.attendanceRate}%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Vista detallada (para modal) */}
      {showDetailedView && (
        <div>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Resumen de desempeño</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-violet-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Índice Emocional</div>
                  <div className="text-2xl font-bold text-violet-700">{student.stats.emotionalIndex}%</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Participación</div>
                  <div className="text-2xl font-bold text-blue-700">{student.stats.participationRate}%</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Asistencia</div>
                  <div className="text-2xl font-bold text-green-700">{student.stats.attendanceRate}%</div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">Puntos</div>
                  <div className="text-2xl font-bold text-amber-700">{student.stats.points}</div>
                  <div className="text-xs text-gray-500">{student.stats.achievementsCount} logros</div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Habilidades socioemocionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(student.stats.skills).map(([skill, value]) => {
                  // Traducir las habilidades al español
                  const skillTranslations: {[key: string]: string} = {
                    communication: 'Comunicación',
                    teamwork: 'Trabajo en equipo',
                    empathy: 'Empatía',
                    selfRegulation: 'Autorregulación',
                    conflictResolution: 'Resolución de conflictos'
                  };
                  
                  const skillName = skillTranslations[skill] || skill;
                  
                  return (
                    <div key={skill} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">{skillName}</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="h-2.5 rounded-full bg-violet-600"
                            style={{ width: `${value * 10}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{value}/10</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Estado de ánimo semanal</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  {weekdayLabels.map((day, index) => (
                    <div key={day} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{day}</div>
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          moodValues[index] >= 8 ? 'bg-green-100 text-green-700' :
                          moodValues[index] >= 5 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        {moodValues[index]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative h-20 mt-4">
                  <div className="absolute inset-0">
                    <svg width="100%" height="100%" viewBox="0 0 500 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.5)" />
                          <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                        </linearGradient>
                      </defs>
                      
                      {/* Área bajo la curva */}
                      <path 
                        d={`M0,${100 - moodValues[0] * 10} 
                           L100,${100 - moodValues[1] * 10} 
                           L200,${100 - moodValues[2] * 10} 
                           L300,${100 - moodValues[3] * 10} 
                           L400,${100 - moodValues[4] * 10} 
                           L500,${100 - moodValues[4] * 10} 
                           L500,100 L0,100 Z`} 
                        fill="url(#gradient)" 
                      />
                      
                      {/* Línea de la curva */}
                      <path 
                        d={`M0,${100 - moodValues[0] * 10} 
                           L100,${100 - moodValues[1] * 10} 
                           L200,${100 - moodValues[2] * 10} 
                           L300,${100 - moodValues[3] * 10} 
                           L400,${100 - moodValues[4] * 10}
                           L500,${100 - moodValues[4] * 10}`} 
                        fill="none" 
                        stroke="#8b5cf6" 
                        strokeWidth="3" 
                      />
                      
                      {/* Puntos en la curva */}
                      {moodValues.map((value, index) => (
                        <circle 
                          key={`mood-point-${weekdayLabels[index]}`}
                          cx={index * 100 + (index === 4 ? 100 : 0)} 
                          cy={100 - value * 10} 
                          r="4" 
                          fill="#8b5cf6" 
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Última actualización: {formatDate(student.stats.lastUpdate)}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Año lectivo: 2025</span>
              </div>
            </div>
          </div>
          
          {student.tutorName && (
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Tutor asignado</h3>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-medium text-blue-700">
                    {student.tutorName.split(' ').map(name => name[0]).join('')}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-800">{student.tutorName}</div>
                  <div className="text-sm text-gray-500">{student.tutorEmail}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
