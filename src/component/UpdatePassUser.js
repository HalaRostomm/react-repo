import React, { useState } from "react";
import userService from "../service/userservice";
import { FaKey, FaLock, FaUnlock } from "react-icons/fa";

// Load Poppins font dynamically
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

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
      fontFamily: "'Poppins', sans-serif",
    },
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#13b6b933", // #13b6b9 with 20% opacity (33 hex)
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      padding: "2rem",
      color: "#000000", // text black
    },
    header: {
      backgroundColor: "#13b6b9",
      color: "#000000", // black text
      padding: "1rem",
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "1.8rem",
      fontWeight: "bold",
      marginBottom: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
    },
    label: {
      fontWeight: "600",
      color: "#000000", // black text
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
      color: "#000000",  // input text black
      backgroundColor: "#fff",
    },
    button: {
      backgroundColor: "#ffa100",  // orange button
      color: "#000000",            // black text
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
    icon: {
      color: "#ffa100", // orange icons
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <FaKey style={styles.icon} />
          Update Password
        </div>

        <form onSubmit={handlePasswordUpdate}>
          <div className="mb-3">
            <label htmlFor="oldPassword" style={styles.label}>
              <FaUnlock style={styles.icon} /> Old Password
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
              <FaLock style={styles.icon} /> New Password
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
              <FaLock style={styles.icon} /> Confirm New Password
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
              <FaKey style={styles.icon} /> Update Password
            </button>
          </div>
        </form>

        {message && <div style={styles.message}>{message}</div>}
      </div>
    </div>
  );
};

export default UpdatePassUser;
