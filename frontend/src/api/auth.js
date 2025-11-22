import api from './index';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);

  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }

  return response.data;
};

export const login = async (credentials) => {
  const payload = {
    username: credentials.username || credentials.email,
    password: credentials.password,
  };


  try {
    const response = await api.post('/auth/login', payload);

    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

    }

    return response.data;
  } catch (error) {
    console.error('🔴 Login error:', error.response?.data || error); // 디버깅
    throw error;
  }
};

export const googleLogin = async (googleData) => {
  console.log('🔵 Google login data:', googleData);

  try {
    const response = await api.post('/auth/google', googleData);

    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error) {
    console.error('🔴 Google login error:', error.response?.data || error);
    throw error;
  }
};