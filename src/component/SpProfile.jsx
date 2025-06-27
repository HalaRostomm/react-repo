import React, { useEffect, useState } from 'react';
import ServiceService from '../service/spservice';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaLock, FaSignOutAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';

const SpProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ServiceService.getUserProfile();
        setUserInfo(response);
      } catch (err) {
        setError('❌ Failed to fetch user profile');
      }
    };
    fetchUserProfile();
  }, []);

  
  useEffect(() => {
  document.body.style.backgroundColor = "#E7ECEF";
  return () => {
    document.body.style.backgroundColor = null; // Reset on unmount
  };
}, []);
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  return (
      <div
    style={{
      backgroundColor: '#E7ECEF',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
    }}
  >
    <div
      className="profile-page"
      style={{
        backgroundColor: '#E7ECEF',
        fontFamily: "'Poppins', sans-serif",
        color: '#274C77',
        padding: '3rem 6rem',
        maxWidth: 900,
        width: '100%',
        borderRadius: '1rem',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      }}
    >
      <style>
        {`
          .profile-header {
            font-size: 2.5rem;
            font-weight: 700;
            color: #274C77;
            margin-bottom: 2rem;
            border-bottom: 4px solid #6096BA;
            padding-bottom: 0.5rem;
            text-align: center;
          }

          .profile-main {
            display: flex;
            align-items: flex-start;
            gap: 2rem;
            flex-wrap: wrap;
          }

          .profile-img {
            width: 160px;
            height: 160px;
            border-radius: 50%;
            object-fit: cover;
            border: 5px solid #A3CEF1;
            box-shadow: 0 0 10px rgba(39, 76, 119, 0.3);
          }

          .profile-info {
            flex: 1;
            background-color: #FFFFFF;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
          }

          .profile-info p {
            font-size: 1.1rem;
            margin: 1rem 0;
            display: flex;
            align-items: center;
            color: #274C77;
          }

          .profile-info svg {
            margin-right: 0.75rem;
            color: #6096BA;
          }

          .button-group {
            margin-top: 2.5rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
          }

          button {
            cursor: pointer;
            padding: 0.65rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 0.4rem;
            border: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: background-color 0.3s ease;
          }

          .btn-edit {
            background-color: #6096BA;
            color: white;
          }
          .btn-edit:hover {
            background-color: #4e7ea3;
          }

          .btn-password {
            background-color: #274C77;
            color: white;
          }
          .btn-password:hover {
            background-color: #1c365a;
          }

          .btn-logout {
            background-color: #8B8C89;
            color: white;
          }
          .btn-logout:hover {
            background-color: #6e6f6d;
          }

          .error-message {
            color: #dc3545;
            font-weight: 600;
            margin-bottom: 1.5rem;
            text-align: center;
          }
        `}
      </style>

      <h1 className="profile-header">Service Provider Profile</h1>

      {error && <div className="error-message">{error}</div>}

      {userInfo && (
        <>
          <div className="profile-main">
            {userInfo.image && (
              <img
                src={`data:image/jpeg;base64,${userInfo.image}`}
                alt="Profile"
                className="profile-img"
              />
            )}

            <div className="profile-info">
              <p><FaUser /><strong>{userInfo.firstname} {userInfo.lastname}</strong></p>
              <p><FaEnvelope />{userInfo.username}</p>
              <p><FaPhone />{userInfo.phone}</p>
              <p><FaMapMarkerAlt />{userInfo.address || 'Loading address...'}</p>
            </div>
          </div>

          <div className="button-group">
            <button className="btn-edit" onClick={() => navigate(`/sp/updatesp/${userInfo.appUserId}`)}>
              <FaUserEdit /> Edit Profile
            </button>
            <button className="btn-password" onClick={() => navigate('/sp/updatePassword')}>
              <FaLock /> Update Password
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default SpProfile;
