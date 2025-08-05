import React from 'react';
import { Report } from '../../lib/types';
import { AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface ReportsListProps {
  reports: Report[];
  onResolve: (reportId: string) => void;
}

export function ReportsList({ reports, onResolve }: ReportsListProps) {
  const getPriorityColor = (priority: Report['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Reportes Pendientes</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {reports.map((report) => (
          <div key={report.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  report.anonymous ? 'bg-gray-100' : 'bg-blue-100'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    report.anonymous ? 'text-gray-600' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{report.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(report.priority)}`}>
                {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{report.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {report.status === 'pending' && (
                  <Clock className="w-5 h-5 text-yellow-500" />
                )}
                {report.status === 'in_review' && (
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                )}
                {report.status === 'resolved' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <span className="text-sm text-gray-500">
                  {report.status === 'pending' ? 'Pendiente' :
                   report.status === 'in_review' ? 'En revisión' :
                   'Resuelto'}
                </span>
              </div>

              {report.status !== 'resolved' && (
                <button
                  onClick={() => onResolve(report.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Resolver
                </button>
              )}
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay reportes pendientes
          </div>
        )}
      </div>
    </div>
  );
}