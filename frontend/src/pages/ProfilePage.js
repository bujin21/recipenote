import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../api/profile';  // ⭐ 여기만 확인
import ChangePasswordModal from '../components/ChangePasswordModal';
import '../styles/Profile.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: ''
  });

  const [allergies, setAllergies] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadUserProfile();
  }, [navigate]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      
      // API 응답 구조 확인
      const profile = response.data || response;
      
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        username: profile.username || ''
      });
      setAllergies(profile.allergies || []);
      setDietaryRestrictions(profile.dietaryRestrictions || []);
    } catch (error) {
      console.error('프로필 로드 실패:', error);
      
      // Fallback to localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          username: user.username || ''
        });
        setAllergies(user.allergies || []);
        setDietaryRestrictions(user.dietaryRestrictions || []);
      }
    } finally {
      setLoading(false);
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

    if (!formData.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    setSaving(true);

    try {
      const profileData = {
        name: formData.name,
        allergies,
        dietaryRestrictions
      };

      const response = await updateProfile(profileData);

      // localStorage 업데이트
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = {
          ...user,
          name: formData.name,
          allergies,
          dietaryRestrictions
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      alert('프로필이 저장되었습니다!');
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert(error.response?.data?.error?.message || '프로필 저장에 실패했습니다.');
    } finally {
      setSaving(false);
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <header className="dashboard-header">
          <div className="logo">🍳 RecipeNote</div>
          <nav className="nav">
            <a href="/dashboard">내 레시피</a>
            <a href="/profile">프로필</a>
            <a onClick={handleLogout} style={{ cursor: 'pointer' }}>로그아웃</a>
          </nav>
        </header>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#718096' }}>프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="dashboard-header">
        <div className="logo">🍳 RecipeNote</div>
        <nav className="nav">
          <a href="/dashboard">내 레시피</a>
          <a href="/ai-recipe">AI 레시피</a>
          <a href="/profile">프로필</a>
          <a onClick={handleLogout} style={{ cursor: 'pointer' }}>로그아웃</a>
        </nav>
      </header>

      <div className="profile-content">
        <div className="profile-section">
          <div className="page-header">
            <h1 className="page-title">프로필 설정</h1>
            <p className="page-subtitle">나에게 맞는 레시피를 추천받으세요</p>
          </div>

          <div className="profile-avatar">👤</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>아이디</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                disabled
                style={{ background: '#F7F9FC' }}
              />
            </div>

            <div className="form-group">
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={saving}
                placeholder="이름을 입력하세요"
              />
            </div>

            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                style={{ background: '#F7F9FC' }}
              />
            </div>

            <button
              type="button"
              className="btn-change-password"
              onClick={() => setShowPasswordModal(true)}
            >
              🔒 비밀번호 변경
            </button>

            <h2 className="section-title">🚫 알레르기</h2>
            <div className="checkbox-group">
              {allergyOptions.map((allergy) => (
                <label key={allergy} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={allergies.includes(allergy)}
                    onChange={() => toggleAllergy(allergy)}
                    disabled={saving}
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
                    disabled={saving}
                  />
                  {diet}
                </label>
              ))}
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={saving}
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </form>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}

export default ProfilePage;