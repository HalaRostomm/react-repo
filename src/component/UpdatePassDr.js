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
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-lg">
        <div
          className="card-header text-white text-center"
          style={{
            backgroundColor: "#FF64B5F6",
            borderRadius: "0.5rem 0.5rem 0 0",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <h2>Update Password</h2>
        </div>
        <div className="card-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <form onSubmit={handlePasswordUpdate}>
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label" style={{ color: "black" }}>
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label" style={{ color: "black" }}>
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label" style={{ color: "black" }}>
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#FF64B5F6",
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
              className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"} mt-3`}
              role="alert"
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
