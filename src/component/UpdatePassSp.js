import React, { useState } from "react";
import SpService from "../service/spservice";

const UpdatePassSp = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match!");
      return;
    }

    try {
      await SpService.updatePassword(oldPassword, newPassword);
      setMessage("✅ Password updated successfully.");
    } catch (error) {
      setMessage(error.response?.data || "❌ Error updating password.");
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          backgroundColor: "#E7ECEF",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "2.5rem",
            borderRadius: "1rem",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#274C77",
              fontWeight: "700",
              marginBottom: "2rem",
              borderBottom: "3px solid #6096BA",
              paddingBottom: "0.5rem",
            }}
          >
            Update Password
          </h2>

          <form onSubmit={handlePasswordUpdate}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="oldPassword"
                style={{ display: "block", fontWeight: "600", color: "#274C77" }}
              >
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "1.5px solid #A3CEF1",
                  fontSize: "1rem",
                  marginTop: "0.3rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="newPassword"
                style={{ display: "block", fontWeight: "600", color: "#274C77" }}
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "1.5px solid #A3CEF1",
                  fontSize: "1rem",
                  marginTop: "0.3rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="confirmPassword"
                style={{ display: "block", fontWeight: "600", color: "#274C77" }}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "1.5px solid #A3CEF1",
                  fontSize: "1rem",
                  marginTop: "0.3rem",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "#6096BA",
                color: "#fff",
                fontWeight: "600",
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                border: "none",
                fontSize: "1rem",
                transition: "background-color 0.3s ease",
                boxShadow: "0 4px 10px rgba(96, 150, 186, 0.5)",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#4e7ea3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#6096BA")}
            >
              Update Password
            </button>

            {message && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  backgroundColor: message.includes("✅") ? "#A3CEF1" : "#f8d7da",
                  color: message.includes("✅") ? "#274C77" : "#721c24",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassSp;
