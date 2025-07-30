import React, { useState } from 'react';
import { 
  Flag, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertOctagon,
  EyeOff,
  Plus,
  X,
  MessageSquare,
  Eye
} from 'lucide-react';
import { useReports } from '../lib/hooks/useReports';
import { Report, ReportType, ReportPriority } from '../lib/types';

export function Reports() {
  const [showNewReportForm, setShowNewReportForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'behavioral' as ReportType,
    title: '',
    description: '',
    priority: 'medium' as ReportPriority,
    anonymous: false
  });

  // TODO: Get actual user ID from auth context
  const { reports, stats, createReport, loading, error } = useReports('user123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createReport(formData);
    if (success) {
      setShowNewReportForm(false);
      setFormData({
        type: 'behavioral',
        title: '',
        description: '',
        priority: 'medium',
        anonymous: false
      });
    }
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
      case 'in_progress': return 'En progreso';
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
        <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
        <p className="text-gray-600">Ayúdanos a mantener un ambiente seguro</p>
      </header>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-700">Pendientes</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600 text-center py-2">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-700">Urgentes</h3>
            </div>
            <p className="text-3xl font-bold text-red-600 text-center py-2">{stats.urgent}</p>
          </div>
        </div>
      )}

      {/* New Report Button */}
      <button 
        onClick={() => setShowNewReportForm(true)}
        className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Crear Nuevo Reporte</span>
        </div>
      </button>

      {/* New Report Modal */}
      {showNewReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Flag className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">Nuevo Reporte</h2>
              </div>
              <button 
                onClick={() => setShowNewReportForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Reporte
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ReportType }))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="behavioral">Comportamiento</option>
                  <option value="bullying">Acoso Escolar</option>
                  <option value="academic">Académico</option>
                  <option value="emotional">Emocional</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Escribe un título breve"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe la situación en detalle"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'urgent'] as ReportPriority[]).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority }))}
                      className={`p-2 rounded-lg border text-sm font-medium ${
                        formData.priority === priority
                          ? getPriorityColor(priority)
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700 flex items-center space-x-1">
                  <EyeOff className="w-4 h-4" />
                  <span>Mantener anónimo</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewReportForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Flag className="w-4 h-4" />
                  <span>Enviar Reporte</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay reportes para mostrar</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  report.anonymous ? 'bg-gray-100' : 'bg-blue-100'
                }`}>
                  {report.anonymous ? (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{report.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm border ${getPriorityColor(report.priority)}`}>
                    {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm border flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    <span>{getStatusText(report.status)}</span>
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{report.description}</p>
              {report.resolution && (
                <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Resolución:</span> {report.resolution}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}