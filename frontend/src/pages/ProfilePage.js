import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import '../styles/Profile.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [allergies, setAllergies] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);

  useEffect(() => {
    // 인증 확인
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // 사용자 정보 불러오기
    loadUserProfile();
  }, [navigate]);

  const loadUserProfile = async () => {
    try {
      const response = await AuthService.getCurrentUser();
      
      if (response.success) {
        const user = response.data;
        setFormData({
          name: user.name || '',
          email: user.email || ''
        });
        setAllergies(user.allergies || []);
        setDietaryRestrictions(user.dietaryRestrictions || []);
      }
    } catch (error) {
      console.error('프로필 로드 실패:', error);
      // 로컬 스토리지에서 가져오기
      const user = AuthService.getUser();
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || ''
        });
        setAllergies(user.allergies || []);
        setDietaryRestrictions(user.dietaryRestrictions || []);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: 프로필 업데이트 API 호출
      // const response = await UserService.updateProfile({
      //   ...formData,
      //   allergies,
      //   dietaryRestrictions
      // });

      // 임시로 로컬 스토리지 업데이트
      const user = AuthService.getUser();
      const updatedUser = {
        ...user,
        ...formData,
        allergies,
        dietaryRestrictions
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('프로필이 저장되었습니다!');
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert('프로필 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
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

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      AuthService.logout();
    }
  };

  return (
    <div className="profile-container">
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
                disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                  {diet}
                </label>
              ))}
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;