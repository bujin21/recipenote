import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeFormPage from './pages/RecipeFormPage';
import RecipeEditPage from './pages/RecipeEditPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/recipes/new" element={<RecipeFormPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/recipes/:id/edit" element={<RecipeEditPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<div style={{padding: '40px', textAlign: 'center'}}>404 - 페이지를 찾을 수 없습니다</div>} />
      </Routes>
    </Router>
  );
}

export default App;