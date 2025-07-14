import React, { useState } from 'react';
import { testApiConnection, testBackendHealth } from '@/utils/apiTest';
import { checkBackendStatus, testAuthEndpoints } from '@/utils/backendCheck';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Wifi, CheckCircle, XCircle, Loader, Database, Shield } from 'lucide-react';

export const ApiTester: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<{
    backendHealth: boolean | null;
    apiConnection: boolean | null;
    endpoints: any[] | null;
    authTest: any | null;
    error: string | null;
  }>({
    backendHealth: null,
    apiConnection: null,
    endpoints: null,
    authTest: null,
    error: null
  });

  const runTests = async () => {
    setIsTesting(true);
    setResults({
      backendHealth: null,
      apiConnection: null,
      endpoints: null,
      authTest: null,
      error: null
    });

    try {
      // Probar salud del backend
      const healthResult = await testBackendHealth();
      setResults(prev => ({ ...prev, backendHealth: healthResult }));

      if (healthResult) {
        // Probar endpoints públicos
        const endpointsResult = await checkBackendStatus();
        setResults(prev => ({ ...prev, endpoints: endpointsResult }));

        // Probar autenticación
        const authResult = await testAuthEndpoints();
        setResults(prev => ({ ...prev, authTest: authResult }));

        // Probar conexión completa de la API
        const apiResult = await testApiConnection();
        setResults(prev => ({ ...prev, apiConnection: apiResult }));
      } else {
        setResults(prev => ({ 
          ...prev, 
          error: 'El backend no responde. Verifica que esté corriendo en http://localhost:8000' 
        }));
      }
    } catch (error: any) {
      setResults(prev => ({ 
        ...prev, 
        error: error.message || 'Error desconocido durante las pruebas' 
      }));
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">
            Tester de API
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Verifica la conectividad con el backend
          </p>
        </div>

        <Card className="p-8 bg-gray-800 border-gray-700">
          <div className="space-y-6">
            <div className="text-center">
              <Button
                onClick={runTests}
                disabled={isTesting}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Probando...
                  </>
                ) : (
                  <>
                    <Wifi className="h-5 w-5 mr-2" />
                    Ejecutar Pruebas
                  </>
                )}
              </Button>
            </div>

            {/* Resultados */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resultados:</h3>
              
              {/* Salud del Backend */}
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {results.backendHealth === null ? (
                    <div className="w-5 h-5 bg-gray-500 rounded-full"></div>
                  ) : results.backendHealth ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <span className="text-white">Salud del Backend</span>
                </div>
                <span className={`text-sm ${
                  results.backendHealth === null ? 'text-gray-400' :
                  results.backendHealth ? 'text-green-400' : 'text-red-400'
                }`}>
                  {results.backendHealth === null ? 'Pendiente' :
                   results.backendHealth ? 'Conectado' : 'No responde'}
                </span>
              </div>

              {/* Endpoints Públicos */}
              {results.endpoints && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium text-white flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Endpoints Públicos
                  </h4>
                  {results.endpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {endpoint.ok ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-sm text-gray-300">{endpoint.endpoint.split('/').pop()}</span>
                      </div>
                      <span className={`text-xs ${
                        endpoint.ok ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {endpoint.ok ? `Status: ${endpoint.status}` : 'Error'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Prueba de Autenticación */}
              {results.authTest && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium text-white flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Prueba de Autenticación
                  </h4>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    {results.authTest.success ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-green-400">Login exitoso</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-green-400">Usuario obtenido</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-green-400">Logout exitoso</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-red-400">{results.authTest.error}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conexión de API */}
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {results.apiConnection === null ? (
                    <div className="w-5 h-5 bg-gray-500 rounded-full"></div>
                  ) : results.apiConnection ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <span className="text-white">Conexión de API</span>
                </div>
                <span className={`text-sm ${
                  results.apiConnection === null ? 'text-gray-400' :
                  results.apiConnection ? 'text-green-400' : 'text-red-400'
                }`}>
                  {results.apiConnection === null ? 'Pendiente' :
                   results.apiConnection ? 'Funcionando' : 'Error'}
                </span>
              </div>

              {/* Error */}
              {results.error && (
                <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span className="text-red-200 font-medium">Error:</span>
                  </div>
                  <p className="text-red-200 mt-2">{results.error}</p>
                </div>
              )}

              {/* Instrucciones */}
              <div className="p-4 bg-blue-900 border border-blue-700 rounded-lg">
                <h4 className="text-blue-200 font-medium mb-2">Instrucciones:</h4>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Asegúrate de que el servidor Laravel esté corriendo</li>
                  <li>• Verifica que el puerto 8000 esté disponible</li>
                  <li>• Revisa la consola del navegador para más detalles</li>
                  <li>• Si hay errores de CORS, verifica la configuración del backend</li>
                  <li>• Ejecuta <code className="bg-blue-800 px-1 rounded">php artisan serve</code> en el backend</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 