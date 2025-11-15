import api from './index';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  
  if (response.data.success) {
    // 토큰과 사용자 정보 저장
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    console.log('Register - Token saved:', response.data.data.token); // 디버깅
    console.log('Register - User saved:', response.data.data.user); // 디버깅
  }
  
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  
  if (response.data.success) {
    // 토큰과 사용자 정보 저장
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    console.log('Login - Token saved:', response.data.data.token); // 디버깅
    console.log('Login - User saved:', response.data.data.user); // 디버깅
  }
  
  return response.data;
};