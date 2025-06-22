import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaEdit, FaListAlt, FaTag } from "react-icons/fa";

const UpdateProductCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({
    category_category_id: "",
    mscategory_key: "",
    mscategory: {},
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    adminService.getCategoryById(id)
      .then((response) => {
        if (response.data && response.data.mscategory) {
          const mscategory = response.data.mscategory;
          const key = Object.keys(mscategory)[0];
          const value = mscategory[key];

          setCategory({
            category_category_id: response.data.category_category_id,
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

      await adminService.updateCategory(id, {
        category_category_id: category.category_category_id,
        mscategory_key: category.mscategory_key,
        mscategory: category.mscategory,
      }, token);

      setMessage("✅ Category updated successfully!");
      setTimeout(() => navigate("/admin/getproductcategories"), 1500);
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
            color: rgba(0, 0, 0, 0.6);
          }
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
            -webkit-text-fill-color: #000000 !important;
            transition: background-color 9999s ease-in-out 0s;
          }
        `}
      </style>

      <div style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        fontFamily: "'Raleway', sans-serif"
      }}>
        <div style={{
          backgroundColor: "#D0D5CE",
          padding: "40px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          color: "#000000",
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)"
        }}>
          <h3 style={{ textAlign: "center", color: "#000000", marginBottom: 25 }}>
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
              <input
                type="text"
                name="mscategory_key"
                className="form-control"
                value={category.mscategory_key}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  border: "1px solid #000000",
                  borderRadius: "8px",
                  padding: "10px",
                  caretColor: "black"
                }}
              />
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
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  border: "1px solid #000000",
                  borderRadius: "8px",
                  padding: "10px",
                  caretColor: "black"
                }}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold"
              style={{
                backgroundColor: "#000000",
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

export default UpdateProductCategory;