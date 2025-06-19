import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import userservice from "../service/userservice";

// Inject Tinos font
const tinosFont = document.createElement("link");
tinosFont.href = "https://fonts.googleapis.com/css2?family=Tinos&display=swap";
tinosFont.rel = "stylesheet";
document.head.appendChild(tinosFont);

const COLORS = {
  BLACK: "#000000",
  PRIMARY: "#14213D",
  ACCENT: "#FCA311",
  LIGHT: "#E5E5E5",
  WHITE: "#FFFFFF",
};

const AddAdoptionPost = ({ onPostAdded, token }) => {
  const { userId } = useParams();
  const location = useLocation();
  const petId = location.state?.petId;

  const [content, setContent] = useState("");
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
      alert("Please enter a message.");
      return;
    }

    try {
      const base64Images = await Promise.all(images.map(convertToBase64));
      const postData = {
        content,
        images: base64Images,
        type: "For Adoption CD",
        petId,
      };

      const response = await userservice.addForAdoptionPost(userId, postData, token);
      if (response.status === 200) {
        onPostAdded?.();
        alert("🎉 Adoption post created!");
        setContent("");
        setImages([]);
        setImagePreviews([]);
      }
    } catch (err) {
      console.error("Post failed:", err);
      alert("Failed to submit post.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: "24px",
        borderRadius: "16px",
        backgroundColor: COLORS.WHITE,
        boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
        fontFamily: "'Tinos', serif",
        border: `1.5px solid ${COLORS.PRIMARY}`,
      }}
    >
      <h2
        style={{
          marginBottom: "1.5rem",
          color: COLORS.PRIMARY,
          textAlign: "center",
          fontWeight: "700",
        }}
      >
        🐾 Put a Pet Up for Adoption
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Upload Button */}
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
              fontWeight: "bold",
            }}
          >
            📷 Upload Photos
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

        {/* Preview Images */}
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
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: `2px solid ${COLORS.LIGHT}`,
                }}
              />
            ))}
          </div>
        )}

        {/* Textarea */}
        <div style={{ marginBottom: "1.2rem" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            placeholder="Describe the pet, its temperament, care needs, etc."
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "10px",
              border: `1px solid ${COLORS.LIGHT}`,
              fontSize: "16px",
              background: COLORS.LIGHT,
              resize: "vertical",
              outline: "none",
              fontFamily: "'Tinos', serif",
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
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5940f")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.ACCENT)}
          >
            📢 Post for Adoption
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdoptionPost;
