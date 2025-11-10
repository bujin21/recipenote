import React, { useState } from 'react';
import '../styles/Auth.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인:', formData);
    // TODO: API 호출
  };

  const handleGoogleLogin = () => {
    console.log('Google 로그인');
    // TODO: Google OAuth
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
            />
          </div>

          <button type="submit" className="btn-primary">
            로그인
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => window.location.href = '/register'}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;