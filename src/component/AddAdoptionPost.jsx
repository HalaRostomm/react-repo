import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import userservice from "../service/userservice";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
const COLORS = {
  BLACK: "#000000",
  PRIMARY: "#13b6b9",
  ACCENT: "#ffa100",
  LIGHT_OPACITY_BG: "#13b6b933",
  WHITE: "#FFFFFF",
};

const AddAdoptionPost = ({ onPostAdded, token }) => {
  const { userId: paramUserId } = useParams();
  const location = useLocation();
  const petId = location.state?.petId;
const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
const [adoptionPostId, setAdoptionPostId] = useState(null);

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(paramUserId);




const handleMarkPetForAdoption = async (petId, postId) => {
  try {
    await userservice.markPetForAdoption(petId, postId);
  } catch (error) {
    console.error("Failed to mark pet for adoption:", error);
    alert(error.response?.data?.message || "❌ Failed to mark pet for adoption.");
  }
};








  useEffect(() => {
    if (!token) {
      setMessage({ text: "No token provided", type: "error" });
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.appUserId) {
        setUserId(decoded.appUserId);
      } else {
        setMessage({ text: "Invalid token structure - missing appUserId", type: "error" });
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      setMessage({ text: "Invalid token", type: "error" });
    }
  }, [token]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

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

  setLoading(true);
  setMessage({ text: "", type: "" });

  try {
    const base64Images = await Promise.all(images.map(convertToBase64));
    const postData = {
      content,
      images: base64Images,
      type: "For Adoption",
      petId,
    };

    const response = await userservice.addForAdoptionPost(userId, postData, token);
    if (response.status === 200) {
     const newPostId = response.data?.id || response.data?.postId || parseInt(response.data) || null;
   
     setAdoptionPostId(newPostId);
     alert(`📢 Post submitted successfully! AdoptionPostId: ${newPostId}`);
     onPostAdded?.();
   
     // ✅ Call markPetForAdoption with petId and postId
    if (petId && newPostId) {
  await handleMarkPetForAdoption(petId, newPostId);
}

   // Reset
   setContent("");
   setImages([]);
   setImagePreviews([]);

     navigate("/user/getpets", { state: { adoptionPostId: newPostId } });
     return newPostId;

       } else {
         alert("❌ Failed to submit post.");
       }
  } catch (err) {
    console.error("Post failed:", err);
    alert("Failed to submit post.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: "24px",
        borderRadius: "16px",
        backgroundColor: COLORS.LIGHT_OPACITY_BG,
        boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
        fontFamily: "'Poppins', sans-serif",
        border: `1.5px solid ${COLORS.PRIMARY}`,
        color: COLORS.BLACK,
      }}
    >
      <h2
        style={{
          marginBottom: "1.5rem",
          backgroundColor: COLORS.PRIMARY,
          color: COLORS.BLACK,
          textAlign: "center",
          fontWeight: "700",
          padding: "0.75rem",
          borderRadius: "12px",
          userSelect: "none",
        }}
      >
        🐾 Put a Pet Up for Adoption
      </h2>

      {message.text && (
        <div
          style={{
            color: message.type === "error" ? "red" : "green",
            marginBottom: "1rem",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
              userSelect: "none",
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
            aria-label="Upload pet photos"
          />
        </div>

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
                  border: `2px solid ${COLORS.LIGHT_OPACITY_BG}`,
                }}
              />
            ))}
          </div>
        )}

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
              border: `1px solid ${COLORS.LIGHT_OPACITY_BG}`,
              fontSize: "16px",
              background: COLORS.LIGHT_OPACITY_BG,
              resize: "vertical",
              outline: "none",
              fontFamily: "'Poppins', sans-serif",
              color: COLORS.BLACK,
            }}
            aria-label="Pet description"
          />
        </div>

        <div style={{ textAlign: "right" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: COLORS.ACCENT,
              color: COLORS.BLACK,
              fontWeight: "700",
              padding: "10px 24px",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
              userSelect: "none",
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#e5940f")}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = COLORS.ACCENT)}
          >
            📢 {loading ? "Posting..." : "Post for Adoption"}
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

export default AddAdoptionPost;
