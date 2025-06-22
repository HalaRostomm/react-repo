import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaPlusCircle } from "react-icons/fa";

const AddServiceCategory = () => {
  const [category, setCategory] = useState({ key: "", value: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const predefinedServiceKeys = [
    "Bird", "Cat", "Dog", "Ferret", "Fish",
    "Guinea Pig", "Hamster", "Lizard", "Rabbit",
    "Rat", "Snake", "Turtle"
  ];

  const handleKeyChange = (e) => {
    setCategory({ key: e.target.value, value: "" });
  };

  const handleValueChange = (e) => {
    setCategory((prev) => ({ ...prev, value: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        MSCategory: { [category.key]: category.value },
      };
      await adminService.addNewServiceCategory(formattedData);
      setMessage("✅ Category added successfully!");
      setTimeout(() => navigate("/admin/getservicecategories"), 1500);
    } catch (error) {
      setMessage(`❌ Failed to add category: ${error.response ? error.response.data : error.message}`);
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
            color: rgba(0, 0, 0, 0.5);
          }
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            -webkit-text-fill-color: black !important;
          }
        `}
      </style>

      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          backgroundColor: "#FFFFFF",
          padding: "20px",
        }}
      >
        <div
          className="card shadow border-0"
          style={{
            backgroundColor: "#FFFFFF",
            color: "#000",
            width: "100%",
            maxWidth: "600px",
            borderRadius: "1rem",
          }}
        >
          <div
            className="card-header text-center fw-bold fs-4"
            style={{
              backgroundColor: "#D0D5CE",
              borderBottom: "1px solid #D0D5CE",
              color: "#000000",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
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
                    backgroundColor: "#fff",
                    color: "#000",
                    borderColor: "#D0D5CE",
                    borderRadius: "8px",
                    padding: "10px",
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
                    backgroundColor: "#fff",
                    color: "#000",
                    borderColor: "#D0D5CE",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn fw-bold w-100"
                style={{
                  backgroundColor: "#000000",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                }}
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
