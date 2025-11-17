import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, updateRecipe } from '../api/recipes';
import '../styles/RecipeEdit.css';

function RecipeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    cookingTime: '',
    difficulty: '보통',
    servings: '2',          // 문자열로 관리 → input value가 항상 정의됨
    imageUrl: '',
    youtubeUrl: '',
    description: '',
    ingredients: [''],
    steps: [''],
    tags: []                // 필요하면 나중에 텍스트로 바꿔도 됨
  });

  // 로그인 체크 + 레시피 로드
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

      console.log('========== 수정 페이지 디버깅 ==========');
      console.log('1. API 응답 전체:', response);
      console.log('2. response.data:', response.data);
      console.log('3. imageUrl:', response.data?.imageUrl);
      console.log('4. youtubeUrl:', response.data?.youtubeUrl);
      console.log('=======================================');

      if (response.success) {
        const recipe = response.data;

        const newFormData = {
          title: recipe.title || '',
          cookingTime:
            recipe.cookingTime !== undefined && recipe.cookingTime !== null
              ? String(recipe.cookingTime)
              : '',
          difficulty: recipe.difficulty || '보통',
          servings:
            recipe.servings !== undefined && recipe.servings !== null
              ? String(recipe.servings)
              : '2',
          imageUrl: recipe.imageUrl || '',
          youtubeUrl: recipe.youtubeUrl || '',
          description: recipe.description || '',
          ingredients:
            recipe.ingredients && recipe.ingredients.length
              ? recipe.ingredients
              : [''],
          steps:
            recipe.steps && recipe.steps.length
              ? recipe.steps
              : [''],
          tags: recipe.tags || []
        };

        console.log('5. 설정할 formData:', newFormData);
        console.log('6. formData.imageUrl:', newFormData.imageUrl);
        console.log('7. formData.youtubeUrl:', newFormData.youtubeUrl);

        setFormData(newFormData);
      }
    } catch (error) {
      console.error('레시피 로드 실패:', error);
      alert('레시피를 불러오는데 실패했습니다.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (formData.ingredients.filter(i => i.trim()).length === 0) {
      alert('최소 1개의 재료를 입력해주세요.');
      return;
    }

    if (formData.steps.filter(s => s.trim()).length === 0) {
      alert('최소 1개의 조리 순서를 입력해주세요.');
      return;
    }

    try {
      const cleanedData = {
        ...formData,
        cookingTime: formData.cookingTime
          ? Number(formData.cookingTime)
          : null,
        servings: formData.servings
          ? Number(formData.servings)
          : 1,
        ingredients: formData.ingredients.filter(i => i.trim()),
        steps: formData.steps.filter(s => s.trim())
      };

      console.log('========== 저장 데이터 ==========');
      console.log('cleanedData:', cleanedData);
      console.log('================================');

      const response = await updateRecipe(id, cleanedData);

      if (response.success) {
        alert('레시피가 수정되었습니다!');
        navigate(`/recipes/${id}`);
      }
    } catch (error) {
      console.error('레시피 수정 실패:', error);
      alert('레시피 수정에 실패했습니다.');
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`필드 변경: ${field} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [field]: value ?? ''
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = index => {
    if (formData.ingredients.length <= 1) {
      alert('최소 1개의 재료가 필요합니다.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = index => {
    if (formData.steps.length <= 1) {
      alert('최소 1개의 조리 순서가 필요합니다.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="recipe-edit-container">
        <header className="dashboard-header">
          <div className="logo">🍳 RecipeNote</div>
          <nav className="nav">
            <a href="/dashboard">내 레시피</a>
            <a href="/profile">프로필</a>
            <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
              로그아웃
            </a>
          </nav>
        </header>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#718096' }}>
            레시피를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-edit-container">
      <header className="dashboard-header">
        <div className="logo">🍳 RecipeNote</div>
        <nav className="nav">
          <a href="/dashboard">내 레시피</a>
          <a href="/profile">프로필</a>
          <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
            로그아웃
          </a>
        </nav>
      </header>

      <div className="recipe-edit-content">
        <div className="edit-header">
          <button
            className="btn-back"
            onClick={() => navigate(`/recipes/${id}`)}
          >
            ← 돌아가기
          </button>
          <h1 className="edit-title">레시피 수정</h1>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label className="form-label">제목 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              className="form-input"
              placeholder="레시피 제목을 입력하세요"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">조리 시간 (분)</label>
              <input
                type="number"
                value={formData.cookingTime}
                onChange={e =>
                  handleInputChange('cookingTime', e.target.value)
                }
                className="form-input"
                placeholder="30"
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">난이도</label>
              <select
                value={formData.difficulty}
                onChange={e =>
                  handleInputChange('difficulty', e.target.value)
                }
                className="form-input"
              >
                <option value="쉬움">쉬움</option>
                <option value="보통">보통</option>
                <option value="어려움">어려움</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">인분</label>
              <input
                type="number"
                value={formData.servings}
                onChange={e =>
                  handleInputChange('servings', e.target.value)
                }
                className="form-input"
                placeholder="2"
                min="1"
              />
            </div>
          </div>

          <div
            style={{
              background: '#FFF9E6',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '2px solid #FFD93D',
              fontFamily: 'monospace'
            }}
          >
            <strong>🔍 디버깅 정보:</strong>
            <div>imageUrl: "{formData.imageUrl || '(비어있음)'}"</div>
            <div>youtubeUrl: "{formData.youtubeUrl || '(비어있음)'}"</div>
          </div>

          <div className="form-group">
            <label className="form-label">🖼️ 대표 이미지 URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={e => handleInputChange('imageUrl', e.target.value)}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="image-preview">
                <img
                  src={formData.imageUrl}
                  alt="미리보기"
                  onError={e => {
                    console.error(
                      '이미지 로드 실패:',
                      formData.imageUrl
                    );
                    e.target.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  className="btn-remove-preview"
                  onClick={() => handleInputChange('imageUrl', '')}
                >
                  ✕ 이미지 제거
                </button>
              </div>
            )}
            <p className="form-hint">JPG, PNG, GIF (최대 5MB)</p>
          </div>

          <div className="form-group">
            <label className="form-label">🎥 YouTube URL (선택)</label>
            <input
              type="url"
              value={formData.youtubeUrl}
              onChange={e =>
                handleInputChange('youtubeUrl', e.target.value)
              }
              className="form-input"
              placeholder="https://youtube.com/watch?v=..."
            />
            {formData.youtubeUrl && (
              <button
                type="button"
                className="btn-remove-link"
                onClick={() => handleInputChange('youtubeUrl', '')}
              >
                ✕ URL 제거
              </button>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">설명</label>
            <textarea
              value={formData.description}
              onChange={e =>
                handleInputChange('description', e.target.value)
              }
              className="form-textarea"
              rows="4"
              placeholder="레시피에 대한 설명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label className="form-label">재료 *</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="array-item">
                <span className="item-number">{index + 1}.</span>
                <input
                  type="text"
                  value={ingredient}
                  onChange={e =>
                    handleIngredientChange(index, e.target.value)
                  }
                  className="form-input"
                  placeholder="예: 김치 1컵"
                  required
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="btn-add"
            >
              + 재료 추가
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">조리 순서 *</label>
            {formData.steps.map((step, index) => (
              <div key={index} className="array-item">
                <span className="item-number">{index + 1}.</span>
                <textarea
                  value={step}
                  onChange={e =>
                    handleStepChange(index, e.target.value)
                  }
                  className="form-textarea"
                  rows="2"
                  placeholder="조리 순서를 입력하세요"
                  required
                />
                {formData.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="btn-add"
            >
              + 단계 추가
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              💾 저장하기
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(`/recipes/${id}`)}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecipeEditPage;
