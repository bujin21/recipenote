import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipe, createRecipe, updateRecipe, parseRecipeUrl } from '../api/recipes';
import '../styles/RecipeForm.css';

function RecipeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [showUrlModal, setShowUrlModal] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [urlInput, setUrlInput] = useState(''); 

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '쉬움',
    cookingTime: '',
    servings: '',
    tags: '',
    imageUrl: '',
  youtubeUrl: ''     
  });

  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', amount: '' });
  
  const [steps, setSteps] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);        
  const [imagePreview, setImagePreview] = useState(null); 

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

  
// URL 파싱 핸들러
const handleUrlParsing = async () => {
  if (!urlInput.trim()) {
    alert('URL을 입력해주세요.');
    return;
  }

  setShowUrlModal(false);
  setIsParsing(true);

  try {
    const response = await parseRecipeUrl(urlInput);

    if (response.success) {
      const data = response.data;

      // YouTube든 블로그든 모두 같은 방식으로 처리!
      // AI가 추출한 레시피 정보로 폼 채우기
      setFormData({
        ...formData,
        title: data.title || '',
        description: data.description || '',
        category: data.category || '',
        difficulty: data.difficulty || '쉬움',
        cookingTime: data.cookingTime?.toString() || '',
        servings: data.servings?.toString() || '2',
        tags: data.tags?.join(', ') || '',
        youtubeUrl: data.youtubeUrl || ''  // YouTube URL도 자동으로!
      });

      // 재료 설정
      if (data.ingredients && data.ingredients.length > 0) {
        const parsedIngredients = data.ingredients.map(ing => {
          const parts = ing.split(' ');
          const amount = parts[parts.length - 1];
          const name = parts.slice(0, -1).join(' ');
          return { name, amount };
        });
        setIngredients(parsedIngredients);
      }

      // 조리 순서 설정
      if (data.steps && data.steps.length > 0) {
        setSteps(data.steps);
      }

      // 성공 메시지
      if (data.sourceType === 'youtube') {
        alert('YouTube 영상이 연결되었습니다! 영상을 보며 내용을 수정해주세요.');
      } else {
        alert('레시피가 자동으로 채워졌습니다! 확인 후 수정해주세요.');
      }

      setUrlInput('');
    }
  } catch (error) {
    console.error('URL 파싱 실패:', error);
    alert(error.response?.data?.error?.message || 'URL 파싱에 실패했습니다. 다시 시도해주세요.');
  } finally {
    setIsParsing(false);
  }
};

  // 이미지 파일 선택 핸들러
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setImageFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
};

// 이미지 S3 업로드 함수
const uploadImageToS3 = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // 임시: 일단 base64로 저장 (나중에 S3 Pre-signed URL 사용)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
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
      // 이미지 업로드 (있을 경우)
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImageToS3(imageFile);
      }

      const recipeData = {
        ...formData,
        cookingTime: parseInt(formData.cookingTime),
        servings: parseInt(formData.servings) || 1,
        ingredients: ingredients.map(ing => `${ing.name} ${ing.amount}`),
        steps: steps.filter(s => s.trim()),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        imageUrl: imageUrl || null,           
        youtubeUrl: formData.youtubeUrl || null  
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

            {/* 이미지 업로드 섹션 - 추가! */}
            <div className="form-group">
              <label>🖼️ 대표 이미지</label>
              {imagePreview && (
                <div style={{ 
                  marginBottom: '12px', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  maxWidth: '300px'
                }}>
                  <img 
                    src={imagePreview} 
                    alt="미리보기" 
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                style={{ marginBottom: '8px' }}
              />
              <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
                JPG, PNG, GIF (최대 5MB)
              </p>
            </div>

            {/* YouTube URL 입력 - 추가! */}
            <div className="form-group">
              <label>📺 YouTube URL (선택)</label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
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

      {/* URL 입력 모달 - 수정! */}
      {showUrlModal && (
        <div className="modal" onClick={() => setShowUrlModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">🔗 URL 입력</h2>
            <p className="modal-subtitle">YouTube, 블로그 레시피 URL을 입력하세요</p>
            
            <div className="form-group">
              <input 
                type="url" 
                placeholder="https://youtube.com/watch?v=..." 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                autoFocus
              />
            </div>
            
            <div style={{ 
              padding: '12px', 
              background: '#E6F7FF', 
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              <strong>💡 지원 사이트:</strong>
              <ul style={{ margin: '8px 0 0 20px', lineHeight: '1.6' }}>
                <li>YouTube (영상 링크 메타 정보 저장)</li>
                <li>티스토리 (AI 자동 추출)</li>
                <li>기타 웹사이트 (AI 자동 추출)</li>
              </ul>
            </div>
            
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleUrlParsing}>
                파싱 시작
              </button>
              <button className="btn-secondary" onClick={() => {
                setShowUrlModal(false);
                setUrlInput('');
              }}>
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