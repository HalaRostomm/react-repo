import React, { useState } from "react";
import { useParams } from "react-router-dom";
import userservice from "../service/userservice";

// Inject Tinos font
const tinosFontLink = document.createElement("link");
tinosFontLink.href = "https://fonts.googleapis.com/css2?family=Tinos&display=swap";
tinosFontLink.rel = "stylesheet";
document.head.appendChild(tinosFontLink);

const COLORS = {
  BLACK: "#000000",
  PRIMARY: "#14213D",
  ACCENT: "#FCA311",
  LIGHT: "#E5E5E5",
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
        background: COLORS.WHITE,
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Tinos', serif",
        border: `1.5px solid ${COLORS.PRIMARY}`,
      }}
    >
      <h3 style={{ marginBottom: 20, fontWeight: "700", color: COLORS.PRIMARY }}>
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
              backgroundColor: COLORS.LIGHT,
              flexShrink: 0,
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
              border: `1px solid ${COLORS.LIGHT}`,
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "16px",
              outline: "none",
              background: COLORS.LIGHT,
              fontFamily: "'Tinos', serif",
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
              border: `1px solid ${COLORS.LIGHT}`,
              fontSize: "16px",
              backgroundColor: COLORS.LIGHT,
              outline: "none",
              fontFamily: "'Tinos', serif",
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
              background: COLORS.ACCENT,
              color: COLORS.BLACK,
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
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
                  border: `2px solid ${COLORS.LIGHT}`,
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
              background: COLORS.ACCENT,
              color: COLORS.BLACK,
              fontWeight: "700",
              padding: "10px 24px",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
              fontFamily: "'Tinos', serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e4940f")}
            onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.ACCENT)}
          >
            🚀 Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGeneralPost;
