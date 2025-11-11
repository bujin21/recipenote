import api from './api';

class AuthService {
  // 회원가입
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        // 토큰과 사용자 정보 저장
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: '회원가입에 실패했습니다' } };
    }
  }

  // 로그인
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        // 토큰과 사용자 정보 저장
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: '로그인에 실패했습니다' } };
    }
  }

  // 로그아웃
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // 현재 사용자 조회
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: '사용자 정보를 가져올 수 없습니다' } };
    }
  }

  // 로그인 여부 확인
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // 저장된 사용자 정보 가져오기
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();