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
      setTimeout(() => navigate("/getproductcategories"), 1500);
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
    <>
    <style>
  {`
    input::placeholder {
      color: white !important;
      opacity: 1 !important;
    }

    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #0f172a inset !important;
      -webkit-text-fill-color: white !important;
    }
  `}
</style>

      <style>
        {`
          input::placeholder {
            color: rgba(255, 255, 255, 0.75);
          }
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #0f172a inset !important;
            -webkit-text-fill-color: white !important;
          }
        `}
      </style>

      <div
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "40px",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "600px",
            color: "#fff",
            boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              color: "#8e6dda",
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
                  backgroundColor: "#0f172a",
                  color: "white",
                  border: "1px solid #6f42c1",
                  borderRadius: "8px",
                  padding: "10px",
                  caretColor: "white",
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
                  backgroundColor: "#0f172a",
                  color: "white",
                  border: "1px solid #6f42c1",
                  borderRadius: "8px",
                  padding: "10px",
                  caretColor: "white",
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
                borderRadius: "8px",
              }}
            >
              Save Category
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductCategory;
