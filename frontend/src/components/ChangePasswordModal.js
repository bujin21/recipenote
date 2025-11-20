import React, { useState } from 'react';
import { changePassword } from '../api/profile';  // ⭐ 수정
import '../styles/ChangePasswordModal.css';

function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.currentPassword) {
      setError('현재 비밀번호를 입력해주세요.');
      return;
    }

    if (!formData.newPassword) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('새 비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.success) {
        alert('비밀번호가 변경되었습니다!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        onClose();
      }
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      setError(
        error.response?.data?.error?.message || 
        '비밀번호 변경에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🔒 비밀번호 변경</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>현재 비밀번호 *</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="현재 비밀번호를 입력하세요"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className="form-group">
            <label>새 비밀번호 *</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="새 비밀번호 (최소 8자)"
              disabled={loading}
              autoComplete="new-password"
            />
            <p className="form-hint">8자 이상, 영문+숫자+특수문자 권장</p>
          </div>

          <div className="form-group">
            <label>새 비밀번호 확인 *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="새 비밀번호를 다시 입력하세요"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="modal-buttons">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? '변경 중...' : '변경하기'}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;