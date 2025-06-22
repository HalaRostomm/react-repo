import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaTags, FaEdit, FaTrashAlt } from "react-icons/fa";

const COLORS = {
  BACKGROUND: "#ffffff",
  CARD: "#D0D5CE",
  TEXT: "#000000",
  BORDER: "#cccccc",
  BUTTON: "#000000",
};

const ProductCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await adminService.getProductCategories();
      setCategories(response.data);
    } catch (error) {
      setMessage("❌ Failed to load product categories.");
      console.error(error);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await adminService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.category_category_id !== id));
      setMessage("✅ Category deleted successfully!");
    } catch (error) {
      setMessage("❌ Failed to delete category.");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: COLORS.BACKGROUND,
        padding: "50px",
        color: COLORS.TEXT,
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: COLORS.BACKGROUND,
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          border: `1px solid ${COLORS.BORDER}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#D0D5CE",
            padding: "20px 30px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: COLORS.TEXT,
          }}
        >
          <FaTags size={24} />
          <div>
            <h2 style={{ margin: 0, fontWeight: "700" }}>Product Categories</h2>
            <p style={{ margin: 0, fontWeight: "400", color: "#000000" }}>
              Manage all product categories
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`alert text-center fw-semibold`}
            style={{
              margin: 0,
              borderRadius: 0,
              color: message.includes("❌") ? "#842029" : "#0f5132",
              backgroundColor: message.includes("❌") ? "#f8d7da" : "#d1e7dd",
              fontFamily: "'Raleway', sans-serif",
              borderTop: `1px solid ${COLORS.BORDER}`,
              padding: "12px",
            }}
          >
            {message}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "30px" }}>
          {/* Add Button */}
          <div className="text-end mb-4">
            <button
              className="btn"
              style={{
                backgroundColor: COLORS.CARD,
                color: COLORS.TEXT,
                fontWeight: "600",
                padding: "8px 20px",
                borderRadius: "30px",
                border: "none",
                fontFamily: "'Raleway', sans-serif",
              }}
              onClick={() => navigate("/admin/addproductcategory")}
            >
              ➕ Add Category
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", color: COLORS.TEXT }}>
              <thead>
                <tr style={{ textAlign: "center", borderBottom: `1px solid ${COLORS.BORDER}` }}>
                  <th style={{ padding: "10px" }}>ID</th>
                  <th>Category Name</th>
                  <th>Key</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr
                      key={category.category_category_id}
                      style={{
                        borderTop: `1px solid ${COLORS.BORDER}`,
                        textAlign: "center",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f5f5f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td style={{ padding: "10px" }}>{category.category_category_id}</td>
                      <td>{category.mscategory || "No Name"}</td>
                      <td>{category.mscategory_key || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-sm me-2"
                          style={{
                            backgroundColor: COLORS.CARD,
                            color: COLORS.TEXT,
                            border: "none",
                            fontFamily: "'Raleway', sans-serif",
                          }}
                          onClick={() =>
                            navigate(`/admin/updateproductcategory/${category.category_category_id}`)
                          }
                        >
                          <FaEdit className="me-1" /> Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#8B0000",
                            color: COLORS.CARD,
                            border: "none",
                            fontFamily: "'Raleway', sans-serif",
                          }}
                          onClick={() => deleteCategory(category.category_category_id)}
                        >
                          <FaTrashAlt className="me-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryList;
