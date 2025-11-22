import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAIRecipe } from '../api/ai';
import { getProfile } from '../api/profile';
import '../styles/AIRecipeGenerator.css';

function AIRecipeGeneratorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [ingredients, setIngredients] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data || response);
    } catch (error) {
      console.error('프로필 로드 실패:', error);
    }
  };

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      alert('냉장고에 있는 재료를 입력해주세요!');
      return;
    }

    setLoading(true);
    setGeneratedRecipe(null);

    try {
      const response = await generateAIRecipe({
        ingredients: ingredients,
        allergies: profile?.allergies || [],
        dietaryRestrictions: profile?.dietaryRestrictions || [],
        additionalNotes: additionalNotes
      });

      if (response.success) {
        setGeneratedRecipe(response.data.recipe);
      }
    } catch (error) {
      console.error('AI 레시피 생성 실패:', error);
      alert(error.response?.data?.error?.message || 'AI 레시피 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = () => {
    if (!generatedRecipe) return;
    
    // 생성된 레시피를 RecipeFormPage로 전달
    navigate('/recipes/new', { 
      state: { 
        aiGeneratedRecipe: generatedRecipe 
      } 
    });
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="ai-generator-container">
      <header className="dashboard-header">
        <div className="logo">🍳 RecipeNote</div>
        <nav className="nav">
          <a href="/dashboard">내 레시피</a>
          <a href="/ai-recipe">AI 레시피</a>
          <a href="/profile">프로필</a>
          <a onClick={handleLogout} style={{ cursor: 'pointer' }}>로그아웃</a>
        </nav>
      </header>

      <div className="ai-content">
        <div className="page-header">
          <h1 className="page-title">🤖 AI 레시피 생성</h1>
          <p className="page-subtitle">
            냉장고에 있는 재료로 맞춤 레시피를 만들어드려요!
          </p>
        </div>

        {/* 프로필 정보 표시 */}
        {profile && (
          <div className="profile-info-box">
            <h3>📋 프로필 정보</h3>
            <div className="profile-badges">
              {profile.allergies && profile.allergies.length > 0 && (
                <div className="badge-group">
                  <span className="badge-label">🚫 알레르기:</span>
                  {profile.allergies.map((item, idx) => (
                    <span key={idx} className="badge allergy">{item}</span>
                  ))}
                </div>
              )}
              {profile.dietaryRestrictions && profile.dietaryRestrictions.length > 0 && (
                <div className="badge-group">
                  <span className="badge-label">🥗 식단 제약:</span>
                  {profile.dietaryRestrictions.map((item, idx) => (
                    <span key={idx} className="badge dietary">{item}</span>
                  ))}
                </div>
              )}
              {(!profile.allergies || profile.allergies.length === 0) && 
               (!profile.dietaryRestrictions || profile.dietaryRestrictions.length === 0) && (
                <p className="no-restrictions">설정된 제약사항이 없습니다.</p>
              )}
            </div>
          </div>
        )}

        {/* 입력 섹션 */}
        <div className="input-section">
          <div className="form-group">
            <label>🥬 냉장고에 있는 재료 *</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="예: 닭가슴살, 양파, 감자, 당근, 마늘&#10;(쉼표로 구분해주세요)"
              rows="4"
              disabled={loading}
            />
            <p className="form-hint">재료를 쉼표(,)로 구분해서 입력해주세요</p>
          </div>

          <div className="form-group">
            <label>💬 추가 요청사항 (선택)</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="예: 매운 음식 좋아해요, 30분 이내로 만들 수 있는 요리, 한식으로 만들어주세요"
              rows="3"
              disabled={loading}
            />
          </div>

          <button 
            className="btn-generate"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                AI가 레시피를 만들고 있어요...
              </>
            ) : (
              '✨ AI 레시피 생성하기'
            )}
          </button>
        </div>

        {/* 생성된 레시피 */}
        {generatedRecipe && (
          <div className="generated-recipe">
            <div className="recipe-header">
              <h2>🎉 레시피가 생성되었습니다!</h2>
              <button className="btn-save" onClick={handleSaveRecipe}>
                💾 레시피 저장하기
              </button>
            </div>

            <div className="recipe-content">
              <h3 className="recipe-title">{generatedRecipe.title}</h3>
              
              {generatedRecipe.description && (
                <p className="recipe-description">{generatedRecipe.description}</p>
              )}

              <div className="recipe-meta-grid">
                <div className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  <span>{generatedRecipe.cookingTime}분</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">👥</span>
                  <span>{generatedRecipe.servings}인분</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📊</span>
                  <span>{generatedRecipe.difficulty}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🏷️</span>
                  <span>{generatedRecipe.category}</span>
                </div>
              </div>

              {/* 재료 */}
              <div className="recipe-section">
                <h4>🥘 재료</h4>
                <ul className="ingredients-list">
                  {generatedRecipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              {/* 조리 순서 */}
              <div className="recipe-section">
                <h4>👨‍🍳 조리 순서</h4>
                <ol className="steps-list">
                  {generatedRecipe.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* 팁 */}
              {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
                <div className="recipe-section tips">
                  <h4>💡 조리 팁</h4>
                  <ul className="tips-list">
                    {generatedRecipe.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 태그 */}
              {generatedRecipe.tags && generatedRecipe.tags.length > 0 && (
                <div className="recipe-tags">
                  {generatedRecipe.tags.map((tag, idx) => (
                    <span key={idx} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        {!generatedRecipe && !loading && (
          <div className="guide-box">
            <h3>💡 사용 방법</h3>
            <ol>
              <li>냉장고에 있는 재료를 입력하세요</li>
              <li>프로필에 설정된 알레르기, 식단 제약이 자동으로 반영됩니다</li>
              <li>추가 요청사항이 있다면 입력하세요 (선택사항)</li>
              <li>AI가 맞춤 레시피를 생성해드립니다!</li>
              <li>마음에 드는 레시피는 저장하여 나중에 다시 볼 수 있습니다</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIRecipeGeneratorPage;