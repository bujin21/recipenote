import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/RecipeDetail.css';

function RecipeDetailPage() {
  const { id } = useParams();

  // 임시 데이터
  const recipe = {
    id: 1,
    title: '김치찌개',
    emoji: '🍲',
    time: '30분',
    difficulty: '쉬움',
    servings: '2인분',
    tags: ['매운맛', '국/찌개', '한식', '겨울음식'],
    ingredients: [
      { name: '김치', amount: '1컵' },
      { name: '돼지고기', amount: '200g' },
      { name: '두부', amount: '1/2모' },
      { name: '대파', amount: '1대' },
      { name: '고춧가루', amount: '1큰술' }
    ],
    steps: [
      '김치를 먹기 좋은 크기로 자릅니다.',
      '냄비에 참기름을 두르고 김치와 돼지고기를 볶습니다.',
      '물을 붓고 끓입니다. (약 15분)',
      '두부와 대파를 넣고 5분 더 끓입니다.',
      '고춧가루로 간을 맞추고 완성!'
    ]
  };

  return (
    <div className="recipe-detail-container">
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
      <div className="recipe-detail-content">
        <button className="btn-back" onClick={() => window.history.back()}>
          ← 돌아가기
        </button>

        <div className="detail-header">
          <h1 className="detail-title">{recipe.title}</h1>
          <div className="recipe-meta">
            <span>⏱️ {recipe.time}</span>
            <span>👤 {recipe.difficulty}</span>
            <span>🍽️ {recipe.servings}</span>
          </div>
          <div className="tags">
            {recipe.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="detail-image">{recipe.emoji}</div>

        <h2 className="section-title">📝 재료</h2>
        <div className="ingredients-list">
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-item">
              <span>{ingredient.name}</span>
              <span>{ingredient.amount}</span>
            </div>
          ))}
        </div>

        <h2 className="section-title">👨‍🍳 조리 순서</h2>
        <div className="steps-list">
          {recipe.steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{index + 1}</div>
              <div>{step}</div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button className="btn-primary">수정하기</button>
          <button className="btn-secondary">보관함으로</button>
          <button className="btn-outline">삭제하기</button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailPage;