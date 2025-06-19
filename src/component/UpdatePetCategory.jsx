import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaEdit, FaKey, FaListAlt, FaTag } from "react-icons/fa";

const UpdatePetCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({
    categoryId: "",
    type: "PET",
    mscategory: {},
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
const predefinedKeys = [
    "Bird", "Cat", "Dog", "Ferret", "Fish", "Guinea Pig", "Hamster",
    "Lizard", "Rabbit", "Rat", "Snake", "Turtle"
  ];
  useEffect(() => {
    adminService.getCategoryById(id)
      .then((response) => {
        if (response.data) {
          setCategory({
            categoryId: response.data.categoryId,
            type: response.data.type || "PET",
            mscategory: response.data.mscategory || {},
          });
        } else {
          setMessage("❌ No category found with the provided ID.");
        }
      })
      .catch(() => setMessage("❌ Failed to load category details."));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedCategory = { ...category };

    if (name === "mscategory_key") {
      const newKey = value;
      const updatedMscategory = { [newKey]: Object.values(updatedCategory.mscategory)[0] || "" };
      updatedCategory.mscategory = updatedMscategory;
    } else if (name === "mscategory_name") {
      const newValue = value;
      const updatedMscategory = { [Object.keys(updatedCategory.mscategory)[0]]: newValue };
      updatedCategory.mscategory = updatedMscategory;
    } else {
      updatedCategory[name] = value;
    }

    setCategory(updatedCategory);
  };
const handleKeyChange = (e) => {
    setCategory({ key: e.target.value, value: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.mscategory || Object.keys(category.mscategory).length === 0) {
      setMessage("❌ Category data is incomplete.");
      return;
    }

    try {
      if (!token) {
        setMessage("❌ You need to be logged in to update the category.");
        return;
      }

      await adminService.updateCategory(id, category, token);
      setMessage("✅ Category updated successfully!");
      setTimeout(() => navigate("/getpetcategories"), 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "❌ Failed to update category.";
      setMessage(errorMessage);
    }
  };

  return (
    <>
      <style>
        {`
          input::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #0f172a inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 9999s ease-in-out 0s;
          }
        `}
      </style>

      <div style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px"
      }}>
        <div style={{
          backgroundColor: "#1e293b",
          padding: "40px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          color: "#fff",
          boxShadow: "0 6px 16px rgba(0,0,0,0.4)"
        }}>
          <h3 style={{ textAlign: "center", color: "#8e6dda", marginBottom: 25 }}>
            <FaEdit style={{ marginRight: 8 }} />
            Update Category
          </h3>

          {message && (
            <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}
              style={{
                backgroundColor: message.startsWith("✅") ? "#c8e6c9" : "#ffcdd2",
                color: message.startsWith("✅") ? "#2e7d32" : "#c62828",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
                marginBottom: "20px"
              }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                       <label className="form-label fw-semibold">
                         <FaListAlt style={{ marginRight: 6 }} />
                         Category Key
                       </label>
                       <select
                         className="form-select"
                         value={category.key}
                         onChange={handleKeyChange}
                         required
                         style={{
                           backgroundColor: "#0f172a",
                           color: "#fff",
                           border: "1px solid #6f42c1",
                           borderRadius: "8px",
                           padding: "10px"
                         }}
                       >
                         <option value="">-- Select Category Key --</option>
                         {predefinedKeys.map((key) => (
                           <option key={key} value={key}>{key}</option>
                         ))}
                       </select>
                     </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">
                <FaTag style={{ marginRight: 6 }} />
                Category Name
              </label>
              <input
                type="text"
                name="mscategory_name"
                className="form-control"
                value={Object.values(category.mscategory)[0] || ""}
                onChange={handleChange}
                placeholder="Enter category name"
                required
                style={{
                  backgroundColor: "#0f172a",
                  color: "white",
                  border: "1px solid #6f42c1",
                  borderRadius: "8px",
                  padding: "10px",
                  caretColor: "white"
                }}
              />
            </div>

    
            <button
              type="submit"
              className="btn w-100 fw-bold"
              style={{
                backgroundColor: "#6f42c1",
                border: "none",
                color: "#fff",
                padding: "10px",
                borderRadius: "8px"
              }}
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePetCategory;
