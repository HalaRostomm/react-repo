// EmailVerif.jsx
import React, { useState } from 'react';
import { verifyCode } from '../service/emailverification';

const EmailVerification = ({ email, onVerificationSuccess, onBack }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode) {
      setErrorMessage("Please enter verification code");
      return;
    }

    setIsLoading(true);
    try {
      await verifyCode(email, verificationCode);
      onVerificationSuccess();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        "Verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.verificationContainer}>
      <h3 style={styles.verificationTitle}>Verify Your Email</h3>
      <p style={styles.verificationText}>
        We've sent a verification code to {email}
      </p>
      
      <input
        type="text"
        placeholder="Verification Code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        style={styles.input}
      />
      
      <button
        onClick={handleVerify}
        style={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify Email"}
      </button>
      
      <button
        onClick={onBack}
        style={styles.backButton}
      >
        Back to Registration
      </button>

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
};

const styles = {
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
  input: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1.2px solid #A8D5BA",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
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
  error: {
    marginTop: "12px",
    color: "#d93025",
    fontWeight: "600",
    fontSize: "13px",
  },
};

export default EmailVerification;