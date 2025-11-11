import React, { useState } from 'react';
import '../styles/RecipeForm.css';

function RecipeFormPage() {
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    cuisine: '',
    difficulty: '쉬움',
    cookingTime: '',
    servings: ''
  });

  const [ingredients, setIngredients] = useState([
    { name: '김치', amount: '1컵' },
    { name: '돼지고기', amount: '200g' }
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('레시피 저장:', formData, ingredients);
    // TODO: API 호출
    alert('레시피가 저장되었습니다!');
    window.location.href = '/dashboard';
  };

  const handleUrlParsing = () => {
    setShowUrlModal(false);
    setIsParsing(true);
    
    // 3초 후 파싱 완료 시뮬레이션
    setTimeout(() => {
      setIsParsing(false);
      alert('✅ 파싱 완료!\n\n레시피가 자동으로 입력되었습니다.');
    }, 3000);
  };

  return (
    <div className="recipe-form-container">
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
      <div className="recipe-form-content">
        <div className="recipe-form">
          <div className="page-header">
            <h1 className="page-title">새 레시피 추가</h1>
            <p className="page-subtitle">URL로 자동 채우거나 직접 입력하세요</p>
          </div>

          {/* URL 자동 채우기 섹션 */}
          <div className="url-section">
            <h3>🔗 URL로 자동 채우기</h3>
            <p>YouTube, 블로그 레시피 URL을 입력하면 AI가 자동으로 채워드려요!</p>
            <button className="btn-primary" onClick={() => setShowUrlModal(true)}>
              URL 입력하기
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>제목 *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="레시피 제목을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label>설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="간단한 설명을 입력하세요"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>재료 *</label>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-list-item">
                  <span>{ingredient.name} - {ingredient.amount}</span>
                  <button type="button" className="btn-delete">삭제</button>
                </div>
              ))}
              <div className="ingredient-input-group">
                <input type="text" placeholder="재료명" />
                <input type="text" placeholder="양" />
                <button type="button" className="btn-add">추가</button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>카테고리 *</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">선택하세요</option>
                  <option value="메인 요리">메인 요리</option>
                  <option value="반찬">반찬</option>
                  <option value="국/찌개">국/찌개</option>
                  <option value="디저트">디저트</option>
                </select>
              </div>

              <div className="form-group">
                <label>난이도 *</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  <option value="쉬움">쉬움</option>
                  <option value="보통">보통</option>
                  <option value="어려움">어려움</option>
                </select>
              </div>

              <div className="form-group">
                <label>조리 시간 (분) *</label>
                <input
                  type="number"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  placeholder="30"
                  required
                />
              </div>
            </div>

            <div className="action-buttons">
              <button type="submit" className="btn-primary">저장하기</button>
              <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
                취소
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* URL 입력 모달 */}
      {showUrlModal && (
        <div className="modal" onClick={() => setShowUrlModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">🔗 URL 입력</h2>
            <p className="modal-subtitle">YouTube, 블로그 레시피 URL을 입력하세요</p>
            
            <div className="form-group">
              <input type="text" placeholder="https://youtube.com/watch?v=..." />
            </div>
            
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleUrlParsing}>
                파싱 시작
              </button>
              <button className="btn-secondary" onClick={() => setShowUrlModal(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 파싱 중 모달 */}
      {isParsing && (
        <div className="modal">
          <div className="modal-content">
            <div className="loading">
              <div className="spinner"></div>
              <h3>AI가 레시피를 분석하고 있습니다...</h3>
              <p>약 30초 소요됩니다 ☕</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeFormPage;