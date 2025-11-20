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

  console.log('🔵 Login payload:', payload); // 디버깅

  try {
    const response = await api.post('/auth/login', payload);
    
    console.log('🟢 Login response:', response.data); // 디버깅

    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      console.log('💾 Saved token:', localStorage.getItem('token'));
      console.log('💾 Saved user :', localStorage.getItem('user'));
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
    
    console.log('🟢 Google login response:', response.data);

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