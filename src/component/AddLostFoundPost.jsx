import React, { useState } from "react";
import { useParams } from "react-router-dom";
import userservice from "../service/userservice";

// Load Poppins font dynamically
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const COLORS = {
  PRIMARY: "#13b6b9",     // header background color
  ACCENT: "#ffa100",      // buttons and icons orange
  LIGHT_OPACITY_BG: "#13b6b933", // card background 20% opacity
  WHITE: "#FFFFFF",
  BLACK: "#000000",
};

const AddLostFoundPost = ({ onPostAdded, token }) => {
  const { userId } = useParams();
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please enter a description.");
      return;
    }

    try {
      const base64Images = await Promise.all(images.map(convertToBase64));
      const postData = {
        content,
        images: base64Images,
        type,
      };

      const response = await userservice.addFoundLostPost(userId, postData, token);
      if (response.status === 200) {
        onPostAdded?.();
        alert("📢 Post submitted successfully!");
        setContent("");
        setImages([]);
        setImagePreviews([]);
        setType("");
      }
    } catch (err) {
      console.error("Post failed:", err);
      alert("❌ Failed to submit post.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "2.5rem auto",
        padding: "24px",
        borderRadius: "16px",
        backgroundColor: COLORS.LIGHT_OPACITY_BG, // 20% opacity background
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
          <label
            htmlFor="postType"
            style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}
          >
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
      </form>
    </div>
  );
};

export default AddLostFoundPost;
