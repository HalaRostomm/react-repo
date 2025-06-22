import React, { useState } from "react";
import axios from "axios";
import { sendVerificationCode } from "../service/emailverification";
import EmailVerification from "./EmailVerification";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    gender: "Male",
    birthDate: "",
    location: "",
    image: "",
  });

  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Color constants
  const colors = {
    primary: '#FFA100',        // Buttons and icons
    cardBg: 'rgba(19, 182, 185, 0.2)',  // Card background
    headerBg: '#13b6b9',       // Header
    text: '#000000',           // Black text
    white: '#FFFFFF',
    error: '#E53E3E',
    border: '#E2E8F0',
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.username.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }
    if (Object.values(formData).some((value) => value === "")) {
      setErrorMessage("All fields are required");
      return false;
    }
    return true;
  };

  const handleSendVerification = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await sendVerificationCode(formData.username);
      setStep(2);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      
      if (response.status === 200) {
        window.location.href = "/login";
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, birthDate: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result.split(",")[1] });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${longitude}, ${latitude}`;
setFormData({
  ...formData,
  location: locationString,
  address: locationString   // also sets it in the visible address input
});
        },
        () => setErrorMessage("Location permission denied.")
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    card: {
      backgroundColor: colors.cardBg,
      backdropFilter: "blur(10px)",
      padding: "30px",
      borderRadius: "16px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "490px",
      textAlign: "center",
      border: `1px solid rgba(255,255,255,0.3)`,
    },
    title: {
      color: colors.text,
      marginBottom: "8px",
      fontWeight: "700",
      fontSize: "24px",
    },
    subtitle: {
      color: colors.text,
      marginBottom: "24px",
      fontWeight: "400",
      fontSize: "14px",
      opacity: 0.8,
    },
    form: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px 16px",
    },
    fullWidth: {
      gridColumn: "span 2",
    },
    input: {
      padding: "12px 16px",
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: colors.white,
    },
    select: {
      padding: "12px 16px",
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: colors.white,
      cursor: "pointer",
    },
    fileInput: {
      padding: "12px 16px",
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      fontSize: "14px",
      outline: "none",
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: colors.white,
    },
    locationButton: {
      backgroundColor: colors.headerBg,
      border: "none",
      color: colors.white,
      padding: "12px 0",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        opacity: 0.9,
      },
    },
    submitButton: {
      backgroundColor: colors.primary,
      border: "none",
      color: colors.text,
      padding: "14px 0",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "15px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        opacity: 0.9,
      },
    },
    error: {
      marginTop: "16px",
      color: colors.error,
      fontWeight: "500",
      fontSize: "14px",
    },
    verificationContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      textAlign: "center",
    },
    verificationTitle: {
      color: colors.text,
      marginBottom: "8px",
      fontWeight: "600",
      fontSize: "18px",
    },
    verificationText: {
      color: colors.text,
      marginBottom: "16px",
      fontSize: "14px",
      opacity: 0.8,
    },
    backButton: {
      backgroundColor: "transparent",
      border: `1px solid ${colors.headerBg}`,
      color: colors.headerBg,
      padding: "12px 0",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
      marginTop: "12px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "rgba(19, 182, 185, 0.1)",
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Your Account</h2>
        <p style={styles.subtitle}>Join our pet care community</p>

        {step === 1 ? (
          <form style={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Email"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleDateChange}
              required
              style={styles.input}
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{ ...styles.select, ...styles.fullWidth }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ ...styles.fileInput, ...styles.fullWidth }}
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              style={{ ...styles.locationButton, ...styles.fullWidth }}
            >
              Get Current Location
            </button>
            <button
              type="button"
              onClick={handleSendVerification}
              style={{ ...styles.submitButton, ...styles.fullWidth }}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <EmailVerification
            email={formData.username}
            onVerificationSuccess={handleVerificationSuccess}
            onBack={() => setStep(1)}
          />
        )}

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Register;