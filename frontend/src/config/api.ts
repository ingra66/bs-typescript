// Configuración de la API según el entorno
const getApiConfig = () => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return {
      baseURL: 'http://localhost/bs-typescript/backend/public/api/v1',
      timeout: 10000,
      withCredentials: true
    };
  }
  
  // Configuración para producción
  return {
    baseURL: import.meta.env.VITE_API_URL || 'https://api.beltspot.com/api/v1',
    timeout: 15000,
    withCredentials: true
  };
};

export const apiConfig = getApiConfig();

// Función para verificar si el backend está disponible
export const checkBackendAvailability = async () => {
  try {
    const response = await fetch(`${apiConfig.baseURL}/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Backend no disponible:', error);
    return false;
  }
};

// Función para obtener la URL base dinámica
export const getApiBaseURL = () => {
  return apiConfig.baseURL;
}; 