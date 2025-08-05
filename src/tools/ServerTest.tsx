import { useState, useEffect } from 'react';
import { checkServerHealth, login } from '../lib/api';
import { Button } from '../components/ui/Button';

export function ServerTest() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [loginStatus, setLoginStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [loginResponse, setLoginResponse] = useState<any>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setServerStatus('checking');
    try {
      const isOnline = await checkServerHealth();
      console.log('Resultado de checkServerHealth:', isOnline);
      setServerStatus(isOnline ? 'online' : 'offline');
    } catch (error) {
      console.error('Error en checkConnection:', error);
      setServerStatus('offline');
    }
  };

  const testLogin = async () => {
    setLoginStatus('testing');
    try {
      // Probar con las credenciales de docente de prueba
      const response = await login({
        email: 'docente.test@amistaap.edu',
        password: 'password123'
      });
      
      console.log('Respuesta de login:', response);
      setLoginResponse(response);
      setLoginStatus(response.error ? 'failed' : 'success');
    } catch (error: any) {
      console.error('Error en testLogin:', error);
      setLoginStatus('failed');
      setLoginResponse({ 
        error: 'Error de conexión', 
        details: error.message || 'Error desconocido' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Prueba de Conexión AMISTAAP</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Estado del Servidor</h2>
          <div className="flex items-center">
            <div 
              className={`w-3 h-3 rounded-full mr-2 ${
                serverStatus === 'online' ? 'bg-green-500' : 
                serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
              }`} 
            />
            <span className="text-gray-700">
              {serverStatus === 'online' ? 'Conectado' : 
               serverStatus === 'offline' ? 'Desconectado' : 'Verificando...'}
            </span>
          </div>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={checkConnection}
            loading={serverStatus === 'checking'}
          >
            Verificar conexión
          </Button>
        </div>
        
        {serverStatus === 'online' && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Prueba de Autenticación</h2>
            <p className="text-sm text-gray-600 mb-2">
              Intenta iniciar sesión con el usuario docente de prueba.
            </p>
            <Button 
              variant="primary" 
              className="mb-2"
              onClick={testLogin}
              loading={loginStatus === 'testing'}
              disabled={loginStatus === 'testing'}
            >
              Probar Login
            </Button>
            
            {loginStatus !== 'idle' && (
              <div className={`mt-4 p-4 rounded-lg ${
                loginStatus === 'success' ? 'bg-green-50 border border-green-200' : 
                loginStatus === 'failed' ? 'bg-red-50 border border-red-200' : 
                'bg-gray-50 border border-gray-200'
              }`}>
                <h3 className="font-medium mb-2">
                  {loginStatus === 'success' ? '¡Éxito!' : 
                   loginStatus === 'failed' ? 'Error' : 'Procesando...'}
                </h3>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(loginResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        
        <div className="border-t pt-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">Solución de problemas</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
            <li>Asegúrate de que el servidor esté ejecutándose en el puerto 3007</li>
            <li>Verifica que la configuración CORS permita conexiones desde tu origen</li>
            <li>Comprueba que las credenciales coincidan con las almacenadas en la base de datos</li>
            <li>Revisa la consola del navegador para ver errores detallados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ServerTest;
