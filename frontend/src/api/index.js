import axios from 'axios';

// API 기본 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ggyq4nsbw4.execute-api.us-west-1.amazonaws.com/prod';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url); // 디버깅
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url); // 디버깅
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url); // 디버깅
    
    // 로그인/회원가입 요청은 401 에러 처리 제외
    const isAuthEndpoint = 
      error.config?.url?.includes('/auth/login') || 
      error.config?.url?.includes('/auth/register') ||
      error.config?.url?.includes('/auth/google');
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // 인증된 API 요청에서만 401 에러 시 로그아웃
      console.log('🔴 401 Unauthorized - Redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;