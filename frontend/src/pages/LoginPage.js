import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import '../styles/Auth.css';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // 입력 시 에러 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthService.login(formData);
      // 로그인 성공 - 대시보드로 이동
      navigate('/dashboard');
    } catch (err) {
      setError(err.error?.message || '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('Google 로그인은 준비 중입니다.');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">RecipeNote</h1>
        <p className="auth-subtitle">나만의 레시피를 한 곳에서 관리하세요</p>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <span className="google-icon">🔵</span>
          Google로 시작하기
        </button>

        <div className="divider">또는</div>

        {error && (
          <div style={{
            padding: '12px',
            background: '#FEE',
            color: '#C53030',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>아이디</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/register')}
            disabled={loading}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;