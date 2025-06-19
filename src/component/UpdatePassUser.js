import React, { useState } from "react";
import userService from "../service/userservice";
import { FaKey, FaLock, FaUnlock } from "react-icons/fa";

const UpdatePassUser = () => {
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
      await userService.updatePassword(oldPassword, newPassword);
      setMessage("✅ Password updated successfully.");
    } catch (error) {
      setMessage(error.response?.data || "❌ Error updating password.");
    }
  };

  const styles = {
    page: {
      backgroundColor: "#E5E5E5",
      minHeight: "100vh",
      padding: "2rem 1rem",
      fontFamily: "'Tinos', serif",
    },
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#FFFFFF",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      padding: "2rem",
    },
    header: {
      backgroundColor: "#14213D",
      color: "#FFFFFF",
      padding: "1rem",
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "1.8rem",
      fontWeight: "bold",
      marginBottom: "2rem",
    },
    label: {
      fontWeight: "bold",
      color: "#14213D",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    input: {
      border: "1px solid #ccc",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      fontSize: "1rem",
      width: "100%",
      marginTop: "0.3rem",
    },
    button: {
      backgroundColor: "#FCA311",
      color: "#FFFFFF",
      padding: "0.7rem 2rem",
      border: "none",
      borderRadius: "30px",
      fontWeight: "bold",
      fontSize: "1rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginTop: "1.5rem",
    },
    message: {
      marginTop: "1.5rem",
      fontWeight: "bold",
      color: message.includes("✅") ? "green" : "red",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <FaKey style={{ marginRight: "8px" }} />
          Update Password
        </div>

        <form onSubmit={handlePasswordUpdate}>
          <div className="mb-3">
            <label htmlFor="oldPassword" style={styles.label}>
              <FaUnlock /> Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="newPassword" style={styles.label}>
              <FaLock /> New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" style={styles.label}>
              <FaLock /> Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div className="text-center">
            <button type="submit" style={styles.button}>
              <FaKey /> Update Password
            </button>
          </div>
        </form>

        {message && <div style={styles.message}>{message}</div>}
      </div>
    </div>
  );
};

export default UpdatePassUser;
