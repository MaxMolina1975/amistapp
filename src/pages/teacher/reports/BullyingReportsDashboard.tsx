import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Filter, 
  Calendar, 
  Download, 
  RefreshCw, 
  ChevronDown,
  AlertTriangle,
  Users,
  MapPin,
  Clock,
  Search
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// Tipos para los datos de reportes
interface BullyingReport {
  id: number;
  studentName: string;
  incidentType: string;
  description: string;
  date: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  isAnonymous: boolean;
}

interface StatisticsData {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  inProgressReports: number;
  byType: Record<string, number>;
  byLocation: Record<string, number>;
  byMonth: Record<string, number>;
  bySeverity: Record<string, number>;
}

type TimeRange = 'week' | 'month' | 'trimester' | 'year';
type FilterStatus = 'all' | 'pending' | 'in-progress' | 'resolved';

export function BullyingReportsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<BullyingReport[]>([]);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  
  // Cargar datos simulados al iniciar
  useEffect(() => {
    loadReportsData();
  }, [timeRange, filterStatus]);
  
  // Función para cargar datos simulados
  const loadReportsData = () => {
    setIsLoading(true);
    
    // Simulamos la carga de datos
    setTimeout(() => {
      // Datos simulados de reportes
      const mockReports: BullyingReport[] = [
        {
          id: 1,
          studentName: 'Carlos Rodríguez',
          incidentType: 'bullying',
          description: 'Insultos y burlas durante el recreo',
          date: '2025-03-15',
          location: 'Patio de recreo',
          status: 'resolved',
          severity: 'medium',
          isAnonymous: false
        },
        {
          id: 2,
          studentName: 'Anónimo',
          incidentType: 'cyberbullying',
          description: 'Mensajes ofensivos en grupo de WhatsApp de la clase',
          date: '2025-03-18',
          location: 'Online',
          status: 'in-progress',
          severity: 'high',
          isAnonymous: true
        },
        {
          id: 3,
          studentName: 'María López',
          incidentType: 'discriminacion',
          description: 'Exclusión de actividades grupales',
          date: '2025-03-10',
          location: 'Aula 203',
          status: 'pending',
          severity: 'medium',
          isAnonymous: false
        },
        {
          id: 4,
          studentName: 'Anónimo',
          incidentType: 'bullying',
          description: 'Empujones en la fila del comedor',
          date: '2025-03-05',
          location: 'Comedor',
          status: 'resolved',
          severity: 'low',
          isAnonymous: true
        },
        {
          id: 5,
          studentName: 'Juan Pérez',
          incidentType: 'acoso',
          description: 'Seguimiento constante y amenazas',
          date: '2025-03-20',
          location: 'Pasillos',
          status: 'in-progress',
          severity: 'high',
          isAnonymous: false
        },
        {
          id: 6,
          studentName: 'Laura Gómez',
          incidentType: 'cyberbullying',
          description: 'Difusión de fotos modificadas en redes sociales',
          date: '2025-03-12',
          location: 'Online',
          status: 'pending',
          severity: 'high',
          isAnonymous: false
        },
        {
          id: 7,
          studentName: 'Anónimo',
          incidentType: 'discriminacion',
          description: 'Comentarios despectivos sobre origen étnico',
          date: '2025-03-08',
          location: 'Aula 105',
          status: 'resolved',
          severity: 'medium',
          isAnonymous: true
        },
      ];
      
      // Filtrar reportes según el estado seleccionado
      const filteredReports = filterStatus === 'all' 
        ? mockReports 
        : mockReports.filter(report => report.status === filterStatus);
      
      // Filtrar por búsqueda si hay texto en el campo de búsqueda
      const searchedReports = searchQuery 
        ? filteredReports.filter(report => 
            report.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.location.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : filteredReports;
      
      setReports(searchedReports);
      
      // Calcular estadísticas
      const byType: Record<string, number> = {};
      const byLocation: Record<string, number> = {};
      const byMonth: Record<string, number> = {};
      const bySeverity: Record<string, number> = {};
      
      mockReports.forEach(report => {
        // Por tipo
        byType[report.incidentType] = (byType[report.incidentType] || 0) + 1;
        
        // Por ubicación
        byLocation[report.location] = (byLocation[report.location] || 0) + 1;
        
        // Por mes
        const month = report.date.substring(0, 7); // YYYY-MM
        byMonth[month] = (byMonth[month] || 0) + 1;
        
        // Por severidad
        bySeverity[report.severity] = (bySeverity[report.severity] || 0) + 1;
      });
      
      setStatistics({
        totalReports: mockReports.length,
        resolvedReports: mockReports.filter(r => r.status === 'resolved').length,
        pendingReports: mockReports.filter(r => r.status === 'pending').length,
        inProgressReports: mockReports.filter(r => r.status === 'in-progress').length,
        byType,
        byLocation,
        byMonth,
        bySeverity
      });
      
      setIsLoading(false);
    }, 800);
  };
  
  // Función para obtener el color según la severidad
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  // Función para obtener el color según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-amber-600 bg-amber-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  // Función para obtener el texto del estado en español
  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return 'Resuelto';
      case 'in-progress': return 'En proceso';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };
  
  // Función para obtener el texto del tipo de incidente en español
  const getIncidentTypeText = (type: string) => {
    switch (type) {
      case 'bullying': return 'Bullying';
      case 'cyberbullying': return 'Cyberbullying';
      case 'discriminacion': return 'Discriminación';
      case 'acoso': return 'Acoso';
      default: return 'Otro';
    }
  };
  
  // Función para obtener el texto de la severidad en español
  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return severity;
    }
  };
  
  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Reportes de Bullying</h1>
        <p className="text-gray-600">Visualiza y gestiona los reportes de incidentes de bullying</p>
      </header>
      
      {/* Filtros y controles */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="in-progress">En proceso</option>
                <option value="resolved">Resueltos</option>
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
            
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar reportes..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              onClick={() => loadReportsData()}
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
      
      {/* Tarjetas de estadísticas */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-violet-100 text-violet-600 mr-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de reportes</p>
                <h3 className="text-xl font-bold text-gray-800">{statistics.totalReports}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resueltos</p>
                <h3 className="text-xl font-bold text-gray-800">{statistics.resolvedReports}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">En proceso</p>
                <h3 className="text-xl font-bold text-gray-800">{statistics.inProgressReports}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <h3 className="text-xl font-bold text-gray-800">{statistics.pendingReports}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico por tipo de incidente */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reportes por tipo de incidente</h2>
          <div className="h-64 flex items-center justify-center">
            {isLoading ? (
              <p className="text-gray-500">Cargando datos...</p>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto text-violet-500 mb-2" />
                  <p className="text-sm text-gray-500">Gráfico de distribución por tipo</p>
                  {statistics && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {Object.entries(statistics.byType).map(([type, count]) => (
                        <div key={type} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${type === 'bullying' ? 'bg-red-500' : type === 'cyberbullying' ? 'bg-blue-500' : type === 'discriminacion' ? 'bg-amber-500' : 'bg-purple-500'}`}></div>
                          <span className="text-sm">{getIncidentTypeText(type)}: {count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Gráfico por ubicación */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reportes por ubicación</h2>
          <div className="h-64 flex items-center justify-center">
            {isLoading ? (
              <p className="text-gray-500">Cargando datos...</p>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-violet-500 mb-2" />
                  <p className="text-sm text-gray-500">Gráfico de distribución por ubicación</p>
                  {statistics && (
                    <div className="mt-4 space-y-2">
                      {Object.entries(statistics.byLocation).map(([location, count]) => (
                        <div key={location} className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-violet-500 mr-2"></div>
                          <span className="text-sm">{location}: {count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabla de reportes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Listado de reportes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    Cargando reportes...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron reportes con los filtros actuales
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.isAnonymous ? 'Anónimo' : report.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getIncidentTypeText(report.incidentType)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {report.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(report.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getSeverityColor(report.severity)
                      )}>
                        {getSeverityText(report.severity)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getStatusColor(report.status)
                      )}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-violet-600 hover:text-violet-900 mr-3">Ver</button>
                      <button className="text-violet-600 hover:text-violet-900">Actualizar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Notas y recomendaciones */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recomendaciones</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Áreas de atención prioritaria</h3>
              <p className="mt-1 text-sm text-gray-500">
                Basado en los reportes recientes, se recomienda aumentar la supervisión en el patio de recreo y monitorear las interacciones en línea.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Intervenciones grupales</h3>
              <p className="mt-1 text-sm text-gray-500">
                Considere realizar talleres sobre respeto y empatía en los grupos donde se han reportado más incidentes.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <MapPin className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Zonas de mayor incidencia</h3>
              <p className="mt-1 text-sm text-gray-500">
                Los reportes indican que las áreas con mayor incidencia son el patio de recreo y los pasillos. Se recomienda aumentar la presencia de personal en estas zonas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}