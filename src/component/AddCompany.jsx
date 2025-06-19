import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";

const AddCompany = () => {
  const [company, setCompany] = useState({
    companyName: "",
    companyAddress: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const createCompany = (e) => {
    e.preventDefault();
    adminService
      .addNewCompany(company)
      .then(() => {
        setMessage("✅ Company added successfully!");
        setMessageType("success");
        setTimeout(() => navigate("/getallcompanies"), 1500);
      })
      .catch((error) => {
        setMessage("❌ Failed to add company. Please try again.");
        setMessageType("error");
        console.error("Error:", error);
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "50px 20px",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#e0e0e0",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
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
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, fontWeight: "700" }}>Add New Company</h2>
          <p style={{ margin: 0, color: "#f3e5f5" }}>Enter company details</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className="text-center fw-semibold"
            style={{
              backgroundColor: messageType === "success" ? "#2e7d32" : "#c62828",
              color: "#fff",
              padding: "10px",
              borderRadius: 0,
            }}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={createCompany} style={{ padding: "30px" }}>
          <div className="mb-4">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-control bg-dark text-white"
              name="companyName"
              value={company.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Company Address</label>
            <input
              type="text"
              className="form-control bg-dark text-white"
              name="companyAddress"
              value={company.companyAddress}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#9c27b0",
              color: "#fff",
              padding: "10px",
              width: "100%",
              fontWeight: "600",
              borderRadius: "8px",
            }}
          >
            Add Company
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;
