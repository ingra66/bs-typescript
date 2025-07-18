import React, { useState } from 'react';
import { apiConfig } from '@/config/api';

export const ApiTester: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      console.log('Probando API con baseURL:', apiConfig.baseURL);
      
      // Probar categorías
      const categoriesResponse = await fetch(`${apiConfig.baseURL}/categories`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const categoriesData = await categoriesResponse.json();
      console.log('Respuesta de categorías:', categoriesData);
      
      // Probar productos destacados
      const productsResponse = await fetch(`${apiConfig.baseURL}/products/featured`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const productsData = await productsResponse.json();
      console.log('Respuesta de productos:', productsData);
      
      setResults({
        categories: categoriesData,
        products: productsData,
        categoriesStatus: categoriesResponse.status,
        productsStatus: productsResponse.status,
      });
    } catch (error: any) {
      console.error('Error probando API:', error);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 m-4 rounded">
      <h3 className="text-white text-lg mb-4">Debug API Tester</h3>
      <button 
        onClick={testApi}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Probando...' : 'Probar API'}
      </button>
      
      {results && (
        <div className="mt-4 text-white">
          <h4 className="font-bold">Resultados:</h4>
          <pre className="bg-gray-900 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}; 