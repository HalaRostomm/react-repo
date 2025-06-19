import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import spService from "../service/spservice";
import authService from "../service/authService";
import {jwtDecode} from "jwt-decode";

const styles = {
  container: {
    backgroundColor: "#E7ECEF",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
    color: "#274C77",
  },
  card: {
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: 16,
    padding: 24,
    maxWidth: 1000,
    margin: "40px auto",
  },
  heading: {
    textAlign: "center",
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#274C77",
    marginBottom: 24,
  },
  alertInfo: {
    backgroundColor: "#A3CEF1",
    color: "#274C77",
    fontWeight: "600",
    padding: "12px 16px",
    borderRadius: 8,
    marginBottom: 16,
  },
  alertError: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    fontWeight: "600",
    padding: "12px 16px",
    borderRadius: 8,
    marginBottom: 16,
  },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: "10px",
  },
  filterGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  filterButton: (active) => ({
    backgroundColor: active ? "#6096BA" : "transparent",
    border: `2px solid #6096BA`,
    color: active ? "white" : "#6096BA",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "600",
    userSelect: "none",
    transition: "background-color 0.3s ease, color 0.3s ease",
  }),
  addButton: {
    backgroundColor: "#274C77",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    border: "none",
    userSelect: "none",
    transition: "background-color 0.3s ease",
    disabled: {
      backgroundColor: "#8B8C89",
      cursor: "not-allowed",
    },
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  },
  thead: {
    backgroundColor: "#274C77",
    color: "#fff",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "600",
    borderBottom: "2px solid #6096BA",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #D6E2F0",
    verticalAlign: "middle",
    color: "#274C77",
  },
  appointmentCard: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  marginBottom: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  flexWrap: "wrap",
  gap: "12px",
},
dateTimeSection: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flex: "1 1 250px",
},
dateIcon: {
  fontSize: "2rem",
},
infoSection: {
  flex: "1 1 200px",
},
actionsSection: {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
},
label: {
  fontWeight: "600",
  color: "#274C77",
  marginRight: "4px",
},

  actionButton: (type) => {
    const base = {
      padding: "6px 12px",
      borderRadius: 6,
      fontWeight: "600",
      cursor: "pointer",
      marginRight: 8,
      border: "none",
      fontSize: "0.9rem",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      transition: "background-color 0.3s ease",
    };
    switch (type) {
      case "info":
        return {
          ...base,
          backgroundColor: "#6096BA",
          color: "#fff",
        };
      case "edit":
        return {
          ...base,
          backgroundColor: "#A3CEF1",
          color: "#274C77",
        };
      case "delete":
        return {
          ...base,
          backgroundColor: "#8B8C89",
          color: "#fff",
        };
      default:
        return base;
    }
  },
};


const AppSp = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [appUserId, setAppUserId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  const { serviceId } = useParams();

  useEffect(() => {
    const fetchAppUserId = async () => {
      try {
        const token = await authService.getToken();
        if (token) {
          const decodedToken = jwtDecode(token);
          if (decodedToken.appUserId) {
            setAppUserId(decodedToken.appUserId);
          } else {
            setMessage("❌ Doctor ID not found.");
          }
        } else {
          setMessage("❌ No token found.");
        }
      } catch (error) {
        setMessage("❌ Failed to fetch doctor ID.");
      }
    };
    fetchAppUserId();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await authService.getToken();
        const response = await spService.getAppointments(serviceId, token);
        setAppointments(response.data);
        setMessage("");
      } catch (error) {
        setMessage("❌ Failed to fetch appointments.");
      }
    };
    if (serviceId) fetchAppointments();
  }, [serviceId]);

  const handleDelete = async (id) => {
    try {
      await spService.deleteAppointment(id);
      setMessage("✅ Appointment deleted successfully!");
      const token = await authService.getToken();
      const response = await spService.getAppointments(serviceId, token);
      setAppointments(response.data);
    } catch (error) {
      setMessage("❌ Failed to delete appointment.");
    }
  };

  const handleUpdate = (appointmentId, appointment) => {
    navigate(`/sp/updateappointment/${appointmentId}`, { state: { appointment } });
  };

  const getFilteredAppointments = () => {
    const today = new Date().toISOString().split("T")[0];
    return appointments
      .filter((a) => new Date(a.selectedDate) >= new Date(today))
      .filter((a) => {
        switch (filter) {
          case "BOOKED":
            return a.booked === true;
          case "AVAILABLE":
            return a.booked === false;
          case "TODAY":
            return a.selectedDate === today;
          default:
            return true;
        }
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Appointments List</h2>

   {message && (
  <div style={message.startsWith("✅") ? styles.alertInfo : styles.alertError}>
    {message}
  </div>
)}

<div style={styles.filterBar}>
  <div style={styles.filterGroup}>
    {["ALL", "BOOKED", "AVAILABLE", "TODAY"].map((f) => (
      <button
        key={f}
        onClick={() => setFilter(f)}
        style={styles.filterButton(filter === f)}
        type="button"
      >
        {f.charAt(0) + f.slice(1).toLowerCase()}
      </button>
    ))}
  </div>

  <button
    type="button"
    onClick={() => navigate(`/sp/addappointment/${serviceId}`)}
    disabled={!appUserId}
    style={{
      ...styles.addButton,
      ...( !appUserId ? styles.addButton.disabled : {}),
    }}
  >
    ➕ Add Appointment
  </button>
</div>

{getFilteredAppointments().length > 0 ? (
  getFilteredAppointments().map((appointment) => (
    <div key={appointment.appointmentId} style={styles.appointmentCard}>
      <div style={styles.dateTimeSection}>
        <div style={styles.dateIcon}>📅</div>
        <div>
          <strong>{new Date(appointment.selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}</strong>
          <p>{appointment.startTime} ⏰ {appointment.endTime}</p>
        </div>
      </div>

      <div style={styles.infoSection}>
        <p><span style={styles.label}>💵 Price:</span> ${appointment.price.toFixed(2)}</p>
        <p>
          <span style={styles.label}>📌 Status:</span>{" "}
          {appointment.booked ? (
            <span style={{ color: "#b91c1c", fontWeight: "bold" }}>Booked</span>
          ) : (
            <span style={{ color: "#15803d", fontWeight: "bold" }}>Available</span>
          )}
        </p>
      </div>

      <div style={styles.actionsSection}>
        {appointment.booked ? (
          <button
            type="button"
            style={styles.actionButton("info")}
            onClick={() => navigate(`/sp/getappointmentbyid/${appointment.appointmentId}`)}
          >
            👁️ View
          </button>
        ) : (
          <>
            <button
              type="button"
              style={styles.actionButton("edit")}
              onClick={() => handleUpdate(appointment.appointmentId)}
            >
              ✏️ Edit
            </button>
            <button
              type="button"
              style={styles.actionButton("delete")}
              onClick={() => handleDelete(appointment.appointmentId)}
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>
    </div>
  ))
) : (
  <p style={{ textAlign: "center", color: "#8B8C89", fontWeight: "600" }}>
    No appointments found.
  </p>
)}

         
      </div>
    </div>
  );
};

export default AppSp;
