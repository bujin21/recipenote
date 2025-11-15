import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import '../styles/Auth.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    name: ''
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
    setError('');
    
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const { passwordConfirm, ...registerData } = formData;
      const response = await register(registerData);
      
      if (response.success) {
        alert('회원가입이 완료되었습니다!');
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.error?.details) {
        const errorMessages = err.response.data.error.details.map(d => d.message).join('\n');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.error?.message || '회원가입에 실패했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-subtitle">RecipeNote와 함께 시작하세요 🎉</p>

        {error && (
          <div style={{
            padding: '12px',
            background: '#FEE',
            color: '#C53030',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'pre-line'
          }}>
            {error}
          </div>
        )}

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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '가입 중...' : '가입하기'}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/login')}
            disabled={loading}
          >
            이미 계정이 있으신가요? 로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;