import React, { useState } from 'react';
import '../styles/Auth.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log('회원가입:', formData);
    // TODO: API 호출
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-subtitle">RecipeNote와 함께 시작하세요 🎉</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>아이디 *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="4-20자, 영문+숫자"
              required
            />
            <p className="form-hint">영문 소문자와 숫자만 사용 가능합니다</p>
          </div>

          <div className="form-group">
            <label>비밀번호 *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8자 이상, 영문+숫자+특수문자"
              required
            />
            <p className="form-hint">안전한 비밀번호를 사용하세요</p>
          </div>

          <div className="form-group">
            <label>비밀번호 확인 *</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label>이메일 *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
            <p className="form-hint">이메일 인증이 필요합니다</p>
          </div>

          <div className="form-group">
            <label>이름 *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            가입하기
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => window.location.href = '/login'}
          >
            이미 계정이 있으신가요? 로그인
          </button>
        </form>
      </div>
    </div>
  );
}
