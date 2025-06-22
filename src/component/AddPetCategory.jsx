import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaPaw, FaListAlt, FaSave } from "react-icons/fa";

const AddPetCategory = () => {
  const [category, setCategory] = useState({ key: "", value: "" });
  const [savedCategories, setSavedCategories] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const predefinedKeys = [
    "Bird", "Cat", "Dog", "Ferret", "Fish", "Guinea Pig", "Hamster",
    "Lizard", "Rabbit", "Rat", "Snake", "Turtle"
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminService.getPetCategories();
        setSavedCategories(response.data.MSCategory || {});
      } catch (error) {
        console.error("Failed to fetch saved categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleKeyChange = (e) => {
    setCategory({ key: e.target.value, value: "" });
  };

  const handleValueChange = (e) => {
    setCategory((prev) => ({ ...prev, value: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = { MSCategory: { [category.key]: category.value } };
      await adminService.addNewPetCategory(formattedData);
      setMessage("✅ Category added successfully!");
      setTimeout(() => navigate("/admin/getpetcategories"), 1500);
    } catch (error) {
      setMessage(`❌ Failed to add category: ${error.response?.data || error.message}`);
      console.error("Error:", error);
    }
  };

  const selectedKeyHasValues = Array.isArray(savedCategories[category.key]);

  return (
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
        boxShadow: "0 6px 18px rgba(0,0,0,0.2)"
      }}>
        <h3 style={{ color: "#000000", textAlign: "center", marginBottom: 20 }}>
          <FaPaw style={{ marginRight: 8 }} />
          Add Pet Category
        </h3>

        {message && (
          <div
            className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}
            style={{
              backgroundColor: message.startsWith("✅") ? "#c8e6c9" : "#ffcdd2",
              color: message.startsWith("✅") ? "#2e7d32" : "#c62828",
              textAlign: "center",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px"
            }}
          >
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
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #000",
                borderRadius: "8px",
                padding: "10px",
                fontFamily: "'Raleway', sans-serif"
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
              <FaListAlt style={{ marginRight: 6 }} />
              Value
            </label>
            {selectedKeyHasValues ? (
              <select
                className="form-select"
                value={category.value}
                onChange={handleValueChange}
                required
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  border: "1px solid #000",
                  borderRadius: "8px",
                  padding: "10px",
                  fontFamily: "'Raleway', sans-serif"
                }}
              >
                <option value="">-- Select Value --</option>
                {savedCategories[category.key].map((val, idx) => (
                  <option key={idx} value={val}>{val}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Enter value"
                value={category.value}
                onChange={handleValueChange}
                required
                className="form-control"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  border: "1px solid #000",
                  borderRadius: "8px",
                  padding: "10px",
                  fontFamily: "'Raleway', sans-serif"
                }}
              />
            )}
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold"
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "10px",
              fontFamily: "'Raleway', sans-serif"
            }}
          >
            <FaSave style={{ marginRight: 6 }} />
            Save Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPetCategory;
