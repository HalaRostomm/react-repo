import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";
import { jwtDecode } from "jwt-decode";

const Reschedule = () => {
  const { appointmentId, doctorId } = useParams();
  const navigate = useNavigate();

  const [oldAppointment, setOldAppointment] = useState(null);
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [newAppointmentId, setNewAppointmentId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [appUserId, setAppUserId] = useState("");

  useEffect(() => {
    const fetchAppUserId = async () => {
      try {
        const token = await authService.getToken();
        if (token) {
          const decoded = jwtDecode(token);
          setAppUserId(decoded.appUserId);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    };
    fetchAppUserId();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await authService.getToken();

        const [oldRes, availableRes] = await Promise.all([
          userService.getAppointmentById(appointmentId, token),
          userService.getAppointmentsByDoctor(doctorId, token)
        ]);

        setOldAppointment(oldRes.data);
        setAvailableAppointments(availableRes.data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setMessage("❌ Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [appointmentId, doctorId]);

  const handleCancelAppointment = async () => {
    try {
      const token = await authService.getToken();
      const res = await userService.unbookAppointment(appointmentId, token);
      if (res.status === 200) {
        alert("❌ Appointment cancelled.");
        navigate(`/user/getuserappointments/${appUserId}`);
      } else {
        setMessage("⚠️ Could not cancel appointment.");
      }
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Cancellation failed."));
    }
  };

  const handleReschedule = async () => {
    if (!newAppointmentId) {
      alert("Please select a new slot.");
      return;
    }

    try {
      const token = await authService.getToken();
      const res = await userService.rescheduleAppointment(appointmentId, newAppointmentId, doctorId, token);
      if (res.status === 200) {
        alert("✅ Appointment rescheduled!");
        navigate(`/user/getuserappointments/${appUserId}`);
      } else {
        setMessage("⚠️ Rescheduling failed.");
      }
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Rescheduling failed."));
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Tinos&display=swap"
        rel="stylesheet"
      />
      <div style={styles.container}>
        <h2 style={styles.header}>📅 Reschedule Appointment</h2>
        {loading ? (
          <p style={styles.textCenter}>Loading...</p>
        ) : (
          <>
            {oldAppointment && (
              <div style={styles.appointmentBox}>
                <h4 style={styles.subHeading}>Current Appointment</h4>
                <p><strong>Date:</strong> {oldAppointment.selectedDate}</p>
                <p><strong>Time:</strong> {oldAppointment.startTime} - {oldAppointment.endTime}</p>
              </div>
            )}

            <label style={styles.label}>Select New Appointment:</label>
            <select
              value={newAppointmentId}
              onChange={(e) => setNewAppointmentId(e.target.value)}
              style={styles.select}
            >
              <option value="">-- Choose a slot --</option>
              {availableAppointments.map(appt => (
                <option key={appt.appointmentId} value={appt.appointmentId}>
                  {appt.selectedDate} ({appt.startTime} - {appt.endTime})
                </option>
              ))}
            </select>

            <div style={styles.btnGroup}>
              <button style={styles.confirmBtn} onClick={handleReschedule}>
                ✅ Confirm Reschedule
              </button>
              <button style={styles.cancelBtn} onClick={handleCancelAppointment}>
                ❌ Cancel Appointment
              </button>
            </div>

            {message && (
              <div
                style={{
                  ...styles.message,
                  backgroundColor: message.includes("❌") ? "#ffe6e6" : "#fffbe6",
                  color: message.includes("❌") ? "#b30000" : "#8a6d3b"
                }}
              >
                {message}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Tinos', serif",
    color: "#000000",
  },
  header: {
    textAlign: "center",
    color: "#14213D",
    fontWeight: "bold",
    fontSize: "28px",
    marginBottom: "30px",
  },
  subHeading: {
    color: "#FCA311",
    marginBottom: "10px",
  },
  appointmentBox: {
    backgroundColor: "#E5E5E5",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "25px",
    border: "1px solid #ccc"
  },
  label: {
    display: "block",
    marginBottom: "10px",
    color: "#14213D",
    fontWeight: "bold"
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "25px",
    backgroundColor: "#F9F9F9"
  },
  btnGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px"
  },
  confirmBtn: {
    backgroundColor: "#FCA311",
    border: "none",
    color: "#FFFFFF",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1
  },
  cancelBtn: {
    backgroundColor: "#14213D",
    border: "none",
    color: "#FFFFFF",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1
  },
  message: {
    marginTop: "20px",
    padding: "10px 15px",
    borderRadius: "8px",
    fontWeight: "bold"
  },
  textCenter: {
    textAlign: "center",
    fontSize: "18px",
    color: "#333"
  }
};

export default Reschedule;
