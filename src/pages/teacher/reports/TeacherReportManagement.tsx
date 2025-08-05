import { useState, useEffect } from 'react';
import { 
  Flag, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertOctagon,
  EyeOff,
  MessageSquare,
  Eye,
  Filter,
  Search,
  User
} from 'lucide-react';
import { useReports } from '../../../lib/hooks/useReports';
import { Report, ReportType, ReportPriority } from '../../../lib/types';

export function TeacherReportManagement() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [resolutionText, setResolutionText] = useState('');

  // TODO: Get actual teacher ID from auth context
  const { reports, stats, updateReportStatus, loading, error, refreshReports } = useReports('teacher123', true);

  // Filtrar reportes según los criterios seleccionados
  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority;
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleResolveReport = async () => {
    if (!selectedReport) return;
    
    await updateReportStatus(selectedReport.id, 'resolved', resolutionText);
    setSelectedReport(null);
    setResolutionText('');
  };

  const handleDismissReport = async () => {
    if (!selectedReport) return;
    
    await updateReportStatus(selectedReport.id, 'closed', resolutionText);
    setSelectedReport(null);
    setResolutionText('');
  };

  const handleReviewReport = async () => {
    if (!selectedReport) return;
    
    await updateReportStatus(selectedReport.id, 'in_progress');
  };

  const getPriorityColor = (priority: ReportPriority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_progress': return <Eye className="w-5 h-5 text-blue-500" />;
      case 'resolved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'closed': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'resolved': return 'bg-green-50 text-green-600 border-green-200';
      case 'closed': return 'bg-red-50 text-red-600 border-red-200';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_progress': return 'En revisión';
      case 'resolved': return 'Resuelto';
      case 'closed': return 'Cerrado';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6 flex items-center justify-center">
      <div className="text-gray-500">Cargando reportes...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
        {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Reportes</h1>
        <p className="text-gray-600">Administra y da seguimiento a los reportes de los estudiantes</p>
      </header>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-700">Pendientes</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600 text-center py-2">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-700">En Revisión</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 text-center py-2">{reports.filter(r => r.status === 'in_progress').length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-700">Urgentes</h3>
            </div>
            <p className="text-3xl font-bold text-red-600 text-center py-2">{stats.urgent}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-700">Resueltos</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 text-center py-2">{stats.resolved}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar reportes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="in_progress">En revisión</option>
                <option value="resolved">Resueltos</option>
                <option value="closed">Cerrados</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4 mb-8">
        {filteredReports.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No hay reportes</h3>
            <p className="text-gray-500">No se encontraron reportes que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div 
              key={report.id} 
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  {getStatusIcon(report.status)}
                  <div>
                    <h3 className="font-medium text-gray-800">{report.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()} - {report.anonymous ? 'Anónimo' : report.studentName}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                    {getStatusText(report.status)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(report.priority)}`}>
                    {report.priority === 'urgent' ? 'Urgente' :
                     report.priority === 'high' ? 'Alta' :
                     report.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{report.description}</p>
              <div className="flex items-center text-xs text-gray-500">
                <div className="flex items-center mr-4">
                  <User className="w-3 h-3 mr-1" />
                  <span>{report.anonymous ? 'Reporte anónimo' : 'Identificado'}</span>
                </div>
                {report.type && (
                  <div className="flex items-center">
                    <Flag className="w-3 h-3 mr-1" />
                    <span>
                      {report.type === 'bullying' ? 'Acoso escolar' :
                       report.type === 'behavior' ? 'Comportamiento' :
                       report.type === 'academic' ? 'Académico' :
                       report.type === 'suggestion' ? 'Sugerencia' : 'Otro'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedReport.status)}
                  <h2 className="text-xl font-semibold text-gray-800">{selectedReport.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedReport.status)}`}>
                  {getStatusText(selectedReport.status)}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedReport.priority)}`}>
                  {selectedReport.priority === 'urgent' ? 'Urgente' :
                   selectedReport.priority === 'high' ? 'Alta' :
                   selectedReport.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
                {selectedReport.type && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {selectedReport.type === 'bullying' ? 'Acoso escolar' :
                     selectedReport.type === 'behavior' ? 'Comportamiento' :
                     selectedReport.type === 'academic' ? 'Académico' :
                     selectedReport.type === 'suggestion' ? 'Sugerencia' : 'Otro'}
                  </span>
                )}
                {selectedReport.anonymous && (
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600">
                    Anónimo
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">
                  Reportado el {new Date(selectedReport.createdAt).toLocaleDateString()} a las {new Date(selectedReport.createdAt).toLocaleTimeString()}
                </p>
                {!selectedReport.anonymous && (
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    Por: {selectedReport.studentName}
                  </p>
                )}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedReport.description}</p>
                </div>
                
                {selectedReport.location && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Lugar del incidente:</h3>
                    <p className="text-gray-800">{selectedReport.location}</p>
                  </div>
                )}
                
                {selectedReport.date && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Fecha del incidente:</h3>
                    <p className="text-gray-800">{new Date(selectedReport.date).toLocaleDateString()}</p>
                  </div>
                )}
                
                {selectedReport.resolution && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                    <h3 className="text-sm font-medium text-green-700 mb-2">Resolución:</h3>
                    <p className="text-green-800 whitespace-pre-wrap">{selectedReport.resolution}</p>
                  </div>
                )}
              </div>
              
              {selectedReport.status !== 'resolved' && selectedReport.status !== 'dismissed' && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Resolución:</h3>
                  <textarea
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Escribe aquí la resolución o seguimiento de este reporte..."
                  />
                </div>
              )}
              
              <div className="mt-6 flex flex-wrap gap-3 justify-end">
                {selectedReport.status === 'pending' && (
                  <button
                    onClick={handleReviewReport}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Marcar en revisión
                  </button>
                )}
                
                {(selectedReport.status === 'pending' || selectedReport.status === 'in_review') && (
                  <>
                    <button
                      onClick={handleDismissReport}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Descartar
                    </button>
                    
                    <button
                      onClick={handleResolveReport}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      disabled={!resolutionText.trim() && selectedReport.status !== 'resolved'}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolver
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}