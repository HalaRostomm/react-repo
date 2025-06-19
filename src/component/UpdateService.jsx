import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import spService from "../service/spservice";

const UpdateService = () => {
  const { id } = useParams();
  const [service, setService] = useState({
    serviceId: "",
    name: "",
    description: "",
    price: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    spService
      .getServiceById(id)
      .then((response) => {
        setService(response.data);
      })
      .catch((error) => {
        setMessage("❌ Failed to load service details. Please try again.");
        console.error("Error fetching service details:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    spService
      .updateService(id, service)
      .then(() => {
        setMessage("✅ Service updated successfully!");
        navigate("/");
      })
      .catch((error) => {
        setMessage("❌ Failed to update service. Please try again.");
        console.error("Error updating service:", error);
      });
  };

  const styles = {
    container: {
      backgroundColor: "#E7ECEF",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "30px",
      boxShadow: "0 6px 20px rgba(96, 150, 186, 0.2)",
      width: "100%",
      maxWidth: "500px",
    },
    header: {
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "700",
      color: "#274C77",
      marginBottom: "24px",
    },
    label: {
      fontWeight: "600",
      color: "#274C77",
      marginBottom: "6px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1.5px solid #A3CEF1",
      marginBottom: "18px",
      backgroundColor: "#F4F6F8",
      fontSize: "16px",
      color: "#274C77",
    },
    button: {
      backgroundColor: "#6096BA",
      color: "#fff",
      fontWeight: "700",
      fontSize: "16px",
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      width: "100%",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(96, 150, 186, 0.3)",
    },
    message: {
      textAlign: "center",
      marginBottom: "16px",
      fontWeight: "600",
      color: message.startsWith("✅") ? "#155724" : "#721C24",
      backgroundColor: message.startsWith("✅") ? "#D4EDDA" : "#F8D7DA",
      padding: "10px",
      borderRadius: "6px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>Update Service</h2>
        {message && <div style={styles.message}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Service Name</label>
          <input
            type="text"
            name="name"
            value={service.name}
            onChange={handleInputChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Description</label>
          <input
            type="text"
            name="description"
            value={service.description}
            onChange={handleInputChange}
            style={styles.input}
          />

          <label style={styles.label}>Price</label>
          <input
            type="number"
            name="price"
            value={service.price}
            onChange={handleInputChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Update Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateService;
