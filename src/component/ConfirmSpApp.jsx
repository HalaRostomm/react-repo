import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const COLORS = {
  BLACK: "#000000",
  PRIMARY: "#13b6b9",   // changed from #14213D to #13b6b9 for header & card bg base
  ACCENT: "#ffa100",    // orange for buttons and icons
  LIGHT: "rgba(19, 182, 185, 0.2)", // card background with 20% opacity
  WHITE: "#FFFFFF",
};

const ConfirmSpApp = () => {
  const { userId, serviceId, appointmentId } = useParams();
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [service, setService] = useState(null);
  const [user, setUser] = useState(null);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await authService.getToken();

        const [petsRes, serviceRes, userRes, appointmentRes] = await Promise.all([
          userService.getAllPets(userId, token),
          userService.getServiceById(serviceId, token),
          userService.getUserById(userId, token),
          userService.getAppointmentById(appointmentId, token),
        ]);

        if (petsRes.data?.length > 0) {
          setPets(petsRes.data);
          setSelectedPetId(petsRes.data[0].petId);
        } else {
          setMessage("⚠️ No pets found. Please add a pet first.");
        }

        setService(serviceRes.data);
        setUser(userRes.data);
        setAppointment(appointmentRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("❌ Error fetching user, service, or appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, serviceId, appointmentId]);

  const handleConfirmBooking = async () => {
    if (!selectedPetId) {
      alert("Please select a pet");
      return;
    }

    try {
      const token = await authService.getToken();
      const response = await userService.confirmServiceBooking(
        userId,
        serviceId,
        selectedPetId,
        appointmentId,
        token
      );

      if (response.status === 200) {
        alert("✅ Booking confirmed successfully!");
        navigate(`/user/home`);
      } else {
        setMessage("⚠️ Failed to confirm booking.");
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.message || "Failed to confirm booking"}`);
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: "950px",
        marginTop: "3rem",
        fontFamily: "'Poppins', sans-serif",
        color: COLORS.BLACK,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.LIGHT,
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          border: `2px solid ${COLORS.ACCENT}`,
        }}
      >
        <h2
          className="text-center mb-4"
          style={{
            fontWeight: 700,
            fontSize: "2rem",
            color: COLORS.PRIMARY,
            borderBottom: `2px solid ${COLORS.LIGHT}`,
            paddingBottom: "1rem",
          }}
        >
          {/* Icon with ACCENT color */}
          <span style={{ color: COLORS.ACCENT, marginRight: "8px" }}>📝</span>
          Confirm Your Service Booking
        </h2>

        {loading ? (
          <div
            className="text-center"
            style={{ fontWeight: "bold", color: COLORS.PRIMARY }}
          >
            <span style={{ color: COLORS.ACCENT, marginRight: "6px" }}>🔄</span> Loading...
          </div>
        ) : (
          <>
            {/* User Info */}
            {user && (
              <section
                style={{
                  marginBottom: "2rem",
                  borderBottom: `1px solid ${COLORS.LIGHT}`,
                  paddingBottom: "1rem",
                  color: COLORS.BLACK,
                }}
              >
                <h4 style={{ color: COLORS.PRIMARY }}>
                  <span style={{ color: COLORS.ACCENT, marginRight: "6px" }}>🙋</span>
                  User Information
                </h4>
                <p>
                  <strong>Name:</strong> {user.firstname} {user.lastname}
                </p>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
                {user.image && (
                  <img
                    src={`data:image/jpeg;base64,${user.image}`}
                    alt="User"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: `2px solid ${COLORS.PRIMARY}`,
                      marginTop: "10px",
                    }}
                  />
                )}
              </section>
            )}

            {/* Appointment Info */}
            {appointment && (
              <section
                style={{
                  marginBottom: "2rem",
                  borderBottom: `1px solid ${COLORS.LIGHT}`,
                  paddingBottom: "1rem",
                  color: COLORS.BLACK,
                }}
              >
                <h4 style={{ color: COLORS.PRIMARY }}>
                  <span style={{ color: COLORS.ACCENT, marginRight: "6px" }}>📅</span>
                  Appointment Details
                </h4>
                <p>
                  <strong>Date:</strong> {appointment.selectedDate}
                </p>
                <p>
                  <strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
                </p>
                <p>
                  <strong>Price:</strong> ${appointment.price}
                </p>
              </section>
            )}

            {/* Service Info */}
            {service && (
              <section
                style={{
                  marginBottom: "2rem",
                  borderBottom: `1px solid ${COLORS.LIGHT}`,
                  paddingBottom: "1rem",
                  color: COLORS.BLACK,
                }}
              >
                <h4 style={{ color: COLORS.PRIMARY }}>
                  <span style={{ color: COLORS.ACCENT, marginRight: "6px" }}>🔧</span>
                  Service Information
                </h4>
                <p>
                  <strong>Service Name:</strong> {service.name}
                </p>
                <p>
                  <strong>Description:</strong> {service.description}
                </p>
                <p>
                  <strong>Category:</strong> {service.category}
                </p>
              </section>
            )}

            {/* Pet Selection */}
            <section style={{ marginBottom: "2rem", color: COLORS.BLACK }}>
              <label htmlFor="petSelect">
                <strong>Select Your Pet:</strong>
              </label>
              <select
                id="petSelect"
                className="form-control"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: `1px solid ${COLORS.PRIMARY}`,
                  fontFamily: "'Poppins', sans-serif",
                  color: COLORS.BLACK,
                }}
              >
                {pets.map((pet) => (
                  <option key={pet.petId} value={pet.petId}>
                    {pet.petName}
                  </option>
                ))}
              </select>
            </section>

            {/* Confirm Button */}
            <div className="text-center">
              <button
                className="btn"
                onClick={handleConfirmBooking}
                style={{
                  backgroundColor: COLORS.ACCENT,
                  color: COLORS.BLACK,
                  fontWeight: "700",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontSize: "1rem",
                  border: "none",
                  transition: "background-color 0.3s ease",
                  userSelect: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#cc8300")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = COLORS.ACCENT)
                }
              >
                ✅ Confirm Booking
              </button>
            </div>
          </>
        )}

        {message && (
          <div
            className="alert mt-4 text-center"
            style={{
              backgroundColor: "#fff3cd",
              color: "#664d03",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 16px",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmSpApp;
