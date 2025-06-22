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
    <>
      {/* Import Raleway font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#D0D5CE',
          padding: '50px 20px',
          fontFamily: "'Raleway', sans-serif",
          color: '#333',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(90deg, #000000, #4a148c)',
              padding: '20px 30px',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              textAlign: 'center',
              color: '#fff',
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
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
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
                  backgroundColor: '#000000',
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
                  marginTop: '20px',
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassAdmin;
