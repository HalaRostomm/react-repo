import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaEdit, FaKey, FaListAlt, FaTag } from "react-icons/fa";

const UpdateServiceCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({
    categoryId: "",
    type: "SERVICE",
    mscategory_key: "",
    mscategory: {},
  });
  const [originalKey, setOriginalKey] = useState("");
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
        if (response.data && response.data.mscategory) {
          const mscategory = response.data.mscategory;
          const key = Object.keys(mscategory)[0];
          const value = mscategory[key];

          setOriginalKey(key);
          setCategory({
            categoryId: response.data.categoryId,
            type: response.data.type || "SERVICE",
            mscategory_key: key,
            mscategory: { [key]: value },
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
      const currentValue = Object.values(updatedCategory.mscategory)[0] || "";
      updatedCategory.mscategory_key = value;
      updatedCategory.mscategory = { [value]: currentValue };
    } else if (name === "mscategory_name") {
      updatedCategory.mscategory[category.mscategory_key] = value;
    }

    setCategory(updatedCategory);
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
      setTimeout(() => navigate("/admin/getservicecategories"), 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "❌ Failed to update category.";
      setMessage(errorMessage);
    }
  };

  return (
    <>
      <style>
        {`
          * {
            font-family: 'Raleway', sans-serif;
          }
          input::placeholder {
            color: rgba(0, 0, 0, 0.6);
          }
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            -webkit-text-fill-color: black !important;
          }
        `}
      </style>

      <div style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px"
      }}>
        <div style={{
          backgroundColor: "#D0D5CE",
          padding: "40px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          color: "#000",
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ textAlign: "center", color: "#000000", marginBottom: 25 }}>
            <FaEdit style={{ marginRight: 8 }} />
            Update Service Category
          </h3>

          {message && (
            <div style={{
              backgroundColor: message.startsWith("✅") ? "#e0f7e9" : "#ffebee",
              color: message.startsWith("✅") ? "#2e7d32" : "#c62828",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "20px",
              fontWeight: "500"
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

              {originalKey && (
                <div className="mb-2" style={{ color: "#555" }}>
                  <small>
                    <FaKey style={{ marginRight: "6px" }} />
                    <strong>Previous Key:</strong> {originalKey}
                  </small>
                </div>
              )}

              <select
                name="mscategory_key"
                className="form-select"
                value={category.mscategory_key}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #ccc",
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
                value={category.mscategory[category.mscategory_key] || ""}
                onChange={handleChange}
                placeholder="Enter category name"
                required
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px"
                }}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold"
              style={{
                backgroundColor: "#000000",
                color: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border: "none"
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

export default UpdateServiceCategory;
