import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  ChevronDown,
  Users
} from 'lucide-react';
import { useAuth } from '../../../lib/context/AuthContext';
import { useStudents } from '../../../lib/types/student';
import { ReportChart, MetricCard, TopStudentsTable, AttentionNeededCard } from '../../../components/reports/ReportCharts';
import { ReportExport } from '../../../components/reports/ReportExport';

// Tipos
type TimeRange = 'week' | 'month' | 'trimester' | 'year';
type ReportType = 'emotional' | 'participation' | 'attendance' | 'achievements';
type ExportFormat = 'pdf' | 'excel' | 'csv' | 'image';

// Interfaz para los reportes
interface ReportData {
  title: string;
  description: string;
  averageValue: number;
  changePercentage: number;
  positiveChange: boolean;
  chartData: {
    labels: string[];
    values: number[];
    color: string;
  };
}

// Componente principal
export function EnhancedTeacherReports() {
  const { currentUser } = useAuth();
  const { students: allStudents, loading: studentsLoading, error: studentsError, refetch: refetchStudents } = useStudents(currentUser?.id);
  
  // Estados
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [reportType, setReportType] = useState<ReportType>('emotional');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<number | string>(allStudents[0]?.id || 1);
  const [filteredStudents, setFilteredStudents] = useState<typeof allStudents>(allStudents);
  
  // Loading and error handling
  if (studentsLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando reportes...</span>
        </div>
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar los datos</h3>
            <p className="text-gray-600 mb-4">No se pudieron cargar los datos de los estudiantes.</p>
            <button
              onClick={refetchStudents}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Obtener datos para el reporte actual
  useEffect(() => {
    fetchReportData();
    
    // Filtrar estudiantes según curso y grupo seleccionados
    let filtered = [...allStudents];
    
    if (selectedCourse !== 'all') {
      // Simulamos filtrado por curso (en un caso real, esto vendría de la API)
      filtered = filtered.filter(student => 
        // Asumimos que cada estudiante tiene cursos asignados
        Math.random() > 0.5
      );
    }
    
    if (selectedGroup !== 'all') {
      filtered = filtered.filter(student => student.group === selectedGroup.slice(-1));
    }
    
    setFilteredStudents(filtered);
    
    // Si no hay estudiantes en el filtro o el estudiante seleccionado no está en el filtro,
    // seleccionamos el primero de la lista filtrada
    if (filtered.length > 0 && !filtered.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(filtered[0].id);
    }
  }, [timeRange, reportType, selectedCourse, selectedGroup, allStudents]);
  
  // Función para cargar datos
  const fetchReportData = async () => {
    setIsLoading(true);
    
    // Simulamos una carga de datos
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  // Función para exportar reportes
  const handleExport = (format: ExportFormat) => {
    setIsExporting(true);
    
    // Obtenemos el estudiante seleccionado para el informe personalizado
    const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
    
    // Simulamos la exportación
    setTimeout(() => {
      // En una implementación real, aquí se generaría el archivo según el formato
      console.log(`Exportando informe de ${selectedStudent.name} ${selectedStudent.lastName} en formato ${format}`);
      
      // Mensaje de éxito
      alert(`Informe de ${selectedStudent.name} ${selectedStudent.lastName} exportado correctamente en formato ${format}`);
      
      setIsExporting(false);
    }, 2000);
  };
  
  // Datos de reportes (simulados)
  const reportsData: Record<ReportType, ReportData> = {
    emotional: {
      title: 'Índice Emocional',
      description: 'Evolución del bienestar socioemocional',
      averageValue: 78.5,
      changePercentage: 3.2,
      positiveChange: true,
      chartData: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        values: [65, 72, 68, 74, 77, 79],
        color: '#8b5cf6' // violet-500
      }
    },
    participation: {
      title: 'Participación',
      description: 'Nivel de participación en actividades',
      averageValue: 82.3,
      changePercentage: 5.7,
      positiveChange: true,
      chartData: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        values: [70, 75, 78, 80, 82, 85],
        color: '#3b82f6' // blue-500
      }
    },
    attendance: {
      title: 'Asistencia',
      description: 'Porcentaje de asistencia a clases',
      averageValue: 93.7,
      changePercentage: 1.2,
      positiveChange: true,
      chartData: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        values: [90, 92, 94, 93, 95, 94],
        color: '#22c55e' // green-500
      }
    },
    achievements: {
      title: 'Logros',
      description: 'Progreso en objetivos de aprendizaje',
      averageValue: 68.9,
      changePercentage: 2.5,
      positiveChange: false,
      chartData: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        values: [75, 73, 70, 68, 67, 69],
        color: '#f59e0b' // amber-500
      }
    }
  };
  
  // Datos estadísticos
  const averageEmotionalIndex = 75.8;
  const averageParticipation = 82.3;
  const averageAttendance = 93.7;
  
  // Filtrar estudiantes que necesitan atención (índice emocional < 60)
  const studentsNeedingAttention = allStudents
    .filter(student => student.stats?.emotionalIndex < 60)
    .slice(0, 4);
  
  // Obtener top 5 estudiantes por participación
  const topStudentsByParticipation = [...allStudents]
    .sort((a, b) => (b.stats?.participationRate || 0) - (a.stats?.participationRate || 0))
    .slice(0, 5);
  
  // Cursos disponibles (simulados)
  const availableCourses = [
    { id: 'all', name: 'Todos los cursos' },
    { id: 'math', name: 'Matemáticas' },
    { id: 'science', name: 'Ciencias' },
    { id: 'language', name: 'Lenguaje' },
    { id: 'history', name: 'Historia' }
  ];
  
  // Grupos disponibles (simulados)
  const availableGroups = [
    { id: 'all', name: 'Todos los grupos' },
    { id: '4A', name: '4° A' },
    { id: '4B', name: '4° B' },
    { id: '5A', name: '5° A' },
    { id: '5B', name: '5° B' }
  ];
  
  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Reportes y Análisis</h1>
          <p className="text-gray-600">
            Visualiza estadísticas del desempeño de tus estudiantes y genera informes detallados
          </p>
        </div>
        
        {/* Exportar informe */}
        <div className="mt-4 md:mt-0">
          <ReportExport onExport={handleExport} isExporting={isExporting} />
        </div>
      </div>
      
      {/* Filtros de reporte */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Selector de tipo de reporte */}
        <div className="bg-white p-3 rounded-xl shadow-sm">
          <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Reporte</label>
          <div className="relative">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-violet-500 focus:border-violet-500 rounded-lg"
            >
              <option value="emotional">Índice Emocional</option>
              <option value="participation">Participación</option>
              <option value="attendance">Asistencia</option>
              <option value="achievements">Logros</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        {/* Selector de periodo de tiempo */}
        <div className="bg-white p-3 rounded-xl shadow-sm">
          <label className="block text-xs font-medium text-gray-700 mb-1">Periodo de Tiempo</label>
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-violet-500 focus:border-violet-500 rounded-lg"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="trimester">Último trimestre</option>
              <option value="year">Último año</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        {/* Selector de curso */}
        <div className="bg-white p-3 rounded-xl shadow-sm">
          <label className="block text-xs font-medium text-gray-700 mb-1">Curso</label>
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-violet-500 focus:border-violet-500 rounded-lg"
            >
              {availableCourses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        {/* Selector de grupo */}
        <div className="bg-white p-3 rounded-xl shadow-sm">
          <label className="block text-xs font-medium text-gray-700 mb-1">Grupo</label>
          <div className="relative">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-violet-500 focus:border-violet-500 rounded-lg"
            >
              {availableGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráfico principal */}
      <ReportChart 
        title={reportsData[reportType].title}
        description={reportsData[reportType].description}
        averageValue={reportsData[reportType].averageValue}
        changePercentage={reportsData[reportType].changePercentage}
        positiveChange={reportsData[reportType].positiveChange}
        chartData={reportsData[reportType].chartData}
        isLoading={isLoading}
        reportType={reportType}
      />
      
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          icon={<LineChart className="w-5 h-5 text-violet-600" />}
          title="Índice Emocional"
          value={averageEmotionalIndex}
          description="Promedio del grupo"
          bgColor="bg-violet-100"
        />
        
        <MetricCard 
          icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
          title="Participación"
          value={averageParticipation}
          description="Promedio del grupo"
          bgColor="bg-blue-100"
        />
        
        <MetricCard 
          icon={<PieChart className="w-5 h-5 text-green-600" />}
          title="Asistencia"
          value={averageAttendance}
          description="Promedio del grupo"
          bgColor="bg-green-100"
        />
        
        <MetricCard 
          icon={<Users className="w-5 h-5 text-red-600" />}
          title="Atención Requerida"
          value={studentsNeedingAttention.length}
          description="Estudiantes en riesgo"
          bgColor="bg-red-100"
        />
      </div>
      
      {/* Tabla de estudiantes destacados */}
      <TopStudentsTable students={topStudentsByParticipation} />
      
      {/* Sección de estudiantes que necesitan atención */}
      {studentsNeedingAttention.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estudiantes que Requieren Atención</h2>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentsNeedingAttention.map(student => (
                <AttentionNeededCard key={student.id} student={student} />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Sección de detalles por alumno para tutores */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles por Alumno</h2>
        <div className="bg-white rounded-xl shadow-sm p-4">
          {/* Selector de alumno */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Alumno</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-violet-500 focus:border-violet-500 rounded-lg"
            >
              {filteredStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.lastName} - {student.grade} {student.group}
                </option>
              ))}
            </select>
          </div>
          
          {/* Detalles del alumno seleccionado */}
          {filteredStudents.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Información personal */}
                <div className="md:w-1/3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center mr-4">
                        {(() => {
                          const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                          return selectedStudent.profileImage ? (
                            <img 
                              className="h-16 w-16 rounded-full" 
                              src={selectedStudent.profileImage} 
                              alt={`${selectedStudent.name} ${selectedStudent.lastName}`} 
                            />
                          ) : (
                            <span className="text-violet-800 font-bold text-xl">
                              {selectedStudent.name[0]}{selectedStudent.lastName[0]}
                            </span>
                          );
                        })()}
                      </div>
                      <div>
                        {(() => {
                          const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                          return (
                            <>
                              <h3 className="text-lg font-semibold">{selectedStudent.name} {selectedStudent.lastName}</h3>
                              <p className="text-sm text-gray-600">{selectedStudent.grade} {selectedStudent.group}</p>
                              <p className="text-sm text-gray-600">Edad: {selectedStudent.age} años</p>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {(() => {
                        const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                        return (
                          <>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Tutor:</span>
                              <span className="text-sm text-gray-600 ml-2">{selectedStudent.tutorName}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Contacto:</span>
                              <span className="text-sm text-gray-600 ml-2">{selectedStudent.tutorEmail}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Intereses:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedStudent.interests?.map((interest, idx) => (
                                  <span key={idx} className="text-xs bg-violet-100 text-violet-800 px-2 py-1 rounded-full">
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                
                {/* Estadísticas y progreso */}
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-violet-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-violet-800 mb-2">Índice Emocional</h4>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          {(() => {
                            const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                            return (
                              <div 
                                className={`h-2.5 rounded-full ${selectedStudent.stats.emotionalIndex >= 80 ? 'bg-green-500' : selectedStudent.stats.emotionalIndex >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${selectedStudent.stats.emotionalIndex}%` }}
                              ></div>
                            );
                          })()}
                        </div>
                        {(() => {
                          const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                          return (
                            <span className="text-sm font-bold">{selectedStudent.stats.emotionalIndex}%</span>
                          );
                        })()}
                      </div>
                      {(() => {
                        const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                        return (
                          <p className="text-xs text-gray-600 mt-1">Tendencia: {selectedStudent.stats.trends.emotionalIndex > 0 ? '+' : ''}{selectedStudent.stats.trends.emotionalIndex}% en 30 días</p>
                        );
                      })()}
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Participación</h4>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          {(() => {
                            const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                            return (
                              <div 
                                className="h-2.5 rounded-full bg-blue-500"
                                style={{ width: `${selectedStudent.stats.participationRate}%` }}
                              ></div>
                            );
                          })()}
                        </div>
                        {(() => {
                          const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                          return (
                            <span className="text-sm font-bold">{selectedStudent.stats.participationRate}%</span>
                          );
                        })()}
                      </div>
                      {(() => {
                        const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                        return (
                          <p className="text-xs text-gray-600 mt-1">Asistencia: {selectedStudent.stats.attendanceRate}%</p>
                        );
                      })()}
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-green-800 mb-2">Habilidades Socioemocionales</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Comunicación:</span>
                          {(() => {
                            const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                            return (
                              <span className="font-medium ml-1">{selectedStudent.stats.skills.communication}/10</span>
                            );
                          })()}
                        </div>
                        <div>
                          <span className="text-gray-600">Trabajo en equipo:</span>
                          {(() => {
                            const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                            return (
                              <span className="font-medium ml-1">{selectedStudent.stats.skills.teamwork}/10</span>
                            );
                          })()}
                        </div>
                        <div>
                          <span className="text-gray-600">Empatía:</span>
                          {(() => {
                            const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                            return (
                              <span className="font-medium ml-1">{selectedStudent.stats.skills.empathy}/10</span>
                            );
                          })()}
                        </div>
                        <div>
                          <span className="text-gray-600">Autorregulación:</span>
                          {(() => {
                            const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                            return (
                              <span className="font-medium ml-1">{selectedStudent.stats.skills.selfRegulation}/10</span>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-amber-800 mb-2">Logros y Recompensas</h4>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-600">Puntos acumulados:</span>
                        {(() => {
                          const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                          return (
                            <span className="text-sm font-bold">{selectedStudent.stats.points}</span>
                          );
                        })()}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Logros desbloqueados:</span>
                        {(() => {
                          const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                          return (
                            <span className="text-sm font-bold">{selectedStudent.stats.achievementsCount}</span>
                          );
                        })()}
                      </div>
                      {(() => {
                        const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                        return (
                          <p className="text-xs text-gray-600 mt-1">Últimos 30 días: +{selectedStudent.stats.trends.pointsEarned} puntos</p>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* Registro semanal de emociones */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Registro Semanal de Emociones</h4>
                    <div className="flex justify-between items-end">
                      {(() => {
                        const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                        return Object.entries(selectedStudent.stats.weeklyMood).map(([day, value], idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div className="text-xs text-gray-500 mb-1">{day.charAt(0).toUpperCase() + day.slice(1, 3)}</div>
                            <div 
                              className={`w-6 rounded-t-sm ${value && value >= 7 ? 'bg-green-500' : value && value >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ height: value ? `${value * 4}px` : '0' }}
                            ></div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recomendaciones y observaciones */}
              <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Recomendaciones para el Tutor</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-violet-600 mr-2">•</span>
                    {(() => {
                      const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                      return (
                        <span>Reforzar actividades que promuevan la {selectedStudent.stats.skills.empathy < 7 ? 'empatía' : 'autorregulación'} a través de juegos de rol y conversaciones guiadas.</span>
                      );
                    })()}
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-600 mr-2">•</span>
                    <span>Establecer rutinas de check-in emocional diario para ayudar a identificar y nombrar emociones.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-600 mr-2">•</span>
                    <span>Practicar técnicas de respiración y mindfulness para momentos de estrés o frustración.</span>
                  </li>
                  {(() => {
                    const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                    return selectedStudent.stats.participationRate < 80 && (
                    <li className="flex items-start">
                      <span className="text-violet-600 mr-2">•</span>
                      <span>Fomentar la participación mediante actividades de interés específico relacionadas con {(() => {
                        const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                        return selectedStudent.interests?.[0] || 'sus temas favoritos';
                      })()}.</span>
                    </li>
                    );
                  })()}
                </ul>
              </div>
              
              {/* Botones de acción */}
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exportando...
                    </>
                  ) : (
                    <>Descargar Informe</>
                  )}
                </button>
                <button 
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center"
                  onClick={() => {
                    const selectedStudent = filteredStudents.find(s => s.id === selectedStudentId) || filteredStudents[0];
                    alert(`Se ha enviado un mensaje al tutor de ${selectedStudent.name} ${selectedStudent.lastName}`);
                  }}
                >
                  Contactar Tutor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
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
