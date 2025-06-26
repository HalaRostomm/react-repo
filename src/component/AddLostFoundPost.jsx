import React, { useState, useEffect } from "react";
import { useNavigate,  useLocation } from "react-router-dom";
import userservice from "../service/userservice";
import { jwtDecode } from "jwt-decode";

// Load Poppins font dynamically
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const COLORS = {
  PRIMARY: "#13b6b9",
  ACCENT: "#ffa100",
  LIGHT_OPACITY_BG: "#13b6b933",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
};

const AddLostFoundPost = ({ onPostAdded, token }) => {
  const [userId, setUserId] = useState(null);
  const [lostPostId, setLostPostId] = useState(null);
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const petId = location.state?.petId;




const handleMarkAsLost = async (petId, postId) => {
  try {
    await userservice.markAsLost(petId, postId);
  } catch (error) {
    console.error("Failed to mark pet as lost:", error);
    alert(error.response?.data?.message || "❌ Failed to mark pet as lost.");
  }
};











  // Decode token and get userId
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded.appUserId) setUserId(decoded.appUserId);
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }, [token]);

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // Convert file to base64 (without prefix)
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result.split(",")[1]; // remove "data:image/...;base64,"
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please enter a description.");
      return;
    }
    if (!type) {
      alert("Please select a post type.");
      return;
    }

    try {
      setLoading(true);
      const base64Images = await Promise.all(images.map(convertToBase64));
      const postData = {
        content,
        images: base64Images,
        type,
      };

      const response = await userservice.addFoundLostPost(userId, postData, token);

   if (response.status === 200) {
  const newPostId = response.data?.id || response.data?.postId || parseInt(response.data) || null;

  setLostPostId(newPostId);
  alert(`📢 Post submitted successfully! LostPostId: ${newPostId}`);
  onPostAdded?.();

  // ✅ Call markAsLost with petId and postId
if (petId && newPostId) {
  await handleMarkAsLost(petId, newPostId);
}


  // Reset
  setContent("");
  setType("");
  setImages([]);
  setImagePreviews([]);

  navigate("/user/getpets", { state: { lostPostId: newPostId } });
  return newPostId;


      } else {
        alert("❌ Failed to submit post.");
      }
    } catch (err) {
      console.error("Post failed:", err);
      alert("❌ Error submitting post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "2.5rem auto",
        padding: "24px",
        borderRadius: "16px",
        backgroundColor: COLORS.LIGHT_OPACITY_BG,
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
        fontFamily: "'Poppins', sans-serif",
        border: `1.5px solid ${COLORS.PRIMARY}`,
        color: COLORS.BLACK,
      }}
    >
      <h2
        style={{
          marginBottom: "1.8rem",
          color: COLORS.BLACK,
          textAlign: "center",
          backgroundColor: COLORS.PRIMARY,
          padding: "12px",
          borderRadius: "12px",
          userSelect: "none",
        }}
      >
        🐶 Create a Lost or Found Post
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Type Selector */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label htmlFor="postType" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
            Post Type
          </label>
          <select
            id="postType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: `1px solid ${COLORS.LIGHT_OPACITY_BG}`,
              backgroundColor: COLORS.WHITE,
              fontSize: "16px",
              fontFamily: "'Poppins', sans-serif",
              color: COLORS.BLACK,
              cursor: "pointer",
            }}
          >
            <option value="">📌 Select Type</option>
            <option value="Lost-Found-CD">🐾 Lost</option>
            <option value="Found-CD">📍 Found</option>
          </select>
        </div>

        {/* Upload Photos */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            htmlFor="fileInput"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: COLORS.ACCENT,
              color: COLORS.BLACK,
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              userSelect: "none",
            }}
          >
            📷 Upload Images
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Preview Gallery */}
        {imagePreviews.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              overflowX: "auto",
              marginBottom: "1.25rem",
            }}
          >
            {imagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`preview-${idx}`}
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: `1px solid ${COLORS.LIGHT_OPACITY_BG}`,
                }}
              />
            ))}
          </div>
        )}

        {/* Content Area */}
        <div style={{ marginBottom: "1.25rem" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
            placeholder="Describe the pet, where it was lost/found, last seen, any contact info..."
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: `1px solid ${COLORS.LIGHT_OPACITY_BG}`,
              backgroundColor: COLORS.WHITE,
              fontSize: "16px",
              resize: "vertical",
              outline: "none",
              fontFamily: "'Poppins', sans-serif",
              color: COLORS.BLACK,
            }}
          />
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: "right" }}>
          <button
            type="submit"
            style={{
              backgroundColor: COLORS.ACCENT,
              color: COLORS.BLACK,
              fontWeight: "700",
              padding: "10px 24px",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              userSelect: "none",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e4940f")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.ACCENT)}
          >
            📢 Post Now
          </button>
        </div>
        <div style={{ textAlign: "left", marginTop: "1rem" }}>
  <button
    type="button"
    onClick={() => navigate("/user/getpets")}
    style={{
      backgroundColor: "#ccc",
      color: "#000",
      fontWeight: "600",
      padding: "8px 20px",
      border: "none",
      borderRadius: "10px",
      fontSize: "14px",
      cursor: "pointer",
      fontFamily: "'Poppins', sans-serif",
    }}
  >
    🔙 Return Without Posting
  </button>
</div>
      </form>
    </div>
  );
};

export default AddLostFoundPost;
