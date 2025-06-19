import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../service/userservice';
import { 
  FaEdit, 
  FaTrash, 
  FaLock, 
  FaSignOutAlt, 
  FaUserEdit, 
  FaThumbsUp, 
  FaComment, 
  FaShare, FaBars, FaTimes,
  FaPlus 
} from 'react-icons/fa';
<link href="https://fonts.googleapis.com/css2?family=Tinos&display=swap" rel="stylesheet"></link>
const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [resolvedAddress, setResolvedAddress] = useState('');

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getUserProfile();
      setUserInfo(response);

      const posts = await userService.getUserPosts(response.appUserId);
      setUserPosts(posts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile or posts:', err);
      setError('Failed to fetch user info or posts.');
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


useEffect(() => {
    if (userInfo && userInfo.address && userInfo.address.includes(',')) {
      const [longitude, latitude] = userInfo.address.split(',').map(Number);
      const fetchAddressFromCoordinates = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
setResolvedAddress(data.display_name);
        } catch (error) {
          setResolvedAddress('Address: ' + userInfo.address);
        }
      };
      fetchAddressFromCoordinates();
    }
  }, [userInfo]);







  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await userService.deletePost(postId);
        alert("Post deleted successfully!");
        const updatedPosts = await userService.getUserPosts(userInfo.appUserId);
        setUserPosts(updatedPosts);
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Failed to delete post.");
      }
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/user/updatepost/${postId}`);
  };

  // Styles
  const styles = {
  container: {
    fontFamily: "'Tinos', serif",
    backgroundColor: '#E5E5E5',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#14213D',
    height: '350px',
    position: 'relative',
    color: '#FFFFFF',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    position: 'relative',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginTop: '-100px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '5px solid #FFFFFF',
    marginTop: '-75px',
    objectFit: 'cover',
    backgroundColor: '#14213D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '3rem',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: '2rem',
    margin: '1rem 0 0.5rem',
    color: '#000000',
  },
  userBio: {
    color: '#14213D',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
    fontFamily: "'Tinos', serif",
  },
  primaryButton: {
    backgroundColor: '#FCA311',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#14213D',
    color: '#FFFFFF',
  },
  dangerButton: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '2rem auto',
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '1.5rem',
    padding: '0 1rem',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  infoTitle: {
    fontSize: '1.2rem',
    marginTop: '0',
    marginBottom: '1rem',
    color: '#000000',
    borderBottom: '2px solid #FCA311',
    paddingBottom: '0.5rem',
  },
  infoItem: {
    marginBottom: '0.8rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#14213D',
  },
  infoValue: {
    color: '#000000',
  },
  postsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1.5rem',
  },
  postCard: {
    borderBottom: '1px solid #ddd',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  postUserImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
    backgroundColor: '#14213D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontWeight: 'bold',
    margin: '0',
    color: '#000000',
  },
  postTime: {
    color: '#14213D',
    fontSize: '0.8rem',
    margin: '0',
  },
  postContent: {
    marginBottom: '1rem',
    color: '#000000',
  },
  postType: {
    display: 'inline-block',
    backgroundColor: '#FCA311',
    color: '#FFFFFF',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    marginBottom: '1rem',
  },
  postImages: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    marginBottom: '1rem',
  },
  postImage: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
    maxHeight: '300px',
  },
  postActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  postAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#14213D',
    fontWeight: 'bold',
  },
  editDeleteButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
};


  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: "'Economica', sans-serif"
    }}>
      Loading...
    </div>
  );

  const userInitials = userInfo.firstname?.charAt(0) + userInfo.lastname?.charAt(0);

  return (
    <div style={styles.container}>
      {/* Header with cover photo */}
      <div style={styles.header}>
        {/* Placeholder for cover photo - you can replace with actual image if available */}
        <div style={{ 
          backgroundColor: '#14213D', 
          width: '100%', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem'
        }}>
          PawLover Profile
        </div>
      </div>

      <div style={styles.profileSection}>
        {/* Profile card */}
        <div style={styles.profileCard}>
          <div style={styles.profileImage}>
            {userInfo.image ? (
              <img 
                src={`data:image/jpeg;base64,${userInfo.image}`} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            ) : (
              userInitials
            )}
          </div>
          
          <h1 style={styles.userName}>{userInfo.firstname} {userInfo.lastname}</h1>
          <p style={styles.userBio}>Pet lover and community member</p>
          
          <div style={styles.actionButtons}>
            <button 
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={() => navigate(`/user/updateuser/${userInfo.appUserId}`)}
            >
              <FaUserEdit /> Edit Profile
            </button>
            <button 
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => navigate('/user/updatePassword')}
            >
              <FaLock /> Update Password
            </button>
            <button 
              style={{ ...styles.button, ...styles.dangerButton }}
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.contentContainer}>
        {/* Left sidebar - User info */}
        <div>
          <div style={styles.infoCard}>
            <h2 style={styles.infoTitle}>About</h2>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>First Name:</span>
              <span style={styles.infoValue}>{userInfo.firstname}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Last Name:</span>
              <span style={styles.infoValue}>{userInfo.lastname}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Birth Date:</span>
              <span style={styles.infoValue}>{userInfo.birthDate}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email:</span>
              <span style={styles.infoValue}>{userInfo.username}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Gender:</span>
              <span style={styles.infoValue}>{userInfo.gender}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Phone:</span>
              <span style={styles.infoValue}>{userInfo.phone}</span>
            </div>
            <div style={styles.infoItem}>
  <span style={styles.infoLabel}>Address:</span>
  <span style={styles.infoValue}>{resolvedAddress}</span>
</div>

          </div>

          <div style={styles.infoCard}>
            <h2 style={styles.infoTitle}>Stats</h2>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Posts:</span>
              <span style={styles.infoValue}>{userPosts.length}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Member Since:</span>
              <span style={styles.infoValue}>
                {new Date(userInfo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right content - Posts */}
        <div style={styles.postsContainer}>
          <h2 style={{ marginTop: 0 }}>Your Posts</h2>
          
          {userPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>You haven't created any posts yet.</p>
              <button 
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={() => navigate('/user/addpost')}
              >
                <FaPlus /> Create Your First Post
              </button>
            </div>
          ) : (
            userPosts.map((post) => (
              <div key={post.postId} style={styles.postCard}>
                <div style={styles.postHeader}>
                  <div style={styles.postUserImage}>
                    {userInitials}
                  </div>
                  <div style={styles.postUserInfo}>
                    <h3 style={styles.postUserName}>You</h3>
                    <p style={styles.postTime}>
                      {new Date(post.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>

                <div style={styles.postContent}>
                  <span style={styles.postType}>{post.type}</span>
                  <p>{post.content}</p>
                </div>

                {post.images?.length > 0 && (
                  <div style={styles.postImages}>
                    {post.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`data:image/jpeg;base64,${img}`}
                        alt={`post-${idx}`}
                        style={styles.postImage}
                      />
                    ))}
                  </div>
                )}

                

                <div style={styles.editDeleteButtons}>
                  <button
                    onClick={() => handleEditPost(post.postId)}
                    style={{
                      ...styles.button,
                      backgroundColor: '#FEA70F',
                      color: 'white',
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                  {post.type !== 'For Adoption' && post.type !== 'Lost-Found' && (
                    <button
                      onClick={() => handleDeletePost(post.postId)}
                      style={{
                        ...styles.button,
                        backgroundColor: '#DC3545',
                        color: 'white',
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;