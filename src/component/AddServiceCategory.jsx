import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaPlusCircle } from "react-icons/fa";

const AddServiceCategory = () => {
  const [category, setCategory] = useState({
    key: "",
    value: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const predefinedServiceKeys = [
    "Bird", "Cat", "Dog", "Ferret", "Fish",
    "Guinea Pig", "Hamster", "Lizard", "Rabbit",
    "Rat", "Snake", "Turtle"
  ];

  const handleKeyChange = (e) => {
    setCategory({
      key: e.target.value,
      value: "",
    });
  };

  const handleValueChange = (e) => {
    setCategory((prev) => ({
      ...prev,
      value: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        MSCategory: { [category.key]: category.value },
      };
      await adminService.addNewServiceCategory(formattedData);
      setMessage("✅ Category added successfully!");
      setTimeout(() => navigate("/getservicecategories"), 1500);
    } catch (error) {
      setMessage(`❌ Failed to add category: ${error.response ? error.response.data : error.message}`);
      console.error("Error:", error);
    }
  };

  return (
    <>
      <style>
        {`
          input::placeholder, select:required:invalid {
            color: rgba(255, 255, 255, 0.7);
          }

          input:-webkit-autofill,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0px 1000px #0f172a inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 9999s ease-in-out 0s;
          }
        `}
      </style>

      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          backgroundColor: "#0f172a",
          padding: "20px",
        }}
      >
        <div
          className="card shadow-lg border-0"
          style={{
            backgroundColor: "#1e293b",
            color: "white",
            width: "100%",
            maxWidth: "600px",
            borderRadius: "1rem",
          }}
        >
          <div
            className="card-header text-center fw-bold fs-4"
            style={{
              backgroundColor: "#6f42c1",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
              color: "white",
            }}
          >
            <FaPlusCircle style={{ marginRight: "8px" }} />
            Add Service Category
          </div>

          <div className="card-body">
            {message && (
              <div
                className={`alert ${
                  message.startsWith("✅") ? "alert-success" : "alert-danger"
                } text-center`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Service Key</label>
                <select
                  className="form-select"
                  value={category.key}
                  onChange={handleKeyChange}
                  required
                  style={{
                    backgroundColor: "#0f172a",
                    color: "white",
                    borderColor: "#6f42c1",
                  }}
                >
                  <option value="">-- Select Service Key --</option>
                  {predefinedServiceKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Service Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Category Name"
                  value={category.value}
                  onChange={handleValueChange}
                  required
                  style={{
                    backgroundColor: "#0f172a",
                    color: "white",
                    borderColor: "#6f42c1",
                    caretColor: "white",
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn fw-bold w-100"
                style={{
                  backgroundColor: "#6f42c1",
                  borderColor: "#6f42c1",
                  color: "white",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5a32a3")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6f42c1")}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddServiceCategory;
