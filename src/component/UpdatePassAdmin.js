import React, { useState } from 'react';
import adminService from '../service/adminService';

const UpdatePassAdmin = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('❌ New passwords do not match!');
      setMessageType('error');
      return;
    }

    try {
      await adminService.updatePassword(oldPassword, newPassword);
      setMessage('✅ Password updated successfully.');
      setMessageType('success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.response?.data || '❌ Error updating password.');
      setMessageType('error');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        padding: '50px 20px',
        fontFamily: "'Segoe UI', sans-serif",
        color: '#e0e0e0',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(90deg, #9c27b0, #d63384)',
            padding: '20px 30px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontWeight: '700' }}>Update Password</h2>
          <p style={{ margin: 0, color: '#f3e5f5' }}>Secure your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handlePasswordUpdate} style={{ padding: '30px' }}>
          <div className="mb-3">
            <label className="form-label">Old Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-end mt-4">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: '#9c27b0',
                color: '#fff',
                padding: '10px 25px',
                fontWeight: '600',
                borderRadius: '8px',
              }}
            >
              Update Password
            </button>
          </div>

          {message && (
            <div
              className="mt-4 text-center fw-semibold"
              style={{
                backgroundColor: messageType === 'success' ? '#2e7d32' : '#c62828',
                color: '#fff',
                padding: '10px',
                borderRadius: '6px',
              }}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdatePassAdmin;
