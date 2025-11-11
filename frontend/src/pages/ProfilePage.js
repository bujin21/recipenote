import React, { useState } from 'react';
import '../styles/Profile.css';

function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '홍길동',
    email: 'hong@gmail.com'
  });

  const [allergies, setAllergies] = useState(['갑각류']);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(['채식']);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('프로필 저장:', formData, allergies, dietaryRestrictions);
    alert('프로필이 저장되었습니다!');
  };

  const allergyOptions = ['땅콩', '갑각류', '견과류', '유제품', '계란', '밀'];
  const dietOptions = ['채식', '비건', '할랄', '저염식'];

  const toggleAllergy = (allergy) => {
    setAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const toggleDiet = (diet) => {
    setDietaryRestrictions(prev =>
      prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  };

  return (
    <div className="profile-container">
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
      <div className="profile-content">
        <div className="profile-section">
          <div className="page-header">
            <h1 className="page-title">프로필 설정</h1>
            <p className="page-subtitle">나에게 맞는 레시피를 추천받으세요</p>
          </div>

          <div className="profile-avatar">👤</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                style={{ background: '#F7F9FC' }}
              />
            </div>

            <h2 className="section-title">🚫 알레르기</h2>
            <div className="checkbox-group">
              {allergyOptions.map((allergy) => (
                <label key={allergy} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={allergies.includes(allergy)}
                    onChange={() => toggleAllergy(allergy)}
                  />
                  {allergy}
                </label>
              ))}
            </div>

            <h2 className="section-title">🥗 식단 제약</h2>
            <div className="checkbox-group">
              {dietOptions.map((diet) => (
                <label key={diet} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={dietaryRestrictions.includes(diet)}
                    onChange={() => toggleDiet(diet)}
                  />
                  {diet}
                </label>
              ))}
            </div>

            <button type="submit" className="btn-primary">
              저장하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;