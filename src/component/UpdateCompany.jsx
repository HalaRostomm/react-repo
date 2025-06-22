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
    <>
      {/* Load Raleway font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff", // white background
          padding: "50px 20px",
          fontFamily: "'Raleway', sans-serif", // Raleway font
          color: "#000000", // black text
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#D0D5CE", // pastel greenish background
            borderRadius: "12px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(90deg, #333333, #555555)", // dark gradient header
              padding: "20px 30px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2 style={{ margin: 0, fontWeight: "700", color: "#D0D5CE" }}>
              Update Company
            </h2>
            <p style={{ margin: 0, color: "#D0D5CE" }}>Modify name and address</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className="text-center fw-semibold"
              style={{
                backgroundColor: messageType === "success" ? "#a5d6a7" : "#ef9a9a",
                color: messageType === "success" ? "#1b5e20" : "#b71c1c",
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
              <label className="form-label" style={{ color: "#000", fontWeight: "600" }}>
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                className="form-control"
                value={company.companyName}
                onChange={handleInputChange}
                required
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #999",
                  borderRadius: "6px",
                  padding: "8px",
                  fontFamily: "'Raleway', sans-serif",
                }}
              />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: "#000", fontWeight: "600" }}>
                Company Address
              </label>
              <input
                type="text"
                name="companyAddress"
                className="form-control"
                value={company.companyAddress}
                onChange={handleInputChange}
                required
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #999",
                  borderRadius: "6px",
                  padding: "8px",
                  fontFamily: "'Raleway', sans-serif",
                }}
              />
            </div>

            {/* Buttons */}
            <div className="d-grid gap-3">
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#000000",
                  color: "#D0D5CE",
                  padding: "10px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#333333")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#000000")}
              >
                Update Company
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/getallcompanies")}
                className="btn btn-outline-dark"
                style={{
                  borderColor: "#000000",
                  color: "#000000",
                  fontWeight: "500",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#000000";
                  e.target.style.color = "#D0D5CE";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#000000";
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateCompany;
