import React, { useState } from "react";
import { useParams } from "react-router-dom";
import userservice from "../service/userservice";

// Inject Poppins font dynamically
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const COLORS = {
  BLACK: "#000000",
  PRIMARY: "#13b6b9",      // header color
  ACCENT: "#ffa100",       // buttons and icons
  LIGHT_OPACITY_BG: "#13b6b933",  // card bg 20% opacity
  WHITE: "#FFFFFF",
};

const AddGeneralPost = ({ onPostAdded, token }) => {
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
      alert("You have to write something.");
      return;
    }

    try {
      const base64Images = await Promise.all(images.map(convertToBase64));
      const postData = {
        content,
        images: base64Images,
        type,
      };

      const response = await userservice.addNewPost(userId, postData, token);
      if (response.status === 200) {
        onPostAdded?.();
        alert("✅ Post submitted successfully!");
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
        maxWidth: 650,
        margin: "2.5rem auto",
        backgroundColor: COLORS.LIGHT_OPACITY_BG, // 20% opacity bg
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Poppins', sans-serif",
        border: `1.5px solid ${COLORS.PRIMARY}`,
        color: COLORS.BLACK,
      }}
    >
      <h3
        style={{
          marginBottom: 20,
          fontWeight: "700",
          color: COLORS.BLACK,
          backgroundColor: COLORS.PRIMARY,
          padding: "0.75rem",
          borderRadius: "12px",
          userSelect: "none",
          textAlign: "center",
        }}
      >
        📝 Create a Post
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Content Area */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: COLORS.WHITE,
              flexShrink: 0,
              border: `1.5px solid ${COLORS.LIGHT_OPACITY_BG}`,
            }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            placeholder="What's on your mind?"
            style={{
              flex: 1,
              border: `1px solid ${COLORS.LIGHT_OPACITY_BG}`,
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "16px",
              outline: "none",
              backgroundColor: COLORS.WHITE,
              fontFamily: "'Poppins', sans-serif",
              color: COLORS.BLACK,
              resize: "vertical",
            }}
          />
        </div>

        {/* Post Type Selector */}
        <div style={{ marginBottom: "1rem" }}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: `1px solid ${COLORS.LIGHT_OPACITY_BG}`,
              fontSize: "16px",
              backgroundColor: COLORS.WHITE,
              outline: "none",
              fontFamily: "'Poppins', sans-serif",
              color: COLORS.BLACK,
              cursor: "pointer",
            }}
          >
            <option value="">📌 Select Post Type</option>
            <option value="Lost-Found-CD">📍 Lost/Found</option>
            <option value="For Adoption CD">🐾 For Adoption</option>
            <option value="General">🗣️ General</option>
          </select>
        </div>

        {/* Upload Button */}
        <div style={{ marginBottom: "1rem" }}>
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
            📸 Upload Images
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

        {/* Previews */}
        {imagePreviews.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              marginBottom: "1rem",
              paddingBottom: "4px",
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
                  border: `2px solid ${COLORS.LIGHT_OPACITY_BG}`,
                }}
              />
            ))}
          </div>
        )}

        {/* Post Button */}
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
            🚀 Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGeneralPost;
