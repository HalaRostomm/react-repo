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
    <>
      {/* Import Raleway font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          padding: "50px",
          color: "#000000",
          fontFamily: "'Raleway', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            backgroundColor: "#FFFF",
            borderRadius: "12px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#D0D5CE", // pastel gradient
              padding: "20px 30px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#000000", // light color for contrast
            }}
          >
            <FaWrench size={26} />
            <div>
              <h2 style={{ margin: 0, fontWeight: "700" }}>Service Categories</h2>
              <p style={{ margin: 0, fontWeight: "400", opacity: 0.8 }}>
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
                color: messageType === "danger" ? "#721c24" : "#155724",
                backgroundColor: messageType === "danger" ? "#f8d7da" : "#d4edda",
                border: "none",
                fontWeight: "600",
                padding: "12px 0",
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
                  backgroundColor: "#D0D5CE",
                  color: "#000000",
                  fontWeight: "600",
                  padding: "8px 20px",
                  borderRadius: "30px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(142, 154, 146, 0.6)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  fontFamily: "'Raleway', sans-serif",
                }}
                onClick={() => navigate("/admin/addservicecategory")}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#727c73")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#8e9a92")}
              >
                ➕ Add Service Category
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  color: "#000000",
                  borderCollapse: "collapse",
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                <thead>
                  <tr
                    style={{
                      color: "#555a4e",
                      textAlign: "center",
                      borderBottom: "2px solid #9aa398",
                    }}
                  >
                    <th style={{ padding: "12px" }}>ID</th>
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
                          borderTop: "1px solid #bfc9bd",
                          textAlign: "center",
                          transition: "background-color 0.3s",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#c5ccc9")
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
                            className="btn btn-sm me-2"
                            style={{
                              backgroundColor: "#D0D5CE",
                              color: "#000000",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                              marginRight: "8px",
                            }}
                            onClick={() =>
                              navigate(
                                `/admin/updateservicecategory/${category.category_category_id}`
                              )
                            }
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "#5c6c54")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "#7a8b74")
                            }
                          >
                            <FaEdit style={{ marginRight: "6px" }} /> Edit
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "#8B0000",
                              color: "#FFFFFF",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                            }}
                            onClick={() =>
                              deleteCategory(category.category_category_id)
                            }
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "#a84746")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "#d1605f")
                            }
                          >
                            <FaTrashAlt style={{ marginRight: "6px" }} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center text-muted py-3"
                        style={{ color: "#555a4e", padding: "20px 0" }}
                      >
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
    </>
  );
};

export default ServiceCategoryList;
