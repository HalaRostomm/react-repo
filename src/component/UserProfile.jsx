import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../service/userservice';
import {
  FaEdit,
  FaTrash,
  FaLock,
  FaSignOutAlt,
  FaUserEdit,
  FaPlus,
} from 'react-icons/fa';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const u = await userService.getUserProfile();
        setUserInfo(u);
        const posts = await userService.getUserPosts(u.appUserId);
        setUserPosts(posts);
      } catch {
        console.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

 

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await userService.deletePost(postId);
      const posts = await userService.getUserPosts(userInfo.appUserId);
      setUserPosts(posts);
    } catch {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const initials = `${userInfo.firstname?.[0] || ''}${userInfo.lastname?.[0] || ''}`;

  // Color constants
  const colors = {
    primary: '#FFA100', // Button and icon color
    cardBg: 'rgba(19, 182, 185, 0.2)', // 0x3313b6b9 equivalent in rgba
    headerBg: '#13b6b9', // Header background
    text: '#000000', // Black text
    white: '#FFFFFF',
    statusAvailable: '#13b6b9',
    statusOther: '#808080',
    avatarBg: '#14213D',
  };

  // Shared button style
  const baseBtnStyle = {
    backgroundColor: colors.primary,
    color: colors.text,
    padding: '0.75rem 1.25rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    fontSize: '0.95rem',
    fontFamily: "'Poppins', sans-serif",
  };

  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      color: colors.text,
      backgroundColor: '#f5f5f5',
      paddingBottom: '2rem',
      minHeight: '100vh',
    },
    profileCard: {
      maxWidth: '800px',
      margin: '2rem auto',
      backgroundColor: colors.cardBg,
      borderRadius: '12px',
      padding: '2rem 1rem',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    avatar: {
      width: '140px',
      height: '140px',
      borderRadius: '50%',
      border: `4px solid ${colors.white}`,
      overflow: 'hidden',
      margin: '0 auto 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.avatarBg,
      color: colors.white,
      fontSize: '3rem',
      fontWeight: 'bold',
    },
    userName: {
      margin: '0.5rem 0',
      fontSize: '1.8rem',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '600',
    },
    actions: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    btn: baseBtnStyle,
    createBtn: {
      ...baseBtnStyle,
      marginTop: '1.5rem',
    },
    main: {
      display: 'flex',
      maxWidth: '1200px',
      margin: '0 auto',
      gap: '1rem',
      padding: '0 1rem',
      fontFamily: "'Poppins', sans-serif",
    },
    sidebar: {
      flex: '0 0 300px',
      backgroundColor: colors.cardBg,
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      maxHeight: '400px',  // or any height you want
    },
    sidebarTitle: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1.2rem',
      marginBottom: '1rem',
      fontWeight: '600',
    },
    infoItem: {
     marginBottom: '0.25rem',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: "'Poppins', sans-serif",
    },
    label: {
      fontWeight: '600',
    },
    value: {},
    postsSection: {
      flex: 1,
    },
    postsTitle: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1.2rem',
      marginBottom: '1rem',
      fontWeight: '600',
    },
    postCard: {
      backgroundColor: colors.white,
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem',
    },
    postHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    postAvatar: {
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      backgroundColor: colors.avatarBg,
      color: colors.white,
      fontWeight: '600',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '10px',
    },
    postAuthor: {
      fontWeight: '600',
      fontFamily: "'Poppins', sans-serif",
    },
    postDate: {
      fontSize: '0.85rem',
      color: '#555',
      fontFamily: "'Poppins', sans-serif",
    },
    statusLabel: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontWeight: '600',
      fontSize: '0.85rem',
      marginBottom: '0.75rem',
      color: colors.white,
      fontFamily: "'Poppins', sans-serif",
    },
    postContent: {
      marginBottom: '1rem',
      lineHeight: '1.5',
      fontFamily: "'Poppins', sans-serif",
    },
    postImages: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      marginBottom: '1rem',
    },
    postImg: {
      width: 'calc(33% - 0.5rem)',
      borderRadius: '8px',
      objectFit: 'cover',
      maxHeight: '200px',
    },
    postActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
    },
    editBtn: {
      ...baseBtnStyle,
      backgroundColor: colors.primary,
    },
    delBtn: {
      ...baseBtnStyle,
      backgroundColor: colors.statusOther,
    },
  };

  return (
    <div style={styles.container}>
      <section style={styles.profileCard}>
        <div style={styles.avatar}>
          {userInfo.image ? (
            <img 
              src={`data:image/jpeg;base64,${userInfo.image}`} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            initials
          )}
        </div>
        <h2 style={styles.userName}>
          {userInfo.firstname} {userInfo.lastname}
        </h2>
        <div style={styles.actions}>
          <button
            style={styles.btn}
            onClick={() => navigate(`/user/updateuser/${userInfo.appUserId}`)}
          >
            <FaUserEdit color={colors.text} /> Edit Profile
          </button>
          <button
            style={styles.btn}
            onClick={() => navigate('/user/updatePassword')}
          >
            <FaLock color={colors.text} /> Update Password
          </button>
          <button style={styles.btn} onClick={handleLogout}>
            <FaSignOutAlt color={colors.text} /> Logout
          </button>
        </div>
      </section>

      <main style={styles.main}>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>About</h3>
          {[
            ['Name', `${userInfo.firstname || ''} ${userInfo.lastname || ''}`.trim()],
            ['Birth Date', userInfo.birthDate],
            ['Email', userInfo.username],
            ['Gender', userInfo.gender],
            ['Phone', userInfo.phone],
            ['Address', userInfo.address],
          ].map(([label, val]) => (
            <div key={label} style={styles.infoItem}>
              <span style={styles.label}>{label}:</span>
              <span style={styles.value}>{val || '-'}</span>
            </div>
          ))}
        </aside>

        <section style={styles.postsSection}>
          <h3 style={styles.postsTitle}>Your Posts</h3>
          {userPosts.length === 0 ? (
            <button
              style={styles.createBtn}
              onClick={() => navigate('/user/addpost')}
            >
              <FaPlus color={colors.text} /> Create Your First Post
            </button>
          ) : (
            userPosts.map((post) => (
              <div key={post.postId} style={styles.postCard}>
                <div style={styles.postHeader}>
                  <div style={styles.postAvatar}>{initials}</div>
                  <div>
                    <div style={styles.postAuthor}>You</div>
                    <div style={styles.postDate}>
                      {new Date(post.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    ...styles.statusLabel,
                    backgroundColor:
                      post.status === 'Available' ? colors.statusAvailable : colors.statusOther,
                  }}
                >
                  {post.status || post.type}
                </span>

                <p style={styles.postContent}>{post.content}</p>

                {post.images?.length > 0 && (
                  <div style={styles.postImages}>
                    {post.images.map((img, i) => (
                      <img
                        key={i}
                        src={`data:image/jpeg;base64,${img}`}
                        alt=""
                        style={styles.postImg}
                      />
                    ))}
                  </div>
                )}

                <div style={styles.postActions}>
                  <button
                    style={styles.editBtn}
                    onClick={() => navigate(`/user/updatepost/${post.postId}`)}
                  >
                    <FaEdit color={colors.text} /> Edit
                  </button>
                   { !['for adoption cd', 'lost found cd', 'cd'].includes(post.type?.toLowerCase()) && (
        <button
          style={styles.delBtn}
          onClick={() => handleDeletePost(post.postId)}
        >
          <FaTrash color={colors.white} /> Delete
        </button>
      )}
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default UserProfile;