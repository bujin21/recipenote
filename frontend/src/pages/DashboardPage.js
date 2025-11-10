import React, { useState } from 'react';
import '../styles/Dashboard.css';

function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');

  // 임시 데이터
  const recipes = [
    {
      id: 1,
      title: '김치찌개',
      time: '30분',
      difficulty: '쉬움',
      emoji: '🍲',
      tags: ['매운맛', '국/찌개'],
      favorite: true
    },
    {
      id: 2,
      title: '토마토 파스타',
      time: '25분',
      difficulty: '쉬움',
      emoji: '🍝',
      tags: ['양식', '메인'],
      favorite: false
    },
    {
      id: 3,
      title: '카레라이스',
      time: '40분',
      difficulty: '보통',
      emoji: '🍛',
      tags: ['일식', '메인'],
      favorite: false
    },
    {
      id: 4,
      title: '시저 샐러드',
      time: '15분',
      difficulty: '쉬움',
      emoji: '🥗',
      tags: ['샐러드', '건강식'],
      favorite: true
    }
  ];

  const filters = ['전체', '🍽️ 메인 요리', '🥗 반찬', '🍜 국/찌개', '🍰 디저트', '⚡ 30분 이내', '😊 쉬움'];

  return (
    <div className="dashboard-container">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="logo">🍳 RecipeNote</div>
        <nav className="nav">
          <a href="/dashboard">내 레시피</a>
          <a href="/profile">프로필</a>
          <a href="/login">로그아웃</a>
        </nav>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="dashboard-content">
        <div className="page-header">
          <h1 className="page-title">내 레시피</h1>
          <p className="page-subtitle">42개의 레시피를 저장했어요 🎉</p>
        </div>

        {/* 통계 카드 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">42</div>
            <div className="stat-label">전체 레시피</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">12</div>
            <div className="stat-label">즐겨찾기</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">8</div>
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
          />
          <button className="btn-search">검색</button>
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
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card" onClick={() => window.location.href = '/recipe/1'}>
              <div className="recipe-image">
                {recipe.emoji}
                <div className="recipe-favorite">
                  {recipe.favorite ? '❤️' : '🤍'}
                </div>
              </div>
              <div className="recipe-content">
                <div className="recipe-title">{recipe.title}</div>
                <div className="recipe-meta">
                  <span>⏱️ {recipe.time}</span>
                  <span>👤 {recipe.difficulty}</span>
                </div>
                <div className="tags">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 무한 스크롤 로딩 */}
        <div className="loading-more" style={{ display: 'none' }}>
          <div className="spinner"></div>
          <p>더 많은 레시피를 불러오는 중... 🍳</p>
        </div>
      </div>

      {/* FAB 버튼 */}
      <button className="fab" onClick={() => window.location.href = '/recipe/new'}>
        +
      </button>
    </div>
  );
}

export default DashboardPage;