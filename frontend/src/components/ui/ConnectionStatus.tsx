import React, { useState, useEffect } from 'react';
import { checkBackendAvailability } from '@/config/api';
import { Plug, WifiOff } from 'lucide-react';

export const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const available = await checkBackendAvailability();
      setIsConnected(available);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null || isChecking) {
    return (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-400">Conectando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      {isConnected ? (
        <>
          <Plug className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400">Plugged in</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-red-400" />
          <span className="text-xs text-red-400">Offline</span>
        </>
      )}
    </div>
  );
}; 