import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaUserShield } from "react-icons/fa";

const AddAdmin = () => {
  const [admin, setAdmin] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    adminService
      .addNewAdmin(admin)
      .then(() => {
        setMessage("✅ Admin added successfully!");
        setTimeout(() => navigate("/getadmins"), 1500);
      })
      .catch((error) => {
        setMessage("❌ Failed to add admin. Please try again.");
        console.error("Error adding admin:", error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <style>
  {`
    input::placeholder {
      color: rgba(255, 255, 255, 0.8) !important;
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


      <div style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}>
        <div style={{
          backgroundColor: "#1e293b",
          padding: "50px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
          width: "100%",
          maxWidth: "600px",
          minHeight: "500px",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <h3 className="text-center" style={{ color: "#8e6dda", marginBottom: 20 }}>
            <FaUserShield style={{ marginRight: 8 }} />
            Add New Admin
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
            <div className="mb-3">
              <input
                type="email"
                name="username"
                placeholder="Email"
                className="form-control"
                value={admin.username}
                onChange={handleInputChange}
                required
                style={{
                  backgroundColor: "#0f172a",
                  color: "white",
                  border: "1px solid #6f42c1",
                  borderRadius: "8px",
                  padding: "12px",
                  caretColor: "white"
                }}
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control"
                value={admin.password}
                onChange={handleInputChange}
                required
                style={{
                  backgroundColor: "#0f172a",
                  color: "white",
                  border: "1px solid #6f42c1",
                  borderRadius: "8px",
                  padding: "12px",
                  caretColor: "white"
                }}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold"
              disabled={isLoading}
              style={{
                backgroundColor: "#6f42c1",
                border: "none",
                color: "#fff",
                padding: "12px",
                borderRadius: "8px"
              }}
            >
              {isLoading ? "Adding..." : "Add Admin"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAdmin;
