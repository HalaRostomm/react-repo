import React, { useEffect, useState } from "react";
import DoctorService from "../service/doctorservice";
import { useNavigate } from "react-router-dom";
import authService from "../service/authService";
import { jwtDecode } from "jwt-decode";

const COLORS = {
  bg: "#F3F6FA",
  card: "#FFFFFF",
  button: "#64B5F6",  // primary blue
  text: "#000000",    // black text
  soft: "#4A4A4A",    // dark gray for subtext
  danger: "#D32F2F",
  success: "#4CAF50",
  border: "#CFE8FC"
};

const CheckupAppoi = () => {
  const [appointments, setAppointments] = useState([]);
  const [appUserId, setAppUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      if (!appUserId || !token) return;
      try {
        const response = await DoctorService.getAppointments(appUserId, token);
        const data = Array.isArray(response)
          ? response
          : Array.isArray(response.data)
          ? response.data
          : [];
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [appUserId, token]);

  useEffect(() => {
    document.body.style.backgroundColor = COLORS.bg;
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  const parseTime12to24 = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const passedAppointments = appointments.filter((appt) => {
    if (!appt.booked || !appt.selectedDate || !appt.startTime) return false;
    const now = new Date();
    const apptDate = new Date(appt.selectedDate.replace(" ", "T"));
    const { hours, minutes } = parseTime12to24(appt.startTime);
    apptDate.setHours(hours, minutes, 0, 0);
    return apptDate < now;
  });

 const handleConfirm = async (appointmentId, isAttended) => {
  if (!token) return;
  try {
    if (!isAttended) {
      await DoctorService.updateMissedAppointment(appointmentId, token);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.appointmentId === appointmentId
            ? { ...appt, status: "missed" }
            : appt
        )
      );
    }

    const appointment = appointments.find((appt) => appt.appointmentId === appointmentId);
    const petId = appointment?.pet?.petId;
    if (!petId) return;

    navigate(`/doctor/passedappointmentdetails/${petId}/${appointmentId}`);
  } catch (err) {
    console.error("Update error:", err);
    alert("Failed to update appointment status");
  }
};


  if (loading) {
    return <p style={styles.loading}>Loading appointments...</p>;
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={styles.container}>
        <h2 style={styles.heading}>Passed Appointments</h2>
        {passedAppointments.length === 0 ? (
          <p style={styles.subText}>No passed booked appointments found.</p>
        ) : (
          passedAppointments.map((appt) => (
            <div key={appt.appointmentId} style={styles.card}>
              <h4 style={styles.cardTitle}>📅 {appt.selectedDate}</h4>
              <p style={styles.text}>
                ⏰ <strong>Time:</strong> {appt.startTime} - {appt.endTime}
              </p>

              {appt.status ? (
                <p
                  style={{
                    ...styles.status,
                    color: appt.status === "done" ? COLORS.success : COLORS.danger,
                  }}
                >
                  {appt.status === "done" ? "✅ Attended" : "❌ Missed"}
                </p>
              ) : (
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.noButton}
                    onClick={() => handleConfirm(appt.appointmentId, false)}
                  >
                    Mark Missed
                  </button>
                  <button
                    style={styles.yesButton}
                   onClick={() => handleConfirm(appt.appointmentId, true)}

                  >
                    Mark Attended
                  </button>
                </div>
              )}

              <button
                style={styles.viewDetailsButton}
                onClick={() =>
                  navigate(`/doctor/getappointmentbyid/${appt.appointmentId}`)
                }
              >
                View Full Details
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: 24,
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    maxWidth: "900px",
    margin: "auto",
    minHeight: "100vh",
  },
  heading: {
    color: COLORS.button,
    fontSize: "2rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontWeight: "600",
  },
  subText: {
    fontSize: "1rem",
    color: COLORS.soft,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: "600",
  },
  text: {
    color: COLORS.text,
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: 10,
    marginBottom: 10,
  },
  yesButton: {
    backgroundColor: COLORS.success,
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
  },
  noButton: {
    backgroundColor: COLORS.danger,
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
  },
  viewDetailsButton: {
    marginTop: 10,
    backgroundColor: COLORS.button,
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  status: {
    fontWeight: "600",
    fontSize: "1rem",
    marginTop: 10,
  },
  loading: {
    fontFamily: "'Poppins', sans-serif",
    padding: 24,
    textAlign: "center",
    color: COLORS.text,
  },
};

export default CheckupAppoi;
// import React, { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";                     