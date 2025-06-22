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
    return <div className="text-center mt-5" style={{ color: '#333' }}>Loading...</div>;
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          height: '100vh',           // Full viewport height
          width: '100vw',            // Full viewport width
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: "'Raleway', sans-serif",
          boxSizing: 'border-box',
          overflowY: 'auto',         // Scroll vertically if needed
        }}
      >
        <div
          style={{
            backgroundColor: '#D0D5CE',
            color: '#333',
            borderRadius: '20px',
            padding: '3rem',
            width: '90vw',          // Take most of viewport width
            maxWidth: '1200px',     // max width for very large screens
            height: '85vh',         // fill most vertical space
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '3rem',
            overflowY: 'auto',     // scroll inside card if content grows
          }}
        >
          {/* Profile Image */}
         {userInfo.image && (
  <img
    src={`data:image/jpeg;base64,${userInfo.image}`}
    alt="Profile"
    style={{
      width: '200px',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '50%',
      border: '4px solid #121212',  // dark black border
      flexShrink: 0,
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    }}
  />
)}

          {/* Profile Details */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                fontSize: '1rem',
                textTransform: 'uppercase',
                color: '#666',
                fontWeight: '500',
                marginBottom: '0.5rem',
              }}
            >
              CEO / CO-FOUNDER
            </div>
           <h2
  style={{
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: '#121212',  // dark black text
  }}
>
  {userInfo.firstname} {userInfo.lastname}
</h2>

            <div
              style={{
                fontSize: '1.3rem',
                lineHeight: '1.8',
                color: '#444',
                maxWidth: '700px',
              }}
            >
              <div><strong>Email:</strong> {userInfo.username}</div>
              <div><strong>Phone:</strong> {userInfo.phone}</div>
              <div><strong>Gender:</strong> {userInfo.gender}</div>
              <div><strong>Birth Date:</strong> {userInfo.birthDate}</div>
              <div><strong>Address:</strong> {userInfo.address}</div>
            </div>

            {/* Buttons */}
            <div
              style={{
                marginTop: '3rem',
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
              }}
            >
             <button
  style={{
    backgroundColor: '#121212', // dark black button
    color: '#fff',
    borderRadius: '24px',
    padding: '0.8rem 2.4rem',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
  }}
  onClick={() => navigate(`/admin/updateadmin/${userInfo.appUserId}`)}
>
  Edit Profile
</button>
              <button
                style={{
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  borderRadius: '24px',
                  padding: '0.8rem 2.4rem',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                }}
                onClick={() => navigate('/admin/updatePassword')}
              >
                Update Password
              </button>
              <button
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  borderRadius: '24px',
                  padding: '0.8rem 2.4rem',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
