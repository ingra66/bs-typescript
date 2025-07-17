export const checkBackendStatus = async () => {
  const endpoints = [
    'http://localhost:8000/api/v1/categories',
    'http://localhost:8000/api/v1/products',
    'http://localhost:8000/api/v1/categories/navigation'
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      results.push({
        endpoint,
        status: response.status,
        ok: response.ok,
        data: response.ok ? await response.json() : null
      });
    } catch (error) {
      results.push({
        endpoint,
        status: 'ERROR',
        ok: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  return results;
};

export const testAuthEndpoints = async () => {
  const testUser = {
    email: 'user@beltspot.com',
    password: 'password'
  };

  try {
    // Probar login
    const loginResponse = await fetch('http://localhost:8000/api/v1/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      return {
        success: false,
        error: `Login falló: ${loginData.message || 'Error desconocido'}`,
        status: loginResponse.status
      };
    }

    // Probar obtener usuario con token
    const token = loginData.data.token;
    const userResponse = await fetch('http://localhost:8000/api/v1/user', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      return {
        success: false,
        error: `Obtener usuario falló: ${userData.message || 'Error desconocido'}`,
        status: userResponse.status
      };
    }

    // Probar logout
    const logoutResponse = await fetch('http://localhost:8000/api/v1/logout', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return {
      success: true,
      login: loginData,
      user: userData,
      logout: logoutResponse.ok
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}; 