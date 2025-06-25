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
        setTimeout(() => navigate("/admin/getallcompanies"), 1500);
      })
      .catch((error) => {
        setMessage("❌ Failed to add company. Please try again.");
        setMessageType("error");
        console.error("Error:", error);
      });
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          padding: "50px 20px",
          fontFamily: "'Raleway', sans-serif",
          color: "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "18px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            color: "#D0D5CE", // muted greenish text color
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#D0D5CE",  // muted greenish background
              padding: "20px 30px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              textAlign: "center",
              color: "#000000",
            }}
          >
            <h2 style={{ margin: 0, fontWeight: "700" }}>Add New Company</h2>
            <p style={{ margin: 0, color: "#000000" }}>Enter company details</p>
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
              <label
                className="form-label"
                style={{ color: "#000", fontWeight: "600" }}
              >
                Company Name
              </label>
              <input
                type="text"
                className="form-control"
                name="companyName"
                value={company.companyName}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "100%",
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: "500",
                }}
              />
            </div>

            <div className="mb-4">
              <label
                className="form-label"
                style={{ color: "#000", fontWeight: "600" }}
              >
                Company Address
              </label>
              <input
                type="text"
                className="form-control"
                name="companyAddress"
                value={company.companyAddress}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "100%",
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: "500",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#000000",
                color: "#fff",
                padding: "10px",
                width: "100%",
                fontWeight: "600",
                borderRadius: "8px",
                fontFamily: "'Raleway', sans-serif",
                fontSize: "1rem",
                cursor: "pointer",
                border: "none",
              }}
            >
              Add Company
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCompany;
