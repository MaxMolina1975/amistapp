import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileImage, Check, X } from 'lucide-react';

// Tipos de exportación disponibles
type ExportFormat = 'pdf' | 'excel' | 'csv' | 'image';

interface ExportOption {
  id: ExportFormat;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface ReportExportProps {
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
}

export const ReportExport: React.FC<ReportExportProps> = ({ onExport, isExporting }) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<ExportFormat | null>(null);
  
  // Opciones de exportación
  const exportOptions: ExportOption[] = [
    {
      id: 'pdf',
      label: 'PDF',
      icon: <FileText className="h-5 w-5 text-red-500" />,
      description: 'Documento PDF con gráficos y tablas'
    },
    {
      id: 'excel',
      label: 'Excel',
      icon: <FileSpreadsheet className="h-5 w-5 text-green-600" />,
      description: 'Hoja de cálculo Excel para análisis avanzado'
    },
    {
      id: 'csv',
      label: 'CSV',
      icon: <FileText className="h-5 w-5 text-gray-600" />,
      description: 'Datos en formato CSV para importar en otras aplicaciones'
    },
    {
      id: 'image',
      label: 'Imagen',
      icon: <FileImage className="h-5 w-5 text-blue-500" />,
      description: 'Imagen PNG de alta resolución de los gráficos'
    }
  ];
  
  // Manejador de exportación
  const handleExport = (format: ExportFormat) => {
    onExport(format);
    setShowExportOptions(false);
    
    // Simulación de exportación exitosa
    setTimeout(() => {
      setExportSuccess(format);
      setTimeout(() => setExportSuccess(null), 3000);
    }, 2000);
  };
  
  return (
    <div className="relative">
      <button 
        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        onClick={() => setShowExportOptions(!showExportOptions)}
        disabled={isExporting}
      >
        <Download className="h-5 w-5 mr-2" />
        <span>Exportar</span>
      </button>
      
      {/* Opciones de exportación */}
      {showExportOptions && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-700 mb-2 px-2 py-1">
              Formato de exportación
            </div>
            {exportOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleExport(option.id)}
                className="w-full flex items-start px-3 py-2 text-sm text-left rounded-md hover:bg-gray-50 transition-colors"
                disabled={isExporting}
              >
                <div className="mt-0.5 mr-3">{option.icon}</div>
                <div>
                  <div className="font-medium text-gray-800">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Notificación de éxito */}
      {exportSuccess && (
        <div className="absolute top-full right-0 mt-3 w-64 bg-green-50 border border-green-200 rounded-lg p-3 shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Exportación exitosa
              </p>
              <p className="text-xs text-green-700 mt-1">
                {`El informe ha sido exportado en formato ${exportSuccess.toUpperCase()}`}
              </p>
            </div>
            <button 
              className="ml-auto"
              onClick={() => setExportSuccess(null)}
            >
              <X className="h-4 w-4 text-green-700" />
            </button>
          </div>
        </div>
      )}
      
      {/* Indicador de carga */}
      {isExporting && (
        <div className="absolute top-full right-0 mt-3 w-64 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                Exportando informe...
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Esto puede tardar unos segundos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
