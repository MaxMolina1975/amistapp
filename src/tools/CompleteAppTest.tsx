import { useState } from 'react';
import { runCompleteAppTest } from '../lib/tests/app-test';
import { Button } from '../components/ui/Button';

export function CompleteAppTest() {
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [testResults, setTestResults] = useState<string[]>([]);
  
  // Capturar los logs para mostrarlos en la UI
  const captureConsoleOutput = () => {
    const logs: string[] = [];
    
    // Guardar las funciones originales
    const originalLog = console.log;
    const originalError = console.error;
    
    // Sobrescribir console.log
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(message);
      originalLog(...args);
    };
    
    // Sobrescribir console.error
    console.error = (...args) => {
      const message = `ERROR: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')}`;
      logs.push(message);
      originalError(...args);
    };
    
    return {
      getLogs: () => logs,
      restore: () => {
        console.log = originalLog;
        console.error = originalError;
      }
    };
  };
  
  const runTests = async () => {
    setTestStatus('running');
    setTestResults([]);
    
    const logger = captureConsoleOutput();
    
    try {
      await runCompleteAppTest();
      setTestStatus('completed');
    } catch (error) {
      console.error('Error ejecutando pruebas:', error);
      setTestStatus('failed');
    } finally {
      setTestResults(logger.getLogs());
      logger.restore();
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Test Completo de AMISTAPP 2</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Este test verificará el funcionamiento de los siguientes componentes:
          </p>
          
          <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
            <li>Sistema de autenticación (login) para los tres roles</li>
            <li>Sistema de alertas y notificaciones</li>
            <li>Tablas de la base de datos</li>
            <li>Sistema de puntos y recompensas</li>
          </ul>
          
          <Button 
            variant="primary" 
            className="w-full md:w-auto"
            onClick={runTests}
            loading={testStatus === 'running'}
            disabled={testStatus === 'running'}
          >
            {testStatus === 'idle' ? 'Iniciar Test Completo' : 
             testStatus === 'running' ? 'Ejecutando...' : 
             testStatus === 'completed' ? 'Ejecutar Nuevamente' : 'Reintentar'}
          </Button>
        </div>
        
        {testResults.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h2 className="font-medium text-gray-800">
                Resultados del Test
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  testStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                  testStatus === 'failed' ? 'bg-red-100 text-red-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {testStatus === 'completed' ? 'Completado' : 
                   testStatus === 'failed' ? 'Error' : 'En progreso'}
                </span>
              </h2>
            </div>
            
            <div className="bg-gray-900 text-gray-100 p-4 overflow-auto max-h-96 font-mono text-sm">
              {testResults.map((log, index) => {
                // Aplicar colores según el contenido del log
                const isError = log.includes('ERROR') || log.includes('❌');
                const isSuccess = log.includes('✅');
                const isWarning = log.includes('⚠️');
                const isHeader = log.includes('===') || log.includes('---');
                
                return (
                  <div 
                    key={index} 
                    className={`${isHeader ? 'font-bold text-yellow-300' : 
                                isError ? 'text-red-400' : 
                                isSuccess ? 'text-green-400' : 
                                isWarning ? 'text-yellow-300' : 'text-gray-300'}`}
                  >
                    {log}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Nota: Algunas pruebas pueden fallar en entorno de desarrollo si el servidor backend no está en ejecución.</p>
          <p>Para pruebas completas, asegúrate de que el servidor esté ejecutándose en el puerto 3007.</p>
        </div>
      </div>
    </div>
  );
}

export default CompleteAppTest;