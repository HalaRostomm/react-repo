import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import AdminService from "../service/adminService";
import { FaUserPlus } from "react-icons/fa";

const AddUser = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const CreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("🔹 Decoded Token:", decoded);
    }

    try {
      await AdminService.addNewUser(user);
      setMessage("✅ User Added Successfully!");
      setUser({ username: "", password: "" });
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage("❌ Failed to Add User! Please try again.");
    }
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
          maxWidth: "500px",
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            color: "#fff",
          }}
        >
          <FaUserPlus size={20} />
          <h3 style={{ margin: 0, fontWeight: "700" }}>Add New User</h3>
        </div>

        {/* Message */}
        {message && (
          <div
            className="text-center fw-semibold"
            style={{
              backgroundColor: message.startsWith("✅") ? "#c8e6c9" : "#f8d7da",
              color: message.startsWith("✅") ? "#256029" : "#842029",
              padding: "12px",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={CreateUser} style={{ padding: "30px" }}>
          <div className="mb-4">
            <input
              type="email"
              name="username"
              className="form-control bg-dark text-white"
              placeholder="Email"
              value={user.username}
              onChange={handleChange}
              required
              style={{ "::placeholder": { color: "white" } }}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              className="form-control bg-dark text-white"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#9c27b0",
              color: "#fff",
              fontWeight: "600",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            Add User
          </button>
        </form>
      </div>

      {/* Autofill + placeholder white fix */}
      <style>{`
        input::placeholder {
          color: white !important;
          opacity: 0.8;
        }

        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #1e293b inset !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>
    </div>
  );
};

export default AddUser;
