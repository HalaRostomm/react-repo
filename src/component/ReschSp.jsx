import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";
import { jwtDecode } from "jwt-decode";

const ReschSp = () => {
  const { appointmentId, serviceId } = useParams();
  const navigate = useNavigate();

  const [oldAppointment, setOldAppointment] = useState(null);
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [newAppointmentId, setNewAppointmentId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [appUserId, setAppUserId] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchAppUserId = async () => {
      try {
        const token = await authService.getToken();
        setToken(token);
        if (token) {
          const decodedToken = jwtDecode(token);
          if (decodedToken.appUserId) {
            setAppUserId(decodedToken.appUserId);
          }
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
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
          userService.getServiceAppointments(serviceId, token),
        ]);

        setOldAppointment(oldRes.data);
        setAvailableAppointments(availableRes.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setMessage("❌ Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [appointmentId, serviceId]);

  const handleCancelAppointment = async () => {
    if (!appointmentId) return;
    try {
      const token = await authService.getToken();
      const response = await userService.unbookAppointment(appointmentId, token);
      if (response.status === 200) {
        alert("❌ Appointment cancelled successfully.");
        navigate(`/user/getuserappointments/${appUserId}`);
      } else {
        setMessage("⚠️ Could not cancel the appointment.");
      }
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || "Cancellation failed."}`);
    }
  };

  const handleReschedule = async () => {
    if (!newAppointmentId) {
      alert("Please select a new appointment slot.");
      return;
    }
    try {
      const token = await authService.getToken();
      const response = await userService.rescheduleServiceAppointment(
        appointmentId,
        newAppointmentId,
        serviceId,
        token
      );
      if (response.status === 200) {
        alert("✅ Appointment rescheduled successfully!");
        navigate(`/user/getuserappointments/${appUserId}`);
      } else {
        setMessage("⚠️ Could not reschedule the appointment.");
      }
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || "Rescheduling failed."}`);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Tinos&display=swap"
        rel="stylesheet"
      />
      <div style={styles.container}>
        <h2 style={styles.header}>Reschedule Appointment</h2>

        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : (
          <>
            {oldAppointment && (
              <div style={styles.card}>
                <h5 style={styles.subheading}>Current Appointment:</h5>
                <p><strong>Date:</strong> {oldAppointment.selectedDate}</p>
                <p><strong>Time:</strong> {oldAppointment.startTime} - {oldAppointment.endTime}</p>
              </div>
            )}

            <div style={styles.formGroup}>
              <label htmlFor="newAppointmentSelect" style={styles.label}>
                <strong>Select New Appointment:</strong>
              </label>
              <select
                id="newAppointmentSelect"
                style={styles.select}
                value={newAppointmentId}
                onChange={(e) => setNewAppointmentId(e.target.value)}
              >
                <option value="">-- Select an appointment slot --</option>
                {availableAppointments.map((appt) => (
                  <option key={appt.appointmentId} value={appt.appointmentId}>
                    {appt.selectedDate} ({appt.startTime} - {appt.endTime})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.buttonRow}>
              <button style={styles.primaryBtn} onClick={handleReschedule}>
                Confirm Reschedule
              </button>
              <button style={styles.cancelBtn} onClick={handleCancelAppointment}>
                Cancel Appointment
              </button>
            </div>
          </>
        )}

        {message && (
          <div style={styles.messageBox}>
            {message}
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    fontFamily: "'Tinos', serif",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    color: "#000000",
  },
  header: {
    textAlign: "center",
    color: "#14213D",
    marginBottom: "30px",
    fontWeight: "bold",
    fontSize: "26px",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "30px",
  },
  card: {
    backgroundColor: "#E5E5E5",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  subheading: {
    marginBottom: "10px",
    color: "#14213D",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#14213D",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  buttonRow: {
    textAlign: "center",
    marginTop: "20px",
  },
  primaryBtn: {
    backgroundColor: "#FCA311",
    color: "#FFFFFF",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontFamily: "'Tinos', serif",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelBtn: {
    backgroundColor: "#E63946",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontFamily: "'Tinos', serif",
    cursor: "pointer",
  },
  messageBox: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#FFE5E5",
    color: "#B00020",
    borderRadius: "8px",
    fontWeight: "bold",
  },
};

export default ReschSp;
