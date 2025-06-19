import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../service/adminService';

const AdminProfile = () => {
  const [userInfo, setUserInfo] = useState({
    appUserId: '',
    username: '',
    role: '',
    gender: '',
    firstname: '',
    lastname: '',
    address: '',
    phone: '',
    birthDate: '',
    password: '',
    image: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await AdminService.getUserProfile();
      setUserInfo(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch user info.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  if (loading) {
    return <div className="text-center mt-5 text-primary">Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #141e30, #243b55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e1e2f',
          color: '#fff',
          borderRadius: '16px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '850px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          position: 'relative',
        }}
      >
       

        {/* Profile Image + Name */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {userInfo.image && (
            <img
              src={`data:image/jpeg;base64,${userInfo.image}`}
              alt="Profile"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '50%',
                marginRight: '1.5rem',
                border: '3px solid #6f42c1',
              }}
            />
          )}
          <div>
            <div
              style={{
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                color: '#888',
                fontWeight: '500',
              }}
            >
              CEO / CO-FOUNDER
            </div>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
              }}
            >
              {userInfo.firstname} {userInfo.lastname}
            </h2>

          </div>
        </div>

        {/* User Info */}
        <div
          style={{
            marginTop: '2rem',
            fontSize: '1rem',
            lineHeight: '1.8',
            color: '#ccc',
          }}
        >
          <div>
            <strong>Email:</strong> {userInfo.username}
          </div>
          <div>
            <strong>Phone:</strong> {userInfo.phone}
          </div>
          <div>
            <strong>Gender:</strong> {userInfo.gender}
          </div>
          <div>
            <strong>Birth Date:</strong> {userInfo.birthDate}
          </div>
          <div>
            <strong>Address:</strong> {userInfo.address}
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            className="btn"
            style={{
              backgroundColor: '#af48c7',
              color: '#fff',
              borderRadius: '20px',
              padding: '0.6rem 1.8rem',
              fontWeight: 'bold',
              border: 'none',
            }}
            onClick={() => navigate(`/admin/updateadmin/${userInfo.appUserId}`)}
          >
            Edit Profile
          </button>
          <button
            className="btn"
            style={{
              backgroundColor: '#6c757d',
              color: '#fff',
              borderRadius: '20px',
              padding: '0.6rem 1.8rem',
              fontWeight: 'bold',
              border: 'none',
            }}
            onClick={() => navigate('/admin/updatePassword')}
          >
            Update Password
          </button>
          <button
            className="btn"
            style={{
              backgroundColor: '#dc3545',
              color: '#fff',
              borderRadius: '20px',
              padding: '0.6rem 1.8rem',
              fontWeight: 'bold',
              border: 'none',
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
