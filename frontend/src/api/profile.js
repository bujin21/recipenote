import api from './index';

// 프로필 조회
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// 프로필 수정
export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

// 비밀번호 변경
export const changePassword = async (passwordData) => {
  const response = await api.put('/users/password', passwordData);
  return response.data;
};