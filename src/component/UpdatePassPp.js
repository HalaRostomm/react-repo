import React, { useState } from "react";
import ProductService from "../service/ppservice";
import { FaLock, FaUnlockAlt, FaCheckDouble } from "react-icons/fa";

const UpdatePassPp = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords do not match!");
      return;
    }

    try {
      await ProductService.updatePassword(oldPassword, newPassword);
      setMessage("✅ Password updated successfully.");
    } catch (error) {
      setMessage(error.response?.data || "❌ Error updating password.");
    }
  };

  return (
    <div
      className="container mt-5"
      style={{
        fontFamily: "'Roboto Slab', serif",
        backgroundColor: "#F7F0E0",
        padding: "40px",
        borderRadius: "20px",
        maxWidth: "600px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="text-center mb-4"
        style={{ backgroundColor: "#7F7B72", color: "#fff", padding: "20px", borderRadius: "16px" }}
      >
        <h2>
          <FaLock style={{ marginRight: "10px" }} />
          Update Password
        </h2>
      </div>

      <form onSubmit={handlePasswordUpdate}>
        <div className="mb-3">
          <label className="form-label text-dark fw-bold">
            <FaUnlockAlt style={{ marginRight: "6px" }} />
            Old Password
          </label>
          <input
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            style={{ backgroundColor: "#F1EADC", border: "1px solid #7F7B72" }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-dark fw-bold">
            <FaLock style={{ marginRight: "6px" }} />
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ backgroundColor: "#F1EADC", border: "1px solid #7F7B72" }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-dark fw-bold">
            <FaCheckDouble style={{ marginRight: "6px" }} />
            Confirm New Password
          </label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ backgroundColor: "#F1EADC", border: "1px solid #7F7B72" }}
          />
        </div>

        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#7F7B72",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px 30px",
              borderRadius: "30px",
              border: "none",
            }}
          >
            Update Password
          </button>
        </div>
      </form>

      {message && (
        <div
          className={`alert mt-4 ${
            message.includes("✅") ? "alert-success" : "alert-danger"
          } text-center`}
          style={{
            fontWeight: "bold",
            backgroundColor: "#E5DED4",
            border: "1px solid #7F7B72",
            color: "#000",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default UpdatePassPp;
