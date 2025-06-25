import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaTags } from "react-icons/fa";

const AddProductCategory = () => {
  const [category, setCategory] = useState({
    MSCategory: { key: "", value: "" },
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({
      MSCategory: { ...category.MSCategory, [name]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        MSCategory: { [category.MSCategory.key]: category.MSCategory.value },
      };
      await adminService.addNewProductCategory(formattedData);
      setMessage("✅ Category added successfully!");
      setTimeout(() => navigate("/admin/getproductcategories"), 1500);
    } catch (error) {
      setMessage(
        `❌ Failed to add category: ${
          error.response ? error.response.data : error.message
        }`
      );
      console.error("Error:", error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        fontFamily: "'Raleway', sans-serif",
        color: "#000000",
      }}
    >
      <div
        style={{
          backgroundColor: "#D0D5CE",
          padding: "40px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            color: "#000000",
            marginBottom: "25px",
          }}
        >
          <FaTags style={{ marginRight: 8 }} />
          Add Product Category
        </h3>

        {message && (
          <div
            className={`alert ${
              message.startsWith("✅") ? "alert-success" : "alert-danger"
            }`}
            style={{
              backgroundColor: message.startsWith("✅") ? "#c8e6c9" : "#ffcdd2",
              color: message.startsWith("✅") ? "#2e7d32" : "#c62828",
              textAlign: "center",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-semibold mb-2">
            Key & Category Name
          </label>
          <div className="d-flex flex-column flex-md-row gap-3 mb-4">
            <input
              type="text"
              name="key"
              className="form-control"
              placeholder="Key"
              value={category.MSCategory.key}
              onChange={handleChange}
              required
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #000000",
                borderRadius: "8px",
                padding: "10px",
                fontFamily: "'Raleway', sans-serif",
              }}
            />
            <input
              type="text"
              name="value"
              className="form-control"
              placeholder="Category Name"
              value={category.MSCategory.value}
              onChange={handleChange}
              required
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #000000",
                borderRadius: "8px",
                padding: "10px",
                fontFamily: "'Raleway', sans-serif",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold"
            style={{
              backgroundColor: "#000000",
              border: "none",
              color: "#ffffff",
              padding: "10px",
              borderRadius: "8px",
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            Save Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductCategory;
