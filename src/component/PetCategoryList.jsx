import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaPaw, FaEdit, FaTrashAlt } from "react-icons/fa";

const COLORS = {
  BACKGROUND: "#D0D5CE",
  TEXT: "#000000",
  CARD: "#ffffff",
  PRIMARY: "#000000",
  SECONDARY: "#444444",
  BORDER: "#cccccc",
};

const PetCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await adminService.getPetCategories();
      setCategories(response.data);
    } catch (error) {
      setMessage("❌ Failed to load pet categories.");
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
        backgroundColor: COLORS.CARD,
        padding: "50px",
        color: COLORS.BACKGROUND,
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: COLORS.CARD,
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
    color: "#000000",
  }}
>
  <FaPaw size={26} />
  <div>
    <h2 style={{ margin: 0, fontWeight: "700" }}>Pet Categories</h2>
    <p style={{ margin: 0, color: "#444444", fontWeight: "400" }}>
      Manage types of pets available in the system
    </p>
  </div>
</div>

        {/* Alert */}
        {message && (
          <div
            className={`alert text-center fw-semibold`}
            style={{
              margin: "0",
              borderRadius: 0,
              color: messageType === "danger" ? "#721c24" : "#155724",
              backgroundColor: messageType === "danger" ? "#f8d7da" : "#d4edda",
              border: `1px solid ${COLORS.BORDER}`,
              fontFamily: "'Raleway', sans-serif",
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
    background: "#D0D5CE",
    color: "#000000",
    fontWeight: "600",
    padding: "8px 20px",
    borderRadius: "30px",
    border: "none",
    fontFamily: "'Raleway', sans-serif",
    transition: "background 0.3s",
  }}
  onClick={() => navigate("/admin/addpetcategory")}
  onMouseEnter={(e) => (e.target.style.opacity = 0.85)}
  onMouseLeave={(e) => (e.target.style.opacity = 1)}
>
  ➕ Add Pet Category
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
                  categories.map((category, index) => (
                    <tr
                      key={category.category_category_id || index}
                      style={{
                        borderTop: `1px solid ${COLORS.BORDER}`,
                        textAlign: "center",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f0f0")
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
    background: "#D0D5CE",
    color: "#000000",
    border: "none",
    fontFamily: "'Raleway', sans-serif",
  }}
  onClick={() =>
    navigate(`/admin/updatepetcategory/${category.category_category_id}`)
  }
>
  <FaEdit className="me-1" /> Edit
</button>
                       <button
  className="btn btn-sm"
  style={{
    backgroundColor: "#8B0000",
    color: "#D0D5CE",
    border: "none",
    fontFamily: "'Raleway', sans-serif"
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
                    <td colSpan="4" className="text-center py-3 text-muted">
                      No pet categories found.
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

export default PetCategoryList;
