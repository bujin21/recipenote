import api from './api';

const AuthService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        // 토큰과 사용자 정보 저장
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data;
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error.response?.data || error;
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        // 토큰과 사용자 정보 저장
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  async getCurrentUser() {
    const user = this.getUser();
    return {
      success: true,
      data: user
    };
  }
};

export default AuthService;