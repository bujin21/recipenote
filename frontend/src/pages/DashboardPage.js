import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecipes, deleteRecipe } from '../api/recipes';
import '../styles/Dashboard.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
  // 인증 확인
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Dashboard - Token:', token); // 디버깅
  console.log('Dashboard - User:', user); // 디버깅
  
  if (!token) {
    console.log('No token, redirecting to login...'); // 디버깅
    navigate('/login');
    return;
  }

  // 사용자 정보 가져오기
  if (user) {
    setUser(JSON.parse(user));
  }

  // 레시피 목록 가져오기
  loadRecipes();
}, [navigate]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const response = await getRecipes();
      
      if (response.success) {
        setRecipes(response.data.recipes || []);
      }
    } catch (error) {
      console.error('레시피 로드 실패:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        alert('레시피를 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleDelete = async (recipeId, e) => {
    e.stopPropagation();
    
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteRecipe(recipeId);
      setRecipes(recipes.filter(recipe => recipe.recipeId !== recipeId));
      alert('레시피가 삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadRecipes();
      return;
    }

    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setRecipes(filtered);
  };

  const filters = ['전체', '🍽️ 메인 요리', '🥗 반찬', '🍜 국/찌개', '🍰 디저트', '⚡ 30분 이내', '😊 쉬움'];

  return (
    <div className="dashboard-container">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="logo">🍳 RecipeNote</div>
        <nav className="nav">
          <a href="/dashboard">내 레시피</a>
          <a href="/profile">프로필</a>
          <a onClick={handleLogout} style={{ cursor: 'pointer' }}>로그아웃</a>
        </nav>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="dashboard-content">
        <div className="page-header">
          <h1 className="page-title">내 레시피</h1>
          <p className="page-subtitle">
            {user ? `안녕하세요, ${user.name}님! ` : ''}
            {recipes.length}개의 레시피를 저장했어요 🎉
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{recipes.length}</div>
            <div className="stat-label">전체 레시피</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">즐겨찾기</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">이번 주 추가</div>
          </div>
        </div>

        {/* 검색 바 */}
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 레시피, 재료 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn-search" onClick={handleSearch}>검색</button>
        </div>

        {/* 필터 */}
        <div className="filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 레시피 그리드 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: '#718096' }}>레시피를 불러오는 중...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            color: '#718096'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📝</div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>아직 레시피가 없습니다</h3>
            <p>우측 하단의 + 버튼을 눌러 첫 레시피를 추가해보세요!</p>
          </div>
        ) : (
          <div className="recipe-grid">
            {recipes.map((recipe, index) => (
              <div 
                key={recipe.recipeId} 
                className="recipe-card" 
                onClick={() => handleRecipeClick(recipe.recipeId)}
              >
                <div className="recipe-image" style={{
                  background: index % 4 === 0 ? 'linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%)' :
                             index % 4 === 1 ? 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)' :
                             index % 4 === 2 ? 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)' :
                             'linear-gradient(135deg, #C3E7FF 0%, #A8D8EA 100%)'
                }}>
                  {recipe.emoji || '🍽️'}
                  <div className="recipe-favorite">
                    🤍
                  </div>
                </div>
                <div className="recipe-content">
                  <div className="recipe-title">{recipe.title}</div>
                  <div className="recipe-meta">
                    <span>⏱️ {recipe.cookingTime}분</span>
                    <span>👤 {recipe.difficulty}</span>
                  </div>
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="tags">
                      {recipe.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 무한 스크롤 로딩 */}
        <div className="loading-more" style={{ display: 'none' }}>
          <div className="spinner"></div>
          <p>더 많은 레시피를 불러오는 중... 🍳</p>
        </div>
      </div>

      {/* FAB 버튼 */}
      <button className="fab" onClick={() => navigate('/recipes/new')}>
        +
      </button>
    </div>
  );
}

export default DashboardPage;