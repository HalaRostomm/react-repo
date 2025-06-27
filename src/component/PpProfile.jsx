import React, { useEffect, useState } from 'react';
import PpService from '../service/ppservice';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTransgender,
  FaMapMarkerAlt,
  FaEdit,
  FaLock,
  FaSignOutAlt,
} from 'react-icons/fa';

const PpProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [resolvedAddress, setResolvedAddress] = useState('');

  const fetchUserProfile = async () => {
    try {
      const response = await PpService.getUserProfile();
      setUserInfo(response);
    } catch (err) {
      setError('Failed to fetch user profile');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

 

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  const styles = {
    pageContainer: {
      fontFamily: "'Poppins', sans-serif",
      color: '#000000',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#FFFFFF',
      padding: '60px 100px',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    profileCard: {
      backgroundColor: '#FCA311',
      borderRadius: '20px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
      width: '80%',
      maxWidth: '900px',
      padding: '40px 60px',
      boxSizing: 'border-box',
      display: 'flex',
      gap: '60px',
      alignItems: 'center',
    },
    image: {
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      border: '4px solid #000000',
      objectFit: 'cover',
      flexShrink: 0,
      boxShadow: '0 0 12px rgba(0, 0, 0, 0.4)',
    },
    infoSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    heading: {
      color: '#000000',
      fontWeight: 800,
      fontSize: '32px',
      marginBottom: '10px',
      letterSpacing: '1px',
    },
    text: {
      fontSize: '18px',
      lineHeight: 1.6,
      color: '#000000',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    buttonGroup: {
      marginTop: '30px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
    },
    button: {
      backgroundColor: '#000000',
      border: 'none',
      padding: '14px 30px',
      color: '#FFFFFF',
      fontWeight: 700,
      fontSize: '16px',
      borderRadius: '10px',
      cursor: 'pointer',
      boxShadow: '0 5px 12px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    buttonLogout: {
      backgroundColor: '#FFFFFF',
      border: '2px solid #000000',
      padding: '14px 30px',
      color: '#000000',
      fontWeight: 700,
      fontSize: '16px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.profileCard}>
        {userInfo?.image && (
          <img
            src={`data:image/jpeg;base64,${userInfo.image}`}
            alt="Profile"
            style={styles.image}
          />
        )}
        <div style={styles.infoSection}>
          {error && <p style={{ color: '#B00020', fontWeight: '700' }}>{error}</p>}
          {userInfo && (
            <>
              <h1 style={styles.heading}>Product Provider Profile</h1>
              <p style={styles.text}>
                <FaUser /> <strong>Name:</strong> {userInfo.firstname} {userInfo.lastname}
              </p>
              <p style={styles.text}>
                <FaEnvelope /> <strong>Email:</strong> {userInfo.username}
              </p>
              <p style={styles.text}>
                <FaTransgender /> <strong>Gender:</strong> {userInfo.gender}
              </p>
              <p style={styles.text}>
                <FaPhone /> <strong>Phone:</strong> {userInfo.phone}
              </p>
              <p style={styles.text}>
                <FaMapMarkerAlt /> <strong>Address:</strong> {userInfo.address}
              </p>

              <div style={styles.buttonGroup}>
                <button
                  style={styles.button}
                  onClick={() => navigate(`/pp/updatepp/${userInfo.appUserId}`)}
                >
                  <FaEdit /> Edit Profile
                </button>
                <button
                  style={styles.button}
                  onClick={() => navigate('/pp/updatePassword')}
                >
                  <FaLock /> Update Password
                </button>
                <button style={styles.buttonLogout} onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PpProfile;
