import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 경로는 로그인으로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 인증 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 메인 페이지 */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* 404 페이지 */}
        <Route path="*" element={<div>404 - 페이지를 찾을 수 없습니다</div>} />
      </Routes>
    </Router>
  );
}