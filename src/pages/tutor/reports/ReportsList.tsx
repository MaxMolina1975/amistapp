import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/context/AuthContext';
import { useStudents, StudentWithStats } from '../../../lib/types/student';
import { 
  BarChart3, Calendar, UserCircle, FileText, 
  Download, ChevronDown, ChevronRight
} from 'lucide-react';

// Mock report type
interface Report {
  id: number;
  studentId: number;
  title: string;
  type: 'monthly' | 'quarterly' | 'semestral' | 'annual';
  date: string;
  status: 'published' | 'draft';
}

// Mock reports data
const mockReports: Report[] = [
  {
    id: 1,
    studentId: 1,
    title: 'Informe mensual - Marzo 2025',
    type: 'monthly',
    date: '2025-03-25',
    status: 'published'
  },
  {
    id: 2,
    studentId: 2,
    title: 'Informe mensual - Marzo 2025',
    type: 'monthly',
    date: '2025-03-24',
    status: 'published'
  },
  {
    id: 3,
    studentId: 3,
    title: 'Informe mensual - Marzo 2025',
    type: 'monthly',
    date: '2025-03-23',
    status: 'published'
  },
  {
    id: 4,
    studentId: 1,
    title: 'Informe trimestral - Q1 2025',
    type: 'quarterly',
    date: '2025-03-27',
    status: 'draft'
  }
];

export default function ReportsList() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { students: myStudents, loading, error } = useStudents(undefined, currentUser?.id);
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);
  
  // Group reports by student
  const reportsByStudent = myStudents.map(student => {
    const studentReports = mockReports.filter(report => report.studentId === student.id);
    return {
      student,
      reports: studentReports
    };
  });

  const toggleExpand = (studentId: number) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch(type) {
      case 'monthly': return 'Mensual';
      case 'quarterly': return 'Trimestral';
      case 'semestral': return 'Semestral';
      case 'annual': return 'Anual';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Informes</h1>
          <p className="text-gray-600">Consulta y descarga informes de progreso</p>
        </header>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando informes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Informes</h1>
          <p className="text-gray-600">Consulta y descarga informes de progreso</p>
        </header>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-red-600 mb-4">Error al cargar informes: {error}</p>
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
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Informes</h1>
        <p className="text-gray-600">Consulta y descarga informes de progreso</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de informes</p>
              <p className="text-lg font-bold text-gray-800">{mockReports.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Último informe</p>
              <p className="text-lg font-bold text-gray-800">27/03/2025</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Informes pendientes</p>
              <p className="text-lg font-bold text-gray-800">1</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Informes por estudiante</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {reportsByStudent.length > 0 ? (
            reportsByStudent.map(({ student, reports }) => (
              <div key={student.id}>
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(student.id as number)}
                >
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
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      {reports.length} informes
                    </div>
                    {expandedStudent === student.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {expandedStudent === student.id && (
                  <div className="bg-gray-50 p-4">
                    {reports.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-sm font-medium text-gray-500">
                              <th className="pb-2">Título</th>
                              <th className="pb-2">Tipo</th>
                              <th className="pb-2">Fecha</th>
                              <th className="pb-2">Estado</th>
                              <th className="pb-2">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.map(report => (
                              <tr key={report.id} className="text-sm">
                                <td className="py-2 pr-4">{report.title}</td>
                                <td className="py-2 pr-4">
                                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                                    {getReportTypeLabel(report.type)}
                                  </span>
                                </td>
                                <td className="py-2 pr-4">
                                  {new Date(report.date).toLocaleDateString('es-ES')}
                                </td>
                                <td className="py-2 pr-4">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    report.status === 'published' 
                                      ? 'bg-green-50 text-green-600' 
                                      : 'bg-yellow-50 text-yellow-600'
                                  }`}>
                                    {report.status === 'published' ? 'Publicado' : 'Borrador'}
                                  </span>
                                </td>
                                <td className="py-2">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => navigate(`/tutor/reports/view/${report.id}`)}
                                      className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                      title="Ver informe"
                                    >
                                      <FileText className="w-4 h-4" />
                                    </button>
                                    <button 
                                      className="p-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                                      title="Descargar"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No hay informes disponibles para este estudiante
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No hay informes disponibles</h3>
              <p className="text-gray-500 mb-4">
                No se encontraron informes para tus estudiantes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
