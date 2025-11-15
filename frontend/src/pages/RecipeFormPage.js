import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipe, createRecipe, updateRecipe } from '../api/recipes';
import '../styles/RecipeForm.css';

function RecipeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [showUrlModal, setShowUrlModal] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '쉬움',
    cookingTime: '',
    servings: '',
    tags: ''
  });

  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', amount: '' });
  
  const [steps, setSteps] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 로그인 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      loadRecipe();
    }
  }, [navigate, id]);

  const loadRecipe = async () => {
    try {
      const response = await getRecipe(id);
      
      if (response.success) {
        const recipe = response.data;
        setFormData({
          title: recipe.title,
          description: recipe.description || '',
          category: recipe.category,
          difficulty: recipe.difficulty,
          cookingTime: recipe.cookingTime.toString(),
          servings: recipe.servings?.toString() || '2',
          tags: recipe.tags?.join(', ') || ''
        });

        // 재료 파싱 (문자열 → 객체)
        const parsedIngredients = recipe.ingredients.map(ing => {
          const parts = ing.split(' ');
          const amount = parts[parts.length - 1];
          const name = parts.slice(0, -1).join(' ');
          return { name, amount };
        });
        setIngredients(parsedIngredients);

        setSteps(recipe.steps);
      }
    } catch (err) {
      console.error('레시피 로드 실패:', err);
      alert('레시피를 불러오는데 실패했습니다.');
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.amount) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient({ name: '', amount: '' });
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleUrlParsing = () => {
    setShowUrlModal(false);
    setIsParsing(true);
    
    setTimeout(() => {
      setIsParsing(false);
      alert('URL 파싱 기능은 준비 중입니다.');
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (ingredients.length === 0) {
      alert('재료를 최소 1개 이상 추가해주세요.');
      return;
    }

    if (steps.filter(s => s.trim()).length === 0) {
      alert('조리 순서를 최소 1개 이상 추가해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const recipeData = {
        ...formData,
        cookingTime: parseInt(formData.cookingTime),
        servings: parseInt(formData.servings) || 1,
        ingredients: ingredients.map(ing => `${ing.name} ${ing.amount}`),
        steps: steps.filter(s => s.trim()),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      };

      let response;
      if (isEditMode) {
        response = await updateRecipe(id, recipeData);
      } else {
        response = await createRecipe(recipeData);
      }

      if (response.success) {
        alert(isEditMode ? '레시피가 수정되었습니다!' : '레시피가 저장되었습니다!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('레시피 저장 실패:', error);
      setError(error.response?.data?.error?.message || '레시피 저장에 실패했습니다.');
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

  return (
    <div className="recipe-form-container">
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
      <div className="recipe-form-content">
        <div className="recipe-form">
          <div className="page-header">
            <h1 className="page-title">{isEditMode ? '레시피 수정' : '새 레시피 추가'}</h1>
            <p className="page-subtitle">URL로 자동 채우거나 직접 입력하세요</p>
          </div>

          {/* URL 자동 채우기 섹션 */}
          {!isEditMode && (
            <div className="url-section">
              <h3>🔗 URL로 자동 채우기</h3>
              <p>YouTube, 블로그 레시피 URL을 입력하면 AI가 자동으로 채워드려요!</p>
              <button 
                type="button"
                className="btn-primary" 
                onClick={() => setShowUrlModal(true)}
              >
                URL 입력하기
              </button>
            </div>
          )}

          {error && (
            <div style={{
              padding: '12px',
              background: '#FEE',
              color: '#C53030',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>재료 *</label>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-list-item">
                  <span>{ingredient.name} - {ingredient.amount}</span>
                  <button 
                    type="button" 
                    className="btn-delete"
                    onClick={() => handleRemoveIngredient(index)}
                    disabled={loading}
                  >
                    삭제
                  </button>
                </div>
              ))}
              <div className="ingredient-input-group">
                <input 
                  type="text" 
                  placeholder="재료명"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  disabled={loading}
                />
                <input 
                  type="text" 
                  placeholder="양"
                  value={newIngredient.amount}
                  onChange={(e) => setNewIngredient({ ...newIngredient, amount: e.target.value })}
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="btn-add"
                  onClick={handleAddIngredient}
                  disabled={loading}
                >
                  추가
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>조리 순서 *</label>
              {steps.map((step, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div className="step-number">{index + 1}</div>
                    <textarea
                      className="step-textarea"
                      placeholder={`${index + 1}번째 단계를 입력하세요`}
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      disabled={loading}
                    />
                    {steps.length > 1 && (
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleRemoveStep(index)}
                        disabled={loading}
                        style={{ marginTop: '10px' }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                className="btn-outline" 
                style={{ width: '100%' }}
                onClick={handleAddStep}
                disabled={loading}
              >
                + 단계 추가
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>카테고리 *</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required
                  disabled={loading}
                >
                  <option value="">선택하세요</option>
                  <option value="메인 요리">메인 요리</option>
                  <option value="반찬">반찬</option>
                  <option value="국/찌개">국/찌개</option>
                  <option value="디저트">디저트</option>
                </select>
              </div>

              <div className="form-group">
                <label>난이도 *</label>
                <select 
                  name="difficulty" 
                  value={formData.difficulty} 
                  onChange={handleChange}
                  disabled={loading}
                >
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
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>인분</label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  placeholder="2"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>태그</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="태그를 입력하세요 (쉼표로 구분)"
                disabled={loading}
              />
            </div>

            <div className="action-buttons">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? '저장 중...' : isEditMode ? '수정하기' : '저장하기'}
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
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