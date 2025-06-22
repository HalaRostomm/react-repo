import React, { useState } from "react";
import doctorService from "../service/doctorservice";

const UpdatePassDr = () => {
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
      await doctorService.updatePassword(oldPassword, newPassword);
      setMessage("Password updated successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Error updating password.");
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ fontFamily: "'Poppins', sans-serif", color: "black" }}
    >
      <div className="card shadow-lg border-0 rounded-lg">
        <div
          className="card-header text-center"
          style={{
            backgroundColor: "#64B5F6", // corrected hex color
            borderRadius: "0.5rem 0.5rem 0 0",
            color: "white",
            fontWeight: "600",
            fontSize: "1.5rem",
          }}
        >
          Update Password
        </div>
        <div className="card-body">
          <form onSubmit={handlePasswordUpdate}>
            <div className="mb-3">
              <label
                htmlFor="oldPassword"
                className="form-label"
                style={{ color: "black" }}
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
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="newPassword"
                className="form-label"
                style={{ color: "black" }}
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
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="confirmPassword"
                className="form-label"
                style={{ color: "black" }}
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
                style={{ color: "black" }}
              />
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#64B5F6",
                  fontWeight: "bold",
                  padding: "0.5rem 2rem",
                  borderRadius: "20px",
                  color: "white",
                  border: "none",
                }}
              >
                Update Password
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`alert ${
                message.toLowerCase().includes("successfully")
                  ? "alert-success"
                  : "alert-danger"
              } mt-3`}
              role="alert"
              style={{ fontWeight: "600" }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePassDr;
