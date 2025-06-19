import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaWrench, FaEdit, FaTrashAlt } from "react-icons/fa";

const ServiceCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await adminService.getServiceCategories();
      setCategories(response.data);
    } catch (error) {
      setMessage("❌ Failed to load service categories.");
      setMessageType("danger");
      console.error(error);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await adminService.deleteCategory(id);
      setCategories((prev) =>
        prev.filter((category) => category.category_category_id !== id)
      );
      setMessage("✅ Category deleted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("❌ Failed to delete category.");
      setMessageType("danger");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "50px",
        color: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: "#1e293b",
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(90deg, #9c27b0, #d63384)",
            padding: "20px 30px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FaWrench size={26} />
          <div>
            <h2 style={{ margin: 0, fontWeight: "700" }}>Service Categories</h2>
            <p style={{ margin: 0, color: "#f3e5f5", fontWeight: "400" }}>
              Manage available service types
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className="alert text-center fw-semibold"
            style={{
              margin: 0,
              borderRadius: 0,
              color: messageType === "danger" ? "#f8d7da" : "#d4edda",
              backgroundColor: messageType === "danger" ? "#721c24" : "#155724",
              border: "none",
            }}
          >
            {message}
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "30px" }}>
          {/* Add Button */}
          <div className="text-end mb-4">
            <button
              className="btn"
              style={{
                backgroundColor: "#9c27b0",
                color: "#fff",
                fontWeight: "600",
                padding: "8px 20px",
                borderRadius: "30px",
                border: "none",
                boxShadow: "0 4px 12px rgba(156, 39, 176, 0.6)",
              }}
              onClick={() => navigate("/admin/addservicecategory")}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#7b1fa2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#9c27b0")}
            >
              ➕ Add Service Category
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", color: "#e0e0e0" }}>
              <thead>
                <tr style={{ color: "#c3baf0", textAlign: "center" }}>
                  <th style={{ padding: "10px" }}>ID</th>
                  <th>Category Name</th>
                  <th>Key</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <tr
                      key={category.category_category_id || index}
                      style={{
                        borderTop: "1px solid #334155",
                        textAlign: "center",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1a2235")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td style={{ padding: "10px" }}>
                        {category.category_category_id || "No ID"}
                      </td>
                      <td>{category.mscategory || "No Name"}</td>
                      <td>{category.mscategory_key || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-sm me-2 text-white"
                          style={{ backgroundColor: "#845ef7", border: "none" }}
                          onClick={() =>
                            navigate(`/admin/updatecategory/${category.category_category_id}`)
                          }
                        >
                          <FaEdit className="me-1" /> Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#e53935",
                            color: "#fff",
                            border: "none",
                          }}
                          onClick={() =>
                            deleteCategory(category.category_category_id)
                          }
                        >
                          <FaTrashAlt className="me-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      No service categories found.
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

export default ServiceCategoryList;
