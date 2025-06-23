import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";

const COLORS = {
  PRIMARY: "#13b6b9",
  ACCENT: "#ffa100",
  CARD_BG_OPACITY: "#13b6b933",
  TEXT: "#000000",
  HEADER_TEXT: "#fff",
};

const ListLostFoun = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [petId, setPetId] = useState(null);

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



  useEffect(() => {
    setLoading(true);
    setError(null);
    userService
      .getLostFoundPosts(userId)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching lost/found posts:", err);
        setError("Failed to load posts.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading)
    return (
      <p style={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}>
        ⏳ Loading Lost-Found posts...
      </p>
    );
  if (error)
    return (
      <p
        style={{
          color: "red",
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {error}
      </p>
    );
  if (posts.length === 0)
    return (
      <p style={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}>
        📭 No Lost-Found posts available.
      </p>
    );

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          backgroundColor: COLORS.PRIMARY,
          color: COLORS.HEADER_TEXT,
          padding: "1rem 0",
          borderRadius: "12px",
          userSelect: "none",
          fontWeight: "700",
          fontSize: "1.8rem",
          boxShadow: `0 2px 6px ${COLORS.PRIMARY}80`,
        }}
      >
        📢 Lost & Found Feed
      </h2>

      {/* Grid container */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {posts.map((post) => {
          const trimmedType = post.type?.trim().toLowerCase();
          const isLostFound = trimmedType === "lost-found";

          return (
            <div
              key={post.postId}
              style={{
                backgroundColor: COLORS.CARD_BG_OPACITY,
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                color: COLORS.TEXT,
                overflow: "hidden",
                border: `1.5px solid ${COLORS.PRIMARY}`,
                transition: "box-shadow 0.3s ease",
                cursor: "default",
                width: "48%",
                minWidth: "280px",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)")
              }
            >
              {/* Header */}
              <div
                style={{
                  padding: "0.8rem 1rem",
                  borderBottom: `1px solid ${COLORS.PRIMARY}33`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    color: COLORS.PRIMARY,
                    marginBottom: "2px",
                    userSelect: "text",
                  }}
                >
                  {post.appUser.firstname} {post.appUser.lastname}
                </span>
                <small
                  style={{
                    color: "#555",
                    fontSize: "12px",
                    userSelect: "none",
                  }}
                >
                  {new Date(post.createdAt).toLocaleString([], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>

              {/* Images */}
              {post.images?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    overflowX: "auto",
                    padding: "8px 10px",
                    backgroundColor: "#e6f7f8",
                    scrollbarWidth: "thin",
                  }}
                >
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`data:image/jpeg;base64,${img}`}
                      alt={`post-img-${idx}`}
                      style={{
                        height: "120px",
                        borderRadius: "10px",
                        objectFit: "cover",
                        flexShrink: 0,
                        boxShadow: `0 2px 8px ${COLORS.PRIMARY}66`,
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div style={{ padding: "1rem 1.2rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "0.8rem",
                    lineHeight: "1.4",
                    flexGrow: 1,
                  }}
                >
                  {post.content}
                </p>

               

                <p style={{ fontSize: "13px", marginBottom: "1rem" }}>
                  📌 Type: <strong>{post.type}</strong>
                </p>

                <button
                  onClick={() => handleChatClick(post.appUser.appUserId, post.type)}
                  style={{
                    backgroundColor: COLORS.ACCENT,
                    color: COLORS.TEXT,
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "14px",
                    transition: "background-color 0.3s ease",
                    userSelect: "none",
                    width: "100%",
                    marginTop: "auto",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e59400")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.ACCENT)}
                >
                  {isLostFound ? "💬 Message Owner" : "🐶 Adopt"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListLostFoun;
