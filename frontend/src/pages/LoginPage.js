import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { login, googleLogin } from '../api/auth';
import '../styles/Auth.css';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function LoginPage() {
  const navigate = useNavigate();
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);

  // 🔐 일반 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', emailOrId); // 디버깅

      const res = await login({
        username: emailOrId, // 👈 아이디로 로그인
        password,
      });

      console.log('🟢 Login response:', res);

      if (res.success) {

        // 토큰 저장 확인
        console.log('💾 Saved token:', localStorage.getItem('token'));
        console.log('💾 Saved user:', localStorage.getItem('user'));

        alert('로그인 성공!');
        navigate('/dashboard');
      } else {
        alert(res.error?.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 구글 로그인 성공
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google User Info:', decoded);

      const res = await googleLogin({
        token: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      });

      console.log('Google login response:', res);

      if (res.success) {
        alert('구글 로그인 성공!');
        navigate('/dashboard');
      } else {
        alert(res.error?.message || '구글 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('구글 로그인 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    alert('구글 로그인에 실패했습니다.');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">🍽️ Recipe Note</h1>
          <p className="auth-subtitle">나만의 레시피를 모아보세요</p>

          {/* 일반 로그인 폼 */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>아이디</label>
              <input
                type="text"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 구분선 */}
          <div className="divider">
            <span>또는</span>
          </div>

          {/* 구글 로그인 버튼 */}
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
            />
          </div>

          {/* 회원가입 링크 */}
          <div className="auth-link">
            계정이 없으신가요? <a href="/register">회원가입</a>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;