import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const COLORS = {
  DARK: "#000000",
  PRIMARY: "#13b6b9",  // Changed to card & header color
  ACCENT: "#ffa100",   // Orange buttons/icons
  LIGHT_BG_OPACITY: "33", // 20% opacity in hex
  WHITE: "#FFFFFF",
};

const ConfirmBooking = () => {
  const { userId, doctorId, appointmentId } = useParams();
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [user, setUser] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [resolvedAddress, setResolvedAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await authService.getToken();

        const [petsRes, doctorRes, userRes, appointmentRes] = await Promise.all([
          userService.getAllPets(userId, token),
          userService.getDoctorById(doctorId, token),
          userService.getUserById(userId, token),
          userService.getAppointmentById(appointmentId, token),
        ]);

        if (petsRes.data?.length > 0) {
          setPets(petsRes.data);
          setSelectedPetId(petsRes.data[0].petId);
        } else {
          setMessage("⚠️ No pets found. Please add a pet first.");
        }

        setDoctor(doctorRes.data);
        setUser(userRes.data);
        setAppointment(appointmentRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("❌ Error fetching user, doctor, or appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, doctorId, appointmentId]);

  useEffect(() => {
    if (doctor && doctor.address && doctor.address.includes(",")) {
      const [longitude, latitude] = doctor.address.split(",").map(Number);
      const fetchAddressFromCoordinates = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          setResolvedAddress(data.display_name);
        } catch (error) {
          setResolvedAddress("Address: " + doctor.address);
        }
      };
      fetchAddressFromCoordinates();
    }
  }, [doctor]);

  const handleConfirmBooking = async () => {
    if (!selectedPetId) {
      alert("Please select a pet");
      return;
    }

    try {
      const token = await authService.getToken();
      const response = await userService.confirmBooking(
        userId,
        doctorId,
        selectedPetId,
        appointmentId,
        token
      );

      if (response.status === 200) {
        alert("✅ Booking confirmed successfully!");
        navigate("/user/home");
      } else {
        setMessage("⚠️ Failed to confirm booking.");
      }
    } catch (error) {
      setMessage(
        `❌ Error: ${error.response?.data?.message || "Failed to confirm booking"}`
      );
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: "950px",
        marginTop: "3rem",
        fontFamily: "'Poppins', sans-serif",
        color: COLORS.DARK,
      }}
    >
      <div
        style={{
          backgroundColor: `${COLORS.PRIMARY}${COLORS.LIGHT_BG_OPACITY}`, // 20% opacity card bg
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{
            fontWeight: 700,
            fontSize: "2rem",
            color: COLORS.DARK,
            backgroundColor: COLORS.PRIMARY,
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          ✅ Confirm Your Appointment
        </h2>

        {loading ? (
          <div
            className="text-center"
            style={{ fontWeight: "bold", color: COLORS.ACCENT }}
          >
            🔄 Loading...
          </div>
        ) : (
          <>
            {/* Doctor Section */}
            {doctor && (
              <section
                style={{
                  marginBottom: "2rem",
                  backgroundColor: COLORS.WHITE,
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: `0 2px 8px ${COLORS.PRIMARY}33`,
                }}
              >
                <h4 style={{ color: COLORS.DARK, marginBottom: "1rem" }}>
                  👨‍⚕️ Doctor Information
                </h4>
                <p>
                  <strong>Name:</strong> Dr. {doctor.firstname} {doctor.lastname}
                </p>
                <p>
                  <strong>Specialization:</strong> {doctor.specialization}
                </p>
                <p>
                  <strong>Experience:</strong> {doctor.experienceYears} years
                </p>
                <p>
                  <strong>Address:</strong> {resolvedAddress}
                </p>
                <p>
                  <strong>Phone:</strong> {doctor.phone}
                </p>
                {doctor.image && (
                  <img
                    src={`data:image/jpeg;base64,${doctor.image}`}
                    alt="Doctor"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: `2px solid ${COLORS.ACCENT}`,
                      marginTop: "10px",
                    }}
                  />
                )}
              </section>
            )}

            {/* User Section */}
            {user && (
              <section
                style={{
                  marginBottom: "2rem",
                  backgroundColor: COLORS.WHITE,
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: `0 2px 8px ${COLORS.PRIMARY}33`,
                }}
              >
                <h4 style={{ color: COLORS.DARK, marginBottom: "1rem" }}>
                  🙋 User Information
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

            {/* Appointment Section */}
            {appointment && (
              <section
                style={{
                  marginBottom: "2rem",
                  backgroundColor: COLORS.WHITE,
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: `0 2px 8px ${COLORS.PRIMARY}33`,
                }}
              >
                <h4 style={{ color: COLORS.DARK, marginBottom: "1rem" }}>
                  📅 Appointment Info
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

            {/* Pet Dropdown */}
            <section style={{ marginBottom: "2rem" }}>
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
                  color: COLORS.DARK,
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
                  color: COLORS.DARK,
                  fontWeight: "700",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#cc8500")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.ACCENT)}
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

export default ConfirmBooking;
