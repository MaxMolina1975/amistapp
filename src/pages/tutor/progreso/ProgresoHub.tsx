import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/context/AuthContext';
import { useStudents, StudentWithStats } from '../../../lib/types/student';
import { 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  Users, 
  ChevronDown,
  ArrowRight,
  Filter
} from 'lucide-react';

// Datos simulados para gráficos
const emotionalTrends = [
  { month: 'Ene', value: 65 },
  { month: 'Feb', value: 70 },
  { month: 'Mar', value: 68 },
  { month: 'Abr', value: 75 },
  { month: 'May', value: 80 },
  { month: 'Jun', value: 85 }
];

export function ProgresoHub() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('trimestre');
  const { students: myStudents, loading: isLoading, error } = useStudents(undefined, currentUser?.id);
  
  // Indicadores promedio para todos los estudiantes
  const averageEmotionalIndex = myStudents.length > 0
    ? Math.round(myStudents.reduce((acc, student) => acc + student.stats.emotionalIndex, 0) / myStudents.length)
    : 0;
  
  const averageParticipation = myStudents.length > 0
    ? Math.round(myStudents.reduce((acc, student) => acc + student.stats.participationRate, 0) / myStudents.length)
    : 0;
  
  const averageAttendance = myStudents.length > 0
    ? Math.round(myStudents.reduce((acc, student) => acc + student.stats.attendanceRate, 0) / myStudents.length)
    : 0;

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudent(parseInt(e.target.value));
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Progreso Socioemocional</h1>
          <p className="text-gray-600">Monitoreo del desarrollo de tus estudiantes</p>
        </header>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando datos de progreso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Progreso Socioemocional</h1>
          <p className="text-gray-600">Monitoreo del desarrollo de tus estudiantes</p>
        </header>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
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
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Progreso Socioemocional</h1>
        <p className="text-gray-600">Monitoreo del desarrollo de tus estudiantes</p>
      </header>

      {/* Filtros y controles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-1">
              Estudiante
            </label>
            <select 
              id="student-select"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={selectedStudent || ''}
              onChange={handleStudentChange}
            >
              <option value="">Todos los estudiantes</option>
              {myStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.lastName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-2 rounded-lg text-sm ${
                  selectedPeriod === 'mes' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handlePeriodChange('mes')}
              >
                Mes actual
              </button>
              <button 
                className={`px-3 py-2 rounded-lg text-sm ${
                  selectedPeriod === 'trimestre' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handlePeriodChange('trimestre')}
              >
                Trimestre
              </button>
              <button 
                className={`px-3 py-2 rounded-lg text-sm ${
                  selectedPeriod === 'año' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handlePeriodChange('año')}
              >
                Año escolar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <BarChart2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Índice Emocional</p>
              <p className="text-xl font-bold text-gray-800">{averageEmotionalIndex}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${averageEmotionalIndex}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Promedio de todos los estudiantes {selectedPeriod === 'mes' ? 'este mes' : 
              selectedPeriod === 'trimestre' ? 'este trimestre' : 'este año escolar'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Participación</p>
              <p className="text-xl font-bold text-gray-800">{averageParticipation}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${averageParticipation}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Basado en participación en actividades y ejercicios
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Asistencia</p>
              <p className="text-xl font-bold text-gray-800">{averageAttendance}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ width: `${averageAttendance}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Asistencia promedio a actividades programadas
          </p>
        </div>
      </div>

      {/* Gráfico de tendencia emocional */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Tendencia Emocional</h2>
          <button className="text-sm text-violet-600 hover:text-violet-800 flex items-center">
            <span>Descargar reporte</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="h-60 flex items-end space-x-3 pb-4">
          {emotionalTrends.map((month, index) => (
            <div 
              key={month.month} 
              className="flex-1 flex flex-col items-center"
            >
              <div 
                className={`w-full bg-violet-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity`}
                style={{ 
                  height: `${month.value}%`, 
                  backgroundColor: month.value >= 80 ? '#10b981' : month.value >= 60 ? '#6366f1' : '#ef4444'
                }}
              ></div>
              <p className="text-xs font-medium text-gray-500 mt-2">{month.month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Estudiantes con necesidad de atención */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-4 py-3 bg-red-50 border-b border-red-100">
          <h2 className="text-lg font-medium text-red-800">Estudiantes que necesitan atención</h2>
          <p className="text-sm text-red-600">Alumnos con indicadores por debajo del umbral esperado</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {myStudents
            .filter(student => student.stats.emotionalIndex < 60)
            .map(student => (
              <div key={student.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      {student.profileImage ? (
                        <img 
                          src={student.profileImage}
                          alt={`${student.name} ${student.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <span className="text-red-600 font-medium">
                          {student.name[0]}{student.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{student.name} {student.lastName}</p>
                      <div className="flex items-center">
                        <div className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs mr-2">
                          {student.stats.emotionalIndex}% Índice Emocional
                        </div>
                        <span className="text-sm text-gray-500">Grado: {student.grade}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/tutor/estudiantes/perfil/${student.id}`)}
                    className="text-violet-600 hover:text-violet-800"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            
          {myStudents.filter(student => student.stats.emotionalIndex < 60).length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">¡Todos los estudiantes están bien!</h3>
              <p className="text-gray-500 mb-4">
                Actualmente no hay estudiantes que requieran atención especial
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recomendaciones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Recomendaciones para Tutores</h2>
        
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-1">Comunicación Constante</h3>
            <p className="text-sm text-blue-700">
              Mantén comunicación regular con docentes y estudiantes para estar al tanto de situaciones importantes.
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <h3 className="font-medium text-green-800 mb-1">Ambiente de Confianza</h3>
            <p className="text-sm text-green-700">
              Crea un espacio donde los estudiantes se sientan cómodos compartiendo sus experiencias y emociones.
            </p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-medium text-purple-800 mb-1">Seguimiento Personalizado</h3>
            <p className="text-sm text-purple-700">
              Realiza seguimiento individualizado para cada estudiante basado en sus necesidades específicas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgresoHub;
