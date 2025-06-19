import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminService from "../service/adminService";

const UpdateCompany = () => {
  const { id } = useParams();
  const [company, setCompany] = useState({
    companyName: "",
    companyAddress: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    adminService
      .getCompanyById(id)
      .then((response) => {
        setCompany(response.data);
      })
      .catch(() => {
        setMessage("❌ Failed to load company details.");
        setMessageType("error");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    adminService
      .updateCompany(id, company)
      .then(() => {
        setMessage("✅ Company updated successfully!");
        setMessageType("success");
        setTimeout(() => navigate("/admin/getallcompanies"), 1500);
      })
      .catch(() => {
        setMessage("❌ Failed to update company.");
        setMessageType("error");
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
          <h2 style={{ margin: 0, fontWeight: "700" }}>Update Company</h2>
          <p style={{ margin: 0, color: "#f3e5f5" }}>Modify name and address</p>
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
        <form onSubmit={handleSubmit} style={{ padding: "30px" }}>
          <div className="mb-4">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              className="form-control bg-dark text-white"
              value={company.companyName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Company Address</label>
            <input
              type="text"
              name="companyAddress"
              className="form-control bg-dark text-white"
              value={company.companyAddress}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Buttons */}
          <div className="d-grid gap-3">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#9c27b0",
                color: "#fff",
                padding: "10px",
                fontWeight: "600",
                borderRadius: "8px",
              }}
            >
              Update Company
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/getallcompanies")}
              className="btn btn-outline-light"
              style={{
                borderColor: "#9c27b0",
                color: "#9c27b0",
                fontWeight: "500",
                borderRadius: "8px",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCompany;
