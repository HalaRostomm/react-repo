import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import spService from "../service/spservice";
import authService from "../service/authService";
import {jwtDecode }from "jwt-decode";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [appUserId, setAppUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    fetchAppUserId();
  }, []);

  useEffect(() => {
    if (appUserId) {
      fetchServices();
    }
  }, [appUserId]);

  const fetchAppUserId = async () => {
    try {
      const token = await authService.getToken();
      if (!token) throw new Error("Token not found");
      const decodedToken = jwtDecode(token);
      if (!decodedToken.appUserId) throw new Error("User ID not in token");
      setAppUserId(decodedToken.appUserId);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = await authService.getToken();
      const response = await spService.getAllServices(appUserId, token);
      
      setServices(response.data);
    await fetchRatings(response.data);

    } catch (error) {
      setMessage("❌ Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  };
 const fetchRatings = async (services) => {
    try {
      const ratings = {};
      await Promise.all(
        services.map(async (service) => {
          const res = await spService.getserviceOverAllRatings(service.serviceId);
          ratings[service.serviceId] = res.data || 0;
        })
      );
      setAverageRatings(ratings);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };
  const viewAppointments = (serviceId) => {
    navigate(`/sp/getappointments/${serviceId}`);
  };

  const deleteService = async (id) => {
    try {
      await spService.deleteService(id);
      setMessage("✅ Service deleted successfully!");
      fetchServices();
    } catch (error) {
      setMessage("❌ Failed to delete service.");
    }
  };

  const updateService = (id) => {
    navigate(`/sp/updateservice/${id}`);
  };

  const addService = () => {
    navigate("/sp/addservice");
  };
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={"full" + i} color="gold" />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" color="gold" />);
    for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={"empty" + i} color="gold" />);
    return stars;
  };
      

 return (
  <div style={styles.page}>
    <div style={styles.container}>
      <h3 style={styles.title}>My Services</h3>

      <button style={styles.addButton} onClick={addService}>
        + Add Service
      </button>

      {message && (
        <div
          style={{
            ...styles.message,
            ...(message.includes("✅") ? styles.success : {}),
            ...(message.includes("❌") ? styles.error : {}),
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p style={styles.loading}>Loading services...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Average Rating</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((service) => {
                const rating = averageRatings[service.serviceId];
                return (
                  <tr key={service.serviceId} style={styles.tr}>
                    <td style={styles.td}>{service.serviceId}</td>
                    <td style={styles.td}>{service.name}</td>
                    <td style={styles.td}>{service.description}</td>
                    <td style={styles.td}>${service.price}</td>
                    <td style={styles.td}>
                      <strong>Average Rating:</strong>{" "}
                      {rating !== undefined && rating > 0
                        ? renderStars(rating)
                        : "No ratings"}
                    </td>
                    <td style={styles.td}>
                      {service.serviceCategory?.MSCategory ? (
                        Object.entries(service.serviceCategory.MSCategory)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{ ...styles.actionButton, ...styles.info }}
                        onClick={() => viewAppointments(service.serviceId)}
                      >
                        View Appointments
                      </button>
                      <button
                        style={{ ...styles.actionButton, ...styles.warning }}
                        onClick={() => updateService(service.serviceId)}
                      >
                        Update
                      </button>
                      <button
                        style={{ ...styles.actionButton, ...styles.danger }}
                        onClick={() => deleteService(service.serviceId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: "center" }}>
                  No services available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

};
const styles = {
  page: {
    backgroundColor: "#E7ECEF",
    minHeight: "100vh",
    padding: 40,
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
    maxWidth: 1000,
    margin: "0 auto",
    padding: "2rem",
  },
  title: {
    color: "#274C77",
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#6096BA",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    marginBottom: "1.5rem",
    display: "block",
    marginLeft: "auto",
    transition: "background-color 0.3s ease",
  },
  message: {
    padding: "12px 20px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
  },
  success: {
    backgroundColor: "#A3CEF1",
    color: "#274C77",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  loading: {
    color: "#8B8C89",
    fontWeight: "600",
    fontSize: "1.2rem",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#274C77",
    color: "#FFFFFF",
    padding: "12px 15px",
    textAlign: "left",
    fontWeight: "700",
    borderBottom: "2px solid #6096BA",
  },
  tr: {
    borderBottom: "1px solid #ccc",
    transition: "background-color 0.3s ease",
  },
  td: {
    padding: "12px 15px",
    color: "#274C77",
    verticalAlign: "top",
  },
  actionButton: {
    fontWeight: "600",
    padding: "6px 12px",
    marginRight: 8,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s ease",
  },
  info: {
    backgroundColor: "#6096BA",
    color: "#fff",
  },
  warning: {
    backgroundColor: "#A3CEF1",
    color: "#274C77",
  },
  danger: {
    backgroundColor: "#8B8C89",
    color: "#fff",
  },

};

export default ServiceList;
