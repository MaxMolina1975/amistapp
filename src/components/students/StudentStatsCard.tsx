import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Brain, 
  Heart, 
  BookOpen, 
  Users,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StudentWithStats } from '../../lib/types/student';

interface StudentStatsCardProps {
  student: StudentWithStats;
  showDetailedView?: boolean;
}

export function StudentStatsCard({ student, showDetailedView = false }: StudentStatsCardProps) {
  const [showAllStats, setShowAllStats] = useState(showDetailedView);

  // Función para determinar el color según el valor
  const getColorByValue = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Función para determinar la clase de color del texto según el valor
  const getTextColorByValue = (value: number) => {
    if (value >= 80) return 'text-green-700';
    if (value >= 60) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      {/* Información general */}
      <div className="mb-4">
        <h3 className="font-medium text-gray-900 text-lg mb-1">Estadísticas de {student.name} {student.lastName}</h3>
        <p className="text-gray-600 text-sm">
          {student.grade} {student.group} • {student.age} años
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Índice Emocional */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Heart className="h-5 w-5 text-pink-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Índice Emocional</span>
          </div>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className={`h-2.5 rounded-full ${getColorByValue(student.stats.emotionalIndex)}`}
                style={{ width: `${student.stats.emotionalIndex}%` }}
              ></div>
            </div>
            <span className={`text-sm font-medium ${getTextColorByValue(student.stats.emotionalIndex)}`}>
              {student.stats.emotionalIndex}%
            </span>
          </div>
        </div>

        {/* Puntos */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Trophy className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Puntos Acumulados</span>
          </div>
          <div className="text-lg font-bold text-amber-700">{student.stats.points}</div>
        </div>

        {/* Logros */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Logros</span>
          </div>
          <div className="text-lg font-bold text-emerald-700">{student.stats.achievementsCount}</div>
        </div>
      </div>

      {/* Botón para mostrar/ocultar detalles */}
      {!showDetailedView && (
        <button
          onClick={() => setShowAllStats(!showAllStats)}
          className="flex items-center justify-center w-full py-2 text-sm text-violet-700 hover:text-violet-900 transition-colors"
        >
          {showAllStats ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Ocultar detalles
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Ver más detalles
            </>
          )}
        </button>
      )}

      {/* Estadísticas detalladas */}
      {(showAllStats || showDetailedView) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Métricas de Desempeño</h4>
          
          <div className="space-y-3">
            {/* Rendimiento Académico */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Rendimiento Académico</span>
                </div>
                <span className={`text-sm font-medium ${getTextColorByValue(student.stats.academicPerformance)}`}>
                  {student.stats.academicPerformance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getColorByValue(student.stats.academicPerformance)}`}
                  style={{ width: `${student.stats.academicPerformance}%` }}
                ></div>
              </div>
            </div>

            {/* Bienestar Emocional */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">Bienestar Emocional</span>
                </div>
                <span className={`text-sm font-medium ${getTextColorByValue(student.stats.emotionalWellbeing)}`}>
                  {student.stats.emotionalWellbeing}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getColorByValue(student.stats.emotionalWellbeing)}`}
                  style={{ width: `${student.stats.emotionalWellbeing}%` }}
                ></div>
              </div>
            </div>

            {/* Participación Social */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-indigo-500 mr-2" />
                  <span className="text-sm text-gray-600">Participación Social</span>
                </div>
                <span className={`text-sm font-medium ${getTextColorByValue(student.stats.socialParticipation)}`}>
                  {student.stats.socialParticipation}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getColorByValue(student.stats.socialParticipation)}`}
                  style={{ width: `${student.stats.socialParticipation}%` }}
                ></div>
              </div>
            </div>

            {/* Asistencia */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-teal-500 mr-2" />
                  <span className="text-sm text-gray-600">Asistencia</span>
                </div>
                <span className={`text-sm font-medium ${getTextColorByValue(student.stats.attendance)}`}>
                  {student.stats.attendance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getColorByValue(student.stats.attendance)}`}
                  style={{ width: `${student.stats.attendance}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tendencias */}
          {showDetailedView && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Tendencias Recientes</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <BarChart3 className="h-5 w-5 text-violet-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Últimos 30 días</span>
                </div>
                <p className="text-sm text-gray-600">
                  El estudiante ha {student.stats.trends.emotionalIndex > 0 ? 'aumentado' : 'disminuido'} su índice emocional en 
                  <span className={student.stats.trends.emotionalIndex > 0 ? 'text-green-600' : 'text-red-600'}>
                    {' '}{Math.abs(student.stats.trends.emotionalIndex)}%
                  </span> 
                  {' '}y ha acumulado{' '}
                  <span className="text-blue-600 font-medium">
                    {student.stats.trends.pointsEarned} puntos
                  </span> 
                  {' '}en el último mes.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
