import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudents } from '../../../lib/types/student';
import { useAuth } from '../../../lib/context/AuthContext';
import { 
  ArrowLeft, FileText, Download, Printer,
  BarChart3, Calendar, UserCircle
} from 'lucide-react';

// Mock report type
interface Report {
  id: number;
  studentId: number;
  title: string;
  type: 'monthly' | 'quarterly' | 'semestral' | 'annual';
  date: string;
  status: 'published' | 'draft';
  content: {
    academicPerformance: number;
    emotionalWellbeing: number;
    socialParticipation: number;
    attendance: number;
    observations: string;
    recommendations: string;
    strengths: string[];
    areasToImprove: string[];
  }
}

// Mock reports data
const mockReports: Report[] = [
  {
    id: 1,
    studentId: 1,
    title: 'Informe mensual - Marzo 2025',
    type: 'monthly',
    date: '2025-03-25',
    status: 'published',
    content: {
      academicPerformance: 85,
      emotionalWellbeing: 90,
      socialParticipation: 92,
      attendance: 98,
      observations: 'María ha demostrado un excelente progreso en sus habilidades socioemocionales este mes. Su interacción con compañeros y participación en clase han mejorado notablemente.',
      recommendations: 'Continuar reforzando sus habilidades de liderazgo y comunicación asertiva.',
      strengths: [
        'Alta capacidad de empatía',
        'Buena comunicación',
        'Participación activa en clase',
        'Resolución efectiva de conflictos'
      ],
      areasToImprove: [
        'Manejo de frustración',
        'Autocontrol en situaciones de estrés'
      ]
    }
  },
  {
    id: 2,
    studentId: 2,
    title: 'Informe mensual - Marzo 2025',
    type: 'monthly',
    date: '2025-03-24',
    status: 'published',
    content: {
      academicPerformance: 70,
      emotionalWellbeing: 65,
      socialParticipation: 78,
      attendance: 90,
      observations: 'Juan muestra progresos moderados en su adaptación social. Presenta ocasionales dificultades para regular sus emociones en situaciones de frustración.',
      recommendations: 'Trabajar técnicas de autorregulación emocional y fortalecer la comunicación asertiva.',
      strengths: [
        'Creatividad',
        'Perseverancia',
        'Honestidad'
      ],
      areasToImprove: [
        'Manejo de emociones',
        'Trabajo en equipo',
        'Comunicación asertiva',
        'Tolerancia a la frustración'
      ]
    }
  },
  {
    id: 3,
    studentId: 3,
    title: 'Informe mensual - Marzo 2025',
    type: 'monthly',
    date: '2025-03-23',
    status: 'published',
    content: {
      academicPerformance: 95,
      emotionalWellbeing: 90,
      socialParticipation: 95,
      attendance: 97,
      observations: 'Sofía continúa destacándose por su excelente desarrollo socioemocional. Muestra gran capacidad para colaborar con sus compañeros y resolver conflictos de manera constructiva.',
      recommendations: 'Fomentar oportunidades de liderazgo y mentoría con compañeros.',
      strengths: [
        'Excelente comunicación',
        'Liderazgo natural',
        'Alta empatía',
        'Autoregulación emocional avanzada',
        'Resolución efectiva de conflictos'
      ],
      areasToImprove: [
        'Perfeccionismo ocasional'
      ]
    }
  },
  {
    id: 4,
    studentId: 1,
    title: 'Informe trimestral - Q1 2025',
    type: 'quarterly',
    date: '2025-03-27',
    status: 'draft',
    content: {
      academicPerformance: 88,
      emotionalWellbeing: 92,
      socialParticipation: 94,
      attendance: 97,
      observations: 'A lo largo del trimestre, María ha mostrado un progreso consistente en todas las áreas socioemocionales. Su capacidad para colaborar efectivamente y resolver conflictos ha mejorado significativamente.',
      recommendations: 'Continuar fortaleciendo sus habilidades de liderazgo y brindarle oportunidades para mentorear a compañeros con dificultades.',
      strengths: [
        'Desarrollo avanzado de empatía',
        'Comunicación efectiva',
        'Colaboración',
        'Resolución de problemas'
      ],
      areasToImprove: [
        'Autoconfianza en situaciones nuevas',
        'Manejo del estrés en períodos de evaluación'
      ]
    }
  }
];

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { students, loading: studentsLoading, error: studentsError, refetch: refetchStudents } = useStudents(currentUser?.id);
  const [report, setReport] = useState<Report | null>(null);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundReport = mockReports.find(r => r.id.toString() === id);
    setReport(foundReport || null);
    
    if (foundReport && students.length > 0) {
      const relatedStudent = students.find(s => s.id === foundReport.studentId);
      setStudent(relatedStudent || null);
    }
  }, [id, students]);

  // Loading state
  if (studentsLoading) {
    return (
      <div className="p-6 text-center">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <span className="ml-3 text-gray-600">Cargando informe...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (studentsError) {
    return (
      <div className="p-6 text-center">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar los datos</h3>
            <p className="text-gray-600 mb-4">No se pudieron cargar los datos del informe.</p>
            <button
              onClick={refetchStudents}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report || !student) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">Informe no encontrado</h3>
        <p className="text-gray-500 mb-4">No se encontró el informe solicitado</p>
        <button 
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          onClick={() => navigate('/tutor/reports')}
        >
          Volver a informes
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/tutor/reports')}
            className="mr-3 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{report.title}</h1>
            <p className="text-gray-600">
              Informe {report.type === 'monthly' ? 'mensual' : 
                       report.type === 'quarterly' ? 'trimestral' : 
                       report.type === 'semestral' ? 'semestral' : 'anual'} • 
              {new Date(report.date).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="p-2 border rounded-lg hover:bg-gray-50"
            title="Descargar informe"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 border rounded-lg hover:bg-gray-50"
            title="Imprimir informe"
          >
            <Printer className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
              {student.profileImage ? (
                <img 
                  src={student.profileImage} 
                  alt={`${student.name} ${student.lastName}`}
                  className="w-10 h-10 rounded-full object-cover" 
                />
              ) : (
                <UserCircle className="w-6 h-6 text-violet-500" />
              )}
            </div>
            <div>
              <div className="font-medium">{student.name} {student.lastName}</div>
              <div className="text-sm text-gray-500">{student.grade} {student.group}</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Resumen del período</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Rendimiento académico</span>
                    <span className="text-sm text-gray-500">{report.content.academicPerformance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{width: `${report.content.academicPerformance}%`}}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Bienestar emocional</span>
                    <span className="text-sm text-gray-500">{report.content.emotionalWellbeing}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-violet-600 h-2.5 rounded-full" 
                      style={{width: `${report.content.emotionalWellbeing}%`}}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Participación social</span>
                    <span className="text-sm text-gray-500">{report.content.socialParticipation}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{width: `${report.content.socialParticipation}%`}}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Asistencia</span>
                    <span className="text-sm text-gray-500">{report.content.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-600 h-2.5 rounded-full" 
                      style={{width: `${report.content.attendance}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Fortalezas</h3>
              <ul className="space-y-2 mb-6">
                {report.content.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Áreas de mejora</h3>
              <ul className="space-y-2">
                {report.content.areasToImprove.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mr-2 mt-0.5">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    </div>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Observaciones</h3>
          <p className="text-gray-700 mb-6">{report.content.observations}</p>
          
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recomendaciones</h3>
          <p className="text-gray-700">{report.content.recommendations}</p>
        </div>
      </div>
    </div>
  );
}
