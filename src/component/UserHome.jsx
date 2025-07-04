import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import userservice from "../service/userservice";
import authService from "../service/authService";
import { FaBell, FaCommentDots, FaPlus, FaComment } from "react-icons/fa";

// Inject Poppins font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const UserHome = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
 const [petId, setPetId] = useState(null);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await authService.getToken();
        if (!token) throw new Error("Token not found");

        const decoded = jwtDecode(token);
        if (!decoded.appUserId) throw new Error("User ID not found in token");

        setUserId(decoded.appUserId);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    userservice.getAllPosts(userId)
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch posts");
        setLoading(false);
      });

    userservice.getUnreadCount(userId)
      .then(res => setUnreadCount(res.data || 0))
      .catch(() => setUnreadCount(0));
  }, [userId]);

const handleChatClick = (postOwnerId, type, petId) => {
  const trimmedType = type.trim().toLowerCase();

  if (trimmedType === "for adoption") {
  navigate(`/chat/${postOwnerId}/${userId}/${petId}`, {
  state: {
    initialMessage: "I want to adopt this pet!",
    type: "adoption message", // 🔥 REQUIRED
    petId,
  },
});



  } else {
    navigate(`/chat/${postOwnerId}/${userId}/${petId}`);
  }
};


  const handleGoToPost = () => {
    navigate(`/user/addpost/${userId}`);
  };

  const styles = {
    header: {
      backgroundColor: "rgba(19, 182, 185, 1.0)",
      color: "#000000",
      padding: "0.8rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: "'Poppins', sans-serif",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      letterSpacing: "1px",
      fontFamily: "'Poppins', sans-serif",
    },
    iconContainer: {
      display: "flex",
      gap: "1.5rem",
      alignItems: "center",
    },
    badge: {
      position: "absolute",
      top: "-6px",
      right: "-6px",
      backgroundColor: "rgba(255, 161, 0, 1.0)",
      color: "#FFFFFF",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "0.75rem",
      fontWeight: "bold",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem 1rem",
      fontFamily: "'Poppins', sans-serif",
    },
    createPostButton: {
      backgroundColor: "rgba(255, 161, 0, 1.0)",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "5px",
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontWeight: "bold",
      margin: "0 auto 2rem",
      fontFamily: "'Poppins', sans-serif",
    },
    postGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "1.5rem",
    },
    postCard: {
      backgroundColor: "rgba(19, 182, 185, 0.2)",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: "1px solid #ccc",
    },
    postHeader: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
    },
    userAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      marginRight: "10px",
      backgroundColor: "rgba(255, 161, 0, 1.0)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    postUserInfo: {
      flex: 1,
    },
    postUserName: {
      fontWeight: "bold",
      margin: 0,
      color: "#000000",
      fontFamily: "'Poppins', sans-serif",
    },
    postTime: {
      color: "#14213D",
      fontSize: "0.8rem",
      margin: 0,
      fontFamily: "'Poppins', sans-serif",
    },
    postContent: {
      padding: "0 16px 12px",
    },
    postText: {
      margin: "0 0 12px",
      fontSize: "1rem",
      lineHeight: "1.4",
      color: "#000000",
      fontFamily: "'Poppins', sans-serif",
    },
    postImages: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "8px",
      marginBottom: "12px",
    },
    postImage: {
      width: "100%",
      borderRadius: "8px",
      objectFit: "cover",
      maxHeight: "300px",
    },
    postFooter: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 16px",
      borderTop: "1px solid #ddd",
    },
    postAction: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px",
      borderRadius: "4px",
      cursor: "pointer",
      color: "#14213D",
      fontWeight: "bold",
      fontFamily: "'Poppins', sans-serif",
    },
    postTypeBadge: {
      backgroundColor: "rgba(255, 161, 0, 1.0)",
      color: "#FFFFFF",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.8rem",
      marginLeft: "8px",
      fontFamily: "'Poppins', sans-serif",
    },
    statusOutOfStock: {
      backgroundColor: "#808080",
      color: "#FFFFFF",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.8rem",
      fontFamily: "'Poppins', sans-serif",
    },
    statusAvailable: {
      backgroundColor: "rgba(19, 182, 185, 1.0)",
      color: "#FFFFFF",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.8rem",
      fontFamily: "'Poppins', sans-serif",
    },
  };

  if (error) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ backgroundColor: "#E5E5E5", minHeight: "100vh" }}>
      <header style={styles.header}>
        <h1 style={styles.title}>Home Page</h1>
        <div style={styles.iconContainer}>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => navigate(`/user/getnotifications/${userId}`)}>
            <FaBell size={24} />
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => navigate(`/user/chats/${userId}`)}>
            <FaCommentDots size={24} />
          </div>
        </div>
      </header>

      <div style={styles.container}>
        <button style={styles.createPostButton} onClick={handleGoToPost}>
          😊 What's on your mind? Share with us <span style={{ marginLeft: "6px", fontWeight: "bold" }}>→</span>
        </button>

        {loading && <p>Loading posts...</p>}
        {!loading && posts.length === 0 && (
          <div style={styles.postCard}>
            <div style={{ padding: "20px", textAlign: "center" }}>
              No posts available. Create your first post!
            </div>
          </div>
        )}

        <div style={styles.postGrid}>
          {posts.map((post) => {
            const isAdoption = post.type?.trim().toLowerCase() === "for adoption";
            const isMyPost = userId && post.appUser.appUserId === userId;
            const userInitials = post.appUser.firstname.charAt(0) + post.appUser.lastname.charAt(0);

            return (
              <div key={post.postId} style={styles.postCard}>
                <div style={styles.postHeader}>
                  <div style={styles.userAvatar}>{userInitials}</div>
                  <div style={styles.postUserInfo}>
                    <h3 style={styles.postUserName}>
                      {isMyPost ? "You" : `${post.appUser.firstname} ${post.appUser.lastname}`}
                    </h3>
                    <p style={styles.postTime}>
                      {new Date(post.createdAt).toLocaleString([], {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div style={styles.postContent}>
                  <p style={styles.postText}>{post.content}</p>
                  <div style={{ marginBottom: "10px" }}>
                    <span style={styles.postTypeBadge}>{post.type}</span>
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
                </div>
                <div style={styles.postFooter}>
                  {!isMyPost && (
                    <div
                      style={styles.postAction}
                      onClick={() => handleChatClick(post.appUser.appUserId, post.type, post.petId)}
                    >
                      <FaComment /> {isAdoption ? " Request Adopt" : "Message"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
