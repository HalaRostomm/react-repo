import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";

const ListLostFoun = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChatClick = (postOwnerId, type) => {
    const message =
      type.trim().toLowerCase() === "lost-found"
        ? "I have information about your lost pet!"
        : "I want to adopt this pet!";
    navigate(`/chat/${postOwnerId}/${userId}`, {
      state: { initialMessage: message },
    });
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

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Loading Lost-Found posts...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (posts.length === 0) return <p style={{ textAlign: "center" }}>📭 No Lost-Found posts available.</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", fontFamily: "'Poppins', sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>📢 Lost & Found Feed</h2>
      {posts.map((post) => {
        const trimmedType = post.type?.trim().toLowerCase();
        const isLostFound = trimmedType === "lost-found";

        return (
          <div
            key={post.postId}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              marginBottom: "2rem",
              overflow: "hidden",
            }}
          >
            {/* Image Carousel */}
            {post.images?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  overflowX: "auto",
                  padding: "10px",
                  backgroundColor: "#f8f8f8",
                }}
              >
                {post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`data:image/jpeg;base64,${img}`}
                    alt={`post-${idx}`}
                    style={{
                      height: "180px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Post Content */}
            <div style={{ padding: "1.25rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <span style={{ fontWeight: "600", fontSize: "16px", color: "#333" }}>
                  {post.appUser.firstname} {post.appUser.lastname}
                </span>
                <br />
                <small style={{ color: "#888" }}>
                  {new Date(post.createdAt).toLocaleString([], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>

              <p style={{ marginBottom: "1rem", fontSize: "15px", color: "#444" }}>
                {post.content}
              </p>

              {post.petId && (
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "0.5rem" }}>
                  🐾 Pet ID: <strong>{post.petId}</strong>
                </p>
              )}

              <p style={{ fontSize: "14px", color: "#666", marginBottom: "1rem" }}>
                📌 Type: <strong>{post.type}</strong>
              </p>

              <button
                onClick={() => handleChatClick(post.appUser.appUserId, post.type)}
                style={{
                  backgroundColor: isLostFound ? "#007bff" : "#28a745",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {isLostFound ? "💬 Message Owner" : "🐶 Adopt"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListLostFoun;
