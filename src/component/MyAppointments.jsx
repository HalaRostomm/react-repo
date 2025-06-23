import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";

// Add Poppins font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// FontAwesome for icons
const fontAwesomeLink = document.createElement("link");
fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
fontAwesomeLink.rel = "stylesheet";
document.head.appendChild(fontAwesomeLink);

// Color constants (updated)
const PRIMARY = "#000000";       // Text color black
const ACCENT = "#FFA100";        // Orange for buttons/icons
const CARD_BG = "rgba(19, 182, 185, 0.2)"; // #13B6B9 20% opacity
const HEADER_BG = "#13B6B9";     // Header background

const MyAppointments = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await authService.getToken();
        if (!token) {
          setMessage("No authentication token found.");
          setLoading(false);
          return;
        }
        const response = await userService.getUserAppointments(id, token);
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setMessage("Failed to load appointments.");
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [id]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.selectedDate);
    appointmentDate.setHours(0, 0, 0, 0);
    if (selectedFilter === "Vet") return appointment.type === "Vet" && appointmentDate >= today;
    if (selectedFilter === "Service") return appointment.type === "Service" && appointmentDate >= today;
    if (selectedFilter === "Previous") return appointmentDate < today;
    return appointmentDate >= today;
  });

  const handleAppointmentClick = (appointment) => {
    const path =
      appointment.type === "Vet"
        ? `/user/vetappointmentdetails/${appointment.appointmentId}`
        : `/user/serviceappointmentdetails/${appointment.appointmentId}`;
    navigate(path);
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      maxWidth: 900,
      margin: "2rem auto",
      padding: "1.5rem",
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      boxShadow: `0 0 20px ${PRIMARY}22`,
      color: PRIMARY,
    }}>
      <h2 style={{
        textAlign: "center",
        backgroundColor: HEADER_BG,
        color: "#000000",
        marginBottom: "2rem",
        fontWeight: 700,
        letterSpacing: 1,
        padding: "1rem 0",
        borderRadius: 8,
      }}>
        🗓️ My Appointments
      </h2>

      {loading ? (
        <p style={{ textAlign: "center", fontSize: 18, color: "#555" }}>Loading...</p>
      ) : message ? (
        <div style={{
          backgroundColor: ACCENT + "22",
          border: `1px solid ${ACCENT}`,
          color: ACCENT,
          fontWeight: 600,
          padding: "10px 14px",
          borderRadius: 8,
          textAlign: "center",
        }}>
          {message}
        </div>
      ) : (
        <>
          {/* Filters */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
          }}>
            {["Vet", "Service", "Previous", "all"].map((filter) => {
              const active = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  style={{
                    backgroundColor: active ? ACCENT : "transparent",
                    color: active ? "#000000" : PRIMARY,
                    border: `2px solid ${ACCENT}`,
                    borderRadius: 24,
                    padding: "8px 20px",
                    fontWeight: 700,
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = ACCENT;
                      e.currentTarget.style.color = "#000000";
                      e.currentTarget.style.borderColor = ACCENT;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = PRIMARY;
                      e.currentTarget.style.borderColor = ACCENT;
                    }
                  }}
                >
                  {filter === "all" ? "All" : filter}
                </button>
              );
            })}
          </div>

          {/* Appointment List */}
          {filteredAppointments.length === 0 ? (
            <p style={{
              textAlign: "center",
              color: "#666",
              fontStyle: "italic",
              fontSize: 16,
            }}>
              No {selectedFilter !== "all" ? selectedFilter : ""} appointments found.
            </p>
          ) : (
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              borderTop: `2px solid ${ACCENT}33`,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: `0 2px 8px ${ACCENT}22`,
              backgroundColor: CARD_BG,
            }}>
              {filteredAppointments.map((appointment) => (
                <li
                  key={appointment.appointmentId}
                  onClick={() => handleAppointmentClick(appointment)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 20px",
                    borderBottom: `1px solid ${ACCENT}33`,
                    backgroundColor: "transparent",
                    transition: "background-color 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT + "22")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: "bold", color: PRIMARY }}>
                      {new Date(appointment.selectedDate).toLocaleDateString()}
                    </div>
                    <div style={{ color: "#444", fontSize: 14, marginTop: 4 }}>
                      ⏰ {appointment.startTime} - {appointment.endTime}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <i
                      className={`fas ${appointment.type === "Vet" ? "fa-paw" : "fa-hand-holding-heart"}`}
                      style={{ color: ACCENT, fontSize: 20 }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={ACCENT} viewBox="0 0 16 16">
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-4.147-4.146a.5.5 0 0 1 .708-.708l5 5a.5.5 0 0 1 0 .708l-5 5a.5.5 0 1 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default MyAppointments;
