import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API 헬스체크
    fetch('http://localhost:5000/api/v1/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API 연결 실패:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍳 RecipeNote</h1>
        <p>나만의 레시피를 한 곳에서 관리하세요</p>
        
        <div className="status-card">
          <h2>서버 상태</h2>
          {loading ? (
            <p>연결 중...</p>
          ) : health ? (
            <div className="success">
              <p>✅ 백엔드 연결 성공!</p>
              <p>서버: {health.data.status}</p>
              <p>버전: {health.data.version}</p>
              <p>업타임: {Math.floor(health.data.uptime)}초</p>
            </div>
          ) : (
            <div className="error">
              <p>❌ 백엔드 연결 실패</p>
              <p>백엔드 서버가 실행 중인지 확인하세요</p>
              <code>cd backend && npm run dev</code>
            </div>
          )}
        </div>

        <div className="info-card">
          <h3>📋 다음 단계</h3>
          <ol>
            <li>백엔드 서버 실행 확인</li>
            <li>라우팅 설정 (React Router)</li>
            <li>로그인 페이지 구현</li>
            <li>대시보드 구현</li>
          </ol>
        </div>
      </header>
    </div>
  );
}

export default App;