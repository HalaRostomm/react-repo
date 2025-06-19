import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";

// Font injection (Economica)
const tinosFontLink = document.createElement("link");
tinosFontLink.href = "https://fonts.googleapis.com/css2?family=Tinos&display=swap";
tinosFontLink.rel = "stylesheet";
document.head.appendChild(tinosFontLink);

// Theme Colors
const COLORS = {
  PRIMARY: "#14213D",
  ACCENT: "#FCA311",
  LIGHT: "#E5E5E5",
  BG: "#FFFFFF",
};

const DrDetails = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await authService.getToken();
        const user = authService.decodeToken(token);
        setCurrentUser(user);

        if (!doctorId) {
          setMessage("❌ Doctor ID is not specified.");
          return;
        }

        const res = await userService.getAppointmentsByDoctor(doctorId);
        const today = new Date().toISOString().split("T")[0];
        const futureAppointments = res.data.filter(
          (a) => a.selectedDate >= today
        );

        setAppointments(futureAppointments);
        setMessage(
          futureAppointments.length === 0
            ? "⚠️ No upcoming appointments available."
            : ""
        );
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to fetch appointments.");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const handleBookAppointment = (appointmentId) => {
    if (!currentUser) {
      alert("Please login to book an appointment");
      return;
    }
    navigate(`/confirmbooking/${currentUser.appUserId}/${doctorId}/${appointmentId}`);
  };

  return (
    <div
      className="container mt-5"
      style={{
        maxWidth: 900,
       fontFamily: "'Tinos', serif",
        color: COLORS.PRIMARY,
      }}
    >
      <h2 className="text-center mb-4" style={{ fontWeight: 700 }}>
        📅 Available Doctor Appointments
      </h2>

      {message && (
        <div
          className="alert text-center"
          style={{
            backgroundColor: message.startsWith("❌") ? "#f8d7da" : "#fff3cd",
            color: message.startsWith("❌") ? "#842029" : "#664d03",
            fontWeight: 600,
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: "1.5rem",
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5" style={{ fontSize: "1.2rem", color: COLORS.ACCENT }}>
          🔄 Loading appointments...
        </div>
      ) : appointments.length > 0 ? (
        <table
          className="table"
          style={{
            borderCollapse: "separate",
            borderSpacing: "0 10px",
            fontWeight: 600,
               fontFamily: "'Tinos', serif", // ✅ Consistency here
          }}
        >
          <thead style={{ backgroundColor: COLORS.PRIMARY, color: "#fff" }}>
            <tr>
              <th style={{ borderTopLeftRadius: 10, padding: "12px 15px" }}>#</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Price</th>
              <th style={{ borderTopRightRadius: 10 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr
                key={appt.appointmentId}
                style={{
                  backgroundColor: "#e6f7ff",
                  transition: "background-color 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c0e8ff")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e6f7ff")}
              >
                <td style={{ padding: "12px 15px" }}>{index + 1}</td>
                <td>{appt.selectedDate}</td>
                <td>{appt.startTime}</td>
                <td>{appt.endTime}</td>
                <td>${appt.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn"
                    style={{
                      backgroundColor: COLORS.ACCENT,
                      color: "#fff",
                      fontWeight: "700",
                      borderRadius: 6,
                      padding: "6px 14px",
                      border: "none",
                      fontSize: "1rem",
                    }}
                    onClick={() => handleBookAppointment(appt.appointmentId)}
                  >
                    Book Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default DrDetails;
