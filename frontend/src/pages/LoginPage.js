import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted:', formData); // 디버깅
    
    setError('');
    setLoading(true);

    try {
      console.log('Calling login API...'); // 디버깅
      const response = await login(formData);
      
      console.log('Login response:', response); // 디버깅
      
      if (response && response.success) {
        console.log('Login successful, navigating to dashboard...'); // 디버깅
        window.location.href = '/dashboard';  // 강제 리다이렉션
      } else {
        console.error('Login failed: success is false'); // 디버깅
        setError('로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('Login error:', err); // 디버깅
      setError(err.response?.data?.error?.message || '로그인에 실패했습니다');
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

        <button className="btn-google" onClick={handleGoogleLogin} type="button">
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google"
            style={{ width: '20px', height: '20px' }}
          />
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