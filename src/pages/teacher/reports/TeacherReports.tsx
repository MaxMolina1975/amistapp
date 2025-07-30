import { useState } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Calendar, 
  Download, 
  Filter, 
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useStudents } from '../../../lib/types/student';
import { useAuth } from '../../../lib/context/AuthContext';

type TimeRange = 'week' | 'month' | 'trimester' | 'year';
type ReportType = 'emotional' | 'participation' | 'attendance' | 'achievements';

export function TeacherReports() {
  const { currentUser } = useAuth();
  const { students, loading, error } = useStudents(currentUser?.id);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [reportType, setReportType] = useState<ReportType>('emotional');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Obtener datos según el tipo de reporte y rango de tiempo
  const getReportData = () => {
    setIsLoading(true);
    
    // Simulamos la carga de datos
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    // Datos simulados según el tipo de reporte
    switch (reportType) {
      case 'emotional':
        return {
          title: 'Índice Emocional',
          description: 'Evolución del bienestar emocional de los estudiantes',
          averageValue: 78.5,
          changePercentage: 3.2,
          positiveChange: true,
          chartData: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            values: [72, 75, 78, 82],
            color: '#8b5cf6'
          }
        };
      case 'participation':
        return {
          title: 'Participación',
          description: 'Nivel de participación en actividades y clases',
          averageValue: 82.3,
          changePercentage: -1.5,
          positiveChange: false,
          chartData: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            values: [85, 84, 83, 82],
            color: '#3b82f6'
          }
        };
      case 'attendance':
        return {
          title: 'Asistencia',
          description: 'Porcentaje de asistencia a clases',
          averageValue: 95.1,
          changePercentage: 0.7,
          positiveChange: true,
          chartData: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            values: [94, 95, 95, 96],
            color: '#10b981'
          }
        };
      case 'achievements':
        return {
          title: 'Logros',
          description: 'Logros y reconocimientos obtenidos',
          averageValue: 12.8,
          changePercentage: 15.3,
          positiveChange: true,
          chartData: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            values: [8, 10, 12, 15],
            color: '#f59e0b'
          }
        };
      default:
        return {
          title: 'Reporte',
          description: 'Datos agregados del grupo',
          averageValue: 0,
          changePercentage: 0,
          positiveChange: true,
          chartData: {
            labels: [],
            values: [],
            color: '#8b5cf6'
          }
        };
    }
  };
  
  const currentReport = getReportData();
  
  // Calcular datos agregados de los estudiantes
  const totalStudents = students.length;
  const averageEmotionalIndex = totalStudents > 0 ? students.reduce((sum, student) => sum + student.stats.emotionalIndex, 0) / totalStudents : 0;
  const averageParticipation = totalStudents > 0 ? students.reduce((sum, student) => sum + student.stats.participationRate, 0) / totalStudents : 0;
  const averageAttendance = totalStudents > 0 ? students.reduce((sum, student) => sum + student.stats.attendanceRate, 0) / totalStudents : 0;
  
  // Estudiantes que necesitan atención (índice emocional bajo)
  const studentsNeedingAttention = students.filter(student => student.stats.emotionalIndex < 60);
  
  // Mejores estudiantes según participación
  const topStudentsByParticipation = [...students]
    .sort((a, b) => b.stats.participationRate - a.stats.participationRate)
    .slice(0, 5);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar datos: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reportes y Análisis</h1>
        <p className="text-gray-600">Visualiza estadísticas y progreso del grupo</p>
      </header>
      
      {/* Filtros y controles */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
              >
                <option value="emotional">Índice Emocional</option>
                <option value="participation">Participación</option>
                <option value="attendance">Asistencia</option>
                <option value="achievements">Logros</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="trimester">Último trimestre</option>
                <option value="year">Año completo</option>
              </select>
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              onClick={() => getReportData()}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              <span>Actualizar</span>
            </button>
            
            <button 
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <Download className="h-5 w-5 mr-2" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Gráfico principal */}
      <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{currentReport.title}</h2>
            <p className="text-gray-600">{currentReport.description}</p>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-4">
              <div className="text-2xl font-bold text-gray-800">{currentReport.averageValue}%</div>
              <div className={`text-sm flex items-center ${currentReport.positiveChange ? 'text-green-600' : 'text-red-600'}`}>
                <span>{currentReport.positiveChange ? '+' : ''}{currentReport.changePercentage}%</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 ${currentReport.positiveChange ? 'rotate-0' : 'rotate-180'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>
            
            {reportType === 'emotional' && <LineChart className="w-6 h-6 text-violet-600" />}
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
                  <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={`${currentReport.chartData.color}40`} />
                    <stop offset="100%" stopColor={`${currentReport.chartData.color}00`} />
                  </linearGradient>
                </defs>
                
                {/* Área bajo la curva */}
                <path 
                  d={`
                    M0,${200 - (currentReport.chartData.values[0] / 100 * 180)} 
                    ${currentReport.chartData.values.map((value, index) => {
                      const x = index * (500 / (currentReport.chartData.values.length - 1));
                      const y = 200 - (value / 100 * 180);
                      return `L${x},${y}`;
                    }).join(' ')}
                    L500,${200 - (currentReport.chartData.values[currentReport.chartData.values.length - 1] / 100 * 180)}
                    L500,200 L0,200 Z
                  `} 
                  fill="url(#gradientFill)" 
                />
                
                {/* Línea de la curva */}
                <path 
                  d={`
                    M0,${200 - (currentReport.chartData.values[0] / 100 * 180)} 
                    ${currentReport.chartData.values.map((value, index) => {
                      const x = index * (500 / (currentReport.chartData.values.length - 1));
                      const y = 200 - (value / 100 * 180);
                      return `L${x},${y}`;
                    }).join(' ')}
                  `} 
                  fill="none" 
                  stroke={currentReport.chartData.color}
                  strokeWidth="2" 
                />
                
                {/* Puntos en la curva */}
                {currentReport.chartData.values.map((value, index) => {
                  const x = index * (500 / (currentReport.chartData.values.length - 1));
                  const y = 200 - (value / 100 * 180);
                  return (
                    <circle 
                      key={index}
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill="white" 
                      stroke={currentReport.chartData.color}
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* Etiquetas del eje X */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="flex justify-between text-xs text-gray-500 px-2">
                {currentReport.chartData.labels.map((label, index) => (
                  <div key={index}>{label}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mr-3">
              <LineChart className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Índice Emocional</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">{averageEmotionalIndex.toFixed(1)}%</div>
          <div className="text-sm text-gray-500">Promedio del grupo</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Participación</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">{averageParticipation.toFixed(1)}%</div>
          <div className="text-sm text-gray-500">Promedio del grupo</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <PieChart className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Asistencia</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">{averageAttendance.toFixed(1)}%</div>
          <div className="text-sm text-gray-500">Promedio del grupo</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800">Atención Requerida</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800">{studentsNeedingAttention.length}</div>
          <div className="text-sm text-gray-500">Estudiantes en riesgo</div>
        </div>
      </div>
      
      {/* Tabla de estudiantes destacados */}
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
              {topStudentsByParticipation.map((student) => (
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
                      <span className="text-sm text-gray-700">{student.stats.emotionalIndex}%</span>
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
      
      {/* Sección de estudiantes que necesitan atención */}
      {studentsNeedingAttention.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estudiantes que Requieren Atención</h2>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentsNeedingAttention.map(student => (
                <div key={student.id} className="border border-red-100 rounded-lg p-4 bg-red-50">
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
                      {student.stats.attendanceRate < 90 && (
                        <li>• Problemas de asistencia ({student.stats.attendanceRate}%)</li>
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
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Nota del informe */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
        <p className="mb-2">
          <strong>Nota:</strong> Este informe se genera a partir de datos recopilados durante el período seleccionado.
        </p>
        <p>
          Los análisis de tendencias y patrones están diseñados para ayudar a identificar áreas de mejora y oportunidades 
          para el desarrollo socioemocional del grupo. Se recomienda revisar periódicamente estos informes y complementarlos 
          con observaciones directas en el aula.
        </p>
      </div>
    </div>
  );
}
