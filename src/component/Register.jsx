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

 const [step, setStep] = useState(1); // 1: registration form, 2: verification
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          location: locationString
        });
      },
      () => setErrorMessage("Location permission denied.")
    );
  } else {
    setErrorMessage("Geolocation is not supported by this browser.");
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => value === "")) {
      setErrorMessage("All fields are required.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        window.location.href = "/login";
      }
    } catch (error) {
      setErrorMessage("Registration failed.");
    }
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
            style={styles.input}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={styles.fileInput}
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            style={styles.locationButton}
          >
            Get Current Location
          </button>
          <button
            type="button"
            onClick={handleSendVerification}
            style={styles.submitButton}
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

const styles = {
  container: {
    background:
      "linear-gradient(135deg, #A8E6CF 0%, #DCEDC2 50%, #FFD3B6 100%)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "15px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "25px 25px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.12)",
    width: "320px", // smaller width for compactness
    textAlign: "center",
  },
  title: {
    color: "#344E41",
    marginBottom: "4px",
    fontWeight: "700",
    fontSize: "22px",
  },
  subtitle: {
    color: "#6B8E23",
    marginBottom: "18px",
    fontWeight: "500",
    fontSize: "13px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px", // less gap
  },
  input: {
    padding: "8px 12px", // smaller padding
    borderRadius: "8px",
    border: "1.2px solid #A8D5BA",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  fileInput: {
    padding: "4px 12px",
    borderRadius: "8px",
    border: "1.2px solid #A8D5BA",
    fontSize: "14px",
    outline: "none",
  },
  locationButton: {
    marginTop: "4px",
    backgroundColor: "#6B8E23",
    border: "none",
    color: "#fff",
    padding: "10px 0",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(107,142,35,0.5)",
  },
  submitButton: {
    marginTop: "10px",
    backgroundColor: "#FF8C42",
    border: "none",
    color: "#fff",
    padding: "12px 0",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(255,140,66,0.5)",
  },
  error: {
    marginTop: "12px",
    color: "#d93025",
    fontWeight: "600",
    fontSize: "13px",
  },
verificationContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    textAlign: "center",
  },
  verificationTitle: {
    color: "#344E41",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "18px",
  },
  verificationText: {
    color: "#6B8E23",
    marginBottom: "15px",
    fontSize: "14px",
  },
  backButton: {
    backgroundColor: "transparent",
    border: "1px solid #6B8E23",
    color: "#6B8E23",
    padding: "10px 0",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Register;

