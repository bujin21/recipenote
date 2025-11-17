import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, deleteRecipe } from '../api/recipes';
import '../styles/RecipeDetail.css';

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadRecipe();
  }, [id, navigate]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const response = await getRecipe(id);
      
      // 디버깅 로그
      console.log('========== 상세 페이지 디버깅 ==========');
      console.log('API 응답:', response);
      console.log('imageUrl:', response.data?.imageUrl);
      console.log('youtubeUrl:', response.data?.youtubeUrl);
      console.log('=======================================');
      
      if (response.success) {
        setRecipe(response.data);
      }
    } catch (error) {
      console.error('레시피 로드 실패:', error);
      alert('레시피를 불러오는데 실패했습니다.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 이 레시피를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await deleteRecipe(id);
      
      if (response.success) {
        alert('레시피가 삭제되었습니다.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('레시피 삭제 실패:', error);
      alert('레시피 삭제에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    navigate(`/recipes/${id}/edit`);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
  };

  if (loading) {
    return (
      <div className="recipe-detail-container">
        <header className="dashboard-header">
          <div className="logo">🍳 RecipeNote</div>
          <nav className="nav">
            <a href="/dashboard">내 레시피</a>
            <a href="/profile">프로필</a>
            <a onClick={handleLogout} style={{ cursor: 'pointer' }}>로그아웃</a>
          </nav>
        </header>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#718096' }}>레시피를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-detail-container">
        <header className="dashboard-header">
          <div className="logo">🍳 RecipeNote</div>
          <nav className="nav">
            <a href="/dashboard">내 레시피</a>
            <a href="/profile">프로필</a>
            <a onClick={handleLogout} style={{ cursor: 'pointer' }}>로그아웃</a>
          </nav>
        </header>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>레시피를 찾을 수 없습니다</h2>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <header className="dashboard-header">
        <div className="logo">🍳 RecipeNote</div>
        <nav className="nav">
          <a href="/dashboard">내 레시피</a>
          <a href="/profile">프로필</a>
          <a onClick={handleLogout} style={{ cursor: 'pointer' }}>로그아웃</a>
        </nav>
      </header>

      <div className="recipe-detail-content">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← 돌아가기
        </button>

        <div className="detail-header">
          <h1 className="detail-title">{recipe.title}</h1>
          <div className="recipe-meta">
            <span>⏱️ {recipe.cookingTime}분</span>
            <span>👤 {recipe.difficulty}</span>
            <span>🍽️ {recipe.servings || 2}인분</span>
          </div>
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="tags">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {recipe.imageUrl ? (
          <div style={{
            marginBottom: '32px',
            borderRadius: '16px',
            overflow: 'hidden',
            maxWidth: '800px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title}
              style={{ 
                width: '100%', 
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        ) : (
          <div className="detail-image">{recipe.emoji || '🍽️'}</div>
        )}

        {recipe.youtubeUrl && (
          <div style={{
            marginBottom: '32px',
            borderRadius: '16px',
            overflow: 'hidden',
            maxWidth: '800px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0
            }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
                src={getYouTubeEmbedUrl(recipe.youtubeUrl)}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {recipe.description && (
          <div style={{ 
            padding: '20px', 
            background: '#F7F9FC', 
            borderRadius: '12px', 
            marginBottom: '40px',
            color: '#2D3748',
            lineHeight: '1.6'
          }}>
            {recipe.description}
          </div>
        )}

        <h2 className="section-title">📝 재료</h2>
        <div className="ingredients-list">
          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-item">
              <span>{ingredient}</span>
            </div>
          ))}
        </div>

        <h2 className="section-title">👨‍🍳 조리 순서</h2>
        <div className="steps-list">
          {recipe.steps && recipe.steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{index + 1}</div>
              <div>{step}</div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button 
            className="btn-primary" 
            onClick={handleEdit}
          >
            수정하기
          </button>
          <button 
            className="btn-secondary"
            onClick={() => alert('보관함 기능은 준비 중입니다.')}
          >
            보관함으로
          </button>
          <button 
            className="btn-outline"
            onClick={handleDelete}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailPage;