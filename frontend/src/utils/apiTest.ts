import api from '@/services/api';

export const testApiConnection = async () => {
  try {
    console.log('🔍 Probando conexión con el backend...');
    
    // Probar endpoint de categorías (público)
    const categoriesResponse = await api.get('/categories');
    console.log('✅ Categorías cargadas:', categoriesResponse.data);
    
    // Probar endpoint de productos (público)
    const productsResponse = await api.get('/products');
    console.log('✅ Productos cargados:', productsResponse.data);
    
    // Probar login con usuario de prueba
    const loginData = {
      email: 'user@beltspot.com',
      password: 'password'
    };
    
    const loginResponse = await api.post('/login', loginData);
    console.log('✅ Login exitoso:', loginResponse.data);
    
    // Probar obtener usuario actual
    const token = loginResponse.data.data.token;
    localStorage.setItem('auth_token', token);
    
    const userResponse = await api.get('/user');
    console.log('✅ Usuario actual:', userResponse.data);
    
    // Probar logout
    const logoutResponse = await api.post('/logout');
    console.log('✅ Logout exitoso:', logoutResponse.data);
    
    // Limpiar token
    localStorage.removeItem('auth_token');
    
    console.log('🎉 Todas las pruebas pasaron exitosamente!');
    return true;
    
  } catch (error: any) {
    console.error('❌ Error en la prueba de API:', error);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('🔧 Problema de conectividad. Verifica que:');
      console.error('1. El servidor Laravel esté corriendo en http://localhost:8000');
      console.error('2. No haya problemas de CORS');
      console.error('3. El puerto 8000 esté disponible');
    }
    
    if (error.response) {
      console.error('📊 Respuesta del servidor:', error.response.data);
      console.error('📊 Status:', error.response.status);
    }
    
    return false;
  }
};

export const testBackendHealth = async () => {
  try {
    // Probar la URL base del backend
    const response = await fetch('http://localhost:8000/api/v1/categories');
    console.log('🌐 Backend responde:', response.status);
    return response.ok;
  } catch (error) {
    console.error('❌ Backend no responde:', error);
    return false;
  }
}; 