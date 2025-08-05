import React from 'react';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart, 
  RefreshCw,
} from 'lucide-react';

interface ChartData {
  labels: string[];
  values: number[];
  color: string;
}

interface ReportChartProps {
  title: string;
  description: string;
  averageValue: number;
  changePercentage: number;
  positiveChange: boolean;
  chartData: ChartData;
  isLoading: boolean;
  reportType: 'emotional' | 'participation' | 'attendance' | 'achievements';
}

export const ReportChart: React.FC<ReportChartProps> = ({
  title,
  description,
  averageValue,
  changePercentage,
  positiveChange,
  chartData,
  isLoading,
  reportType,
}) => {
  return (
    <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-4">
            <div className="text-2xl font-bold text-gray-800">{averageValue}%</div>
            <div className={`text-sm flex items-center ${positiveChange ? 'text-green-600' : 'text-red-600'}`}>
              <span>{positiveChange ? '+' : ''}{changePercentage}%</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ml-1 ${positiveChange ? 'rotate-0' : 'rotate-180'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>
          
          {reportType === 'emotional' && <LineChartIcon className="w-6 h-6 text-violet-600" />}
          {reportType === 'participation' && <BarChart3 className="w-6 h-6 text-blue-600" />}
          {reportType === 'attendance' && <PieChart className="w-6 h-6 text-green-600" />}
          {reportType === 'achievements' && <BarChart3 className="w-6 h-6 text-amber-600" />}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : (
        <div className="h-64 relative">
          {/* Renderizamos el gráfico */}
          <div className="absolute inset-0">
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`gradientFill-${reportType}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={`${chartData.color}40`} />
                  <stop offset="100%" stopColor={`${chartData.color}00`} />
                </linearGradient>
              </defs>
              
              {/* Área bajo la curva */}
              <path 
                d={`
                  M0,${200 - (chartData.values[0] / 100 * 180)} 
                  ${chartData.values.map((value, index) => {
                    const x = index * (500 / (chartData.values.length - 1));
                    const y = 200 - (value / 100 * 180);
                    return `L${x},${y}`;
                  }).join(' ')}
                  L500,${200 - (chartData.values[chartData.values.length - 1] / 100 * 180)}
                  L500,200 L0,200 Z
                `} 
                fill={`url(#gradientFill-${reportType})`} 
              />
              
              {/* Línea de la curva */}
              <path 
                d={`
                  M0,${200 - (chartData.values[0] / 100 * 180)} 
                  ${chartData.values.map((value, index) => {
                    const x = index * (500 / (chartData.values.length - 1));
                    const y = 200 - (value / 100 * 180);
                    return `L${x},${y}`;
                  }).join(' ')}
                `} 
                fill="none" 
                stroke={chartData.color}
                strokeWidth="2" 
              />
              
              {/* Puntos en la curva */}
              {chartData.values.map((value, index) => {
                const x = index * (500 / (chartData.values.length - 1));
                const y = 200 - (value / 100 * 180);
                return (
                  <circle 
                    key={index}
                    cx={x} 
                    cy={y} 
                    r="4" 
                    fill="white" 
                    stroke={chartData.color}
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Etiquetas del eje X */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="flex justify-between text-xs text-gray-500 px-2">
              {chartData.labels.map((label, index) => (
                <div key={index}>{label}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para mostrar métricas en tarjetas
interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
  bgColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  description,
  bgColor,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center mb-2">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
          {icon}
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-gray-800">{typeof value === 'number' ? value.toFixed(1) : value}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  );
};

// Componente para mostrar tabla de estudiantes destacados
interface Student {
  id: string | number;
  name: string;
  lastName: string;
  grade: string;
  group: string;
  profileImage?: string;
  stats: {
    emotionalIndex: number;
    participationRate: number;
    achievementsCount: number;
  };
}

interface TopStudentsTableProps {
  students: Student[];
}

export const TopStudentsTable: React.FC<TopStudentsTableProps> = ({ students }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Estudiantes Destacados</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudiante
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participación
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Índice Emocional
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logros
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                      {student.profileImage ? (
                        <img 
                          className="h-8 w-8 rounded-full" 
                          src={student.profileImage} 
                          alt={`${student.name} ${student.lastName}`} 
                        />
                      ) : (
                        <span className="text-violet-800 font-medium text-xs">
                          {student.name[0]}{student.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {student.name} {student.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.grade} {student.group}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.stats.participationRate}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          student.stats.emotionalIndex >= 80 ? 'bg-green-500' :
                          student.stats.emotionalIndex >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${student.stats.emotionalIndex}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{student.stats.emotionalIndex}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.stats.achievementsCount}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente para mostrar lista de estudiantes que necesitan atención
interface AttentionNeededCardProps {
  student: Student;
}

export const AttentionNeededCard: React.FC<AttentionNeededCardProps> = ({ student }) => {
  return (
    <div className="border border-red-100 rounded-lg p-4 bg-red-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            {student.profileImage ? (
              <img 
                className="h-10 w-10 rounded-full" 
                src={student.profileImage} 
                alt={`${student.name} ${student.lastName}`} 
              />
            ) : (
              <span className="text-red-800 font-medium">
                {student.name[0]}{student.lastName[0]}
              </span>
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {student.name} {student.lastName}
            </div>
            <div className="text-xs text-gray-500">
              {student.grade} {student.group}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-red-700">Índice: {student.stats.emotionalIndex}%</div>
          <div className="text-xs text-gray-500">Últimos 30 días</div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-1">Posibles factores:</h4>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• Baja participación en actividades ({student.stats.participationRate}%)</li>
          {student.stats.participationRate < 90 && (
            <li>• Problemas de participación ({student.stats.participationRate}%)</li>
          )}
          <li>• Pocas interacciones positivas con compañeros</li>
        </ul>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button 
          className="text-sm px-3 py-1 bg-white text-red-700 border border-red-200 rounded-lg hover:bg-red-50"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};
