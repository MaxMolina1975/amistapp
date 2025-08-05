import React, { useState, useEffect } from 'react';
import { runCompleteAlertsNotificationTest } from '../scripts/run-alerts-notification-test';
import { AlertType } from '../lib/services/AlertService';

// Interfaz para los resultados de las pruebas
interface TestResult {
  name: string;
  success: boolean;
  message: string;
  details?: any;
}

const AlertsNotificationTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<{ total: number; success: number; failed: number } | null>(null);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);

  // Función para ejecutar las pruebas
  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setSummary(null);

    try {
      // Añadir resultado inicial
      setResults([{
        name: 'Iniciando pruebas',
        success: true,
        message: 'Ejecutando pruebas de alertas y notificaciones...'
      }]);

      // Ejecutar las pruebas
      const testResults = await runCompleteAlertsNotificationTest();
      setResults(testResults);

      // Calcular resumen
      const successCount = testResults.filter(r => r.success).length;
      setSummary({
        total: testResults.length,
        success: successCount,
        failed: testResults.length - successCount
      });
    } catch (error) {
      setResults(prev => [...prev, {
        name: 'Error fatal',
        success: false,
        message: `Error al ejecutar las pruebas: ${error.message}`,
        details: error
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  // Función para reproducir un sonido específico
  const playSound = (soundFile: string, soundName: string) => {
    try {
      setSelectedSound(soundName);
      const audio = new Audio(soundFile);
      
      audio.onended = () => {
        setSelectedSound(null);
      };
      
      audio.play().catch(error => {
        console.error(`Error al reproducir ${soundName}:`, error);
        setSelectedSound(null);
      });
    } catch (error) {
      console.error(`Error al cargar ${soundName}:`, error);
      setSelectedSound(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-violet-700 mb-6">Test de Alertas y Notificaciones</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Prueba de Sonidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { type: AlertType.MESSAGE, file: '/sounds/message.mp3', name: 'Mensaje' },
            { type: AlertType.REPORT, file: '/sounds/report.mp3', name: 'Reporte' },
            { type: AlertType.IMPORTANT, file: '/sounds/important.mp3', name: 'Importante' },
            { type: AlertType.EMOTIONAL, file: '/sounds/emotional.mp3', name: 'Emocional' },
            { type: AlertType.BULLYING, file: '/sounds/urgent.mp3', name: 'Bullying (Urgente)' },
            { type: 'default', file: '/sounds/notification.mp3', name: 'Notificación por defecto' }
          ].map((sound, index) => (
            <button
              key={index}
              onClick={() => playSound(sound.file, sound.name)}
              disabled={selectedSound !== null}
              className={`p-4 rounded-lg flex items-center justify-center transition-colors ${selectedSound === sound.name
                ? 'bg-violet-600 text-white'
                : 'bg-violet-100 hover:bg-violet-200 text-violet-800'
              }`}
            >
              {selectedSound === sound.name ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reproduciendo...
                </span>
              ) : (
                <span>Reproducir {sound.name}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ejecutar Pruebas Completas</h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${isRunning
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-violet-600 hover:bg-violet-700 text-white'
          }`}
        >
          {isRunning ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Ejecutando pruebas...
            </span>
          ) : (
            'Iniciar Pruebas de Alertas y Notificaciones'
          )}
        </button>
      </div>

      {summary && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Resumen de Resultados</h2>
          <div className="flex space-x-4">
            <div className="px-4 py-2 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">Total</p>
              <p className="text-2xl font-bold text-blue-800">{summary.total}</p>
            </div>
            <div className="px-4 py-2 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800">Exitosas</p>
              <p className="text-2xl font-bold text-green-800">{summary.success}</p>
            </div>
            <div className="px-4 py-2 bg-red-100 rounded-lg">
              <p className="text-sm text-red-800">Fallidas</p>
              <p className="text-2xl font-bold text-red-800">{summary.failed}</p>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Resultados Detallados</h2>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${result.success 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${result.success ? 'bg-green-500' : 'bg-red-500'}`}>
                    {result.success ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-lg font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>{result.name}</h3>
                    <p className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>{result.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsNotificationTest;