import React, { useState, useEffect } from "react";
import userService from "../service/userservice";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import authService from "../service/authService";
import {jwtDecode} from "jwt-decode";

// Inject Poppins font
const poppinsFontLink = document.createElement("link");
poppinsFontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
poppinsFontLink.rel = "stylesheet";
document.head.appendChild(poppinsFontLink);

// Color theme updates
const COLORS = {
  PRIMARY: "#13B6B9",    // header and card background base color
  ACCENT: "#FFA100",     // buttons and star icons
  BACKGROUND_OPACITY: "33", // opacity hex for 20% opacity (approx 33 hex)
  TEXT: "#000000",       // black text
  BORDER: "#E5E5E5",
};

const SpeciDr = () => {
  const { specialization } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [averageRatings, setAverageRatings] = useState({});
  const [resolvedAddresses, setResolvedAddresses] = useState({});
  const [appUserId, setAppUserId] = useState(null);

  useEffect(() => {
    fetchAppUserId();
  }, []);

  const fetchAppUserId = async () => {
    try {
      const token = await authService.getToken();
      const decodedToken = jwtDecode(token);
      setAppUserId(decodedToken.appUserId);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchDoctorsAndRatings = async () => {
      try {
        const response = await userService.getDoctorsBySpecialization(specialization);
        setDoctors(response.data);
        await fetchRatings(response.data);
        setMessage("");
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setMessage("❌ Failed to fetch doctors.");
      }
    };

    if (specialization) {
      fetchDoctorsAndRatings();
    }
  }, [specialization]);

  const fetchRatings = async (doctors) => {
    try {
      const ratings = {};
      await Promise.all(
        doctors.map(async (doc) => {
          const res = await userService.doctorOverallRatings(doc.appUserId);
          ratings[doc.appUserId] = res.data || 0;
        })
      );
      setAverageRatings(ratings);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  useEffect(() => {
    if (!doctors.length) return;
    doctors.forEach((doctor) => {
      if (doctor.address && doctor.address.includes(",")) {
        const [lon, lat] = doctor.address.split(",").map(Number);
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          .then((res) => res.json())
          .then((data) =>
            setResolvedAddresses((prev) => ({
              ...prev,
              [doctor.appUserId]: data.display_name,
            }))
          )
          .catch(() =>
            setResolvedAddresses((prev) => ({
              ...prev,
              [doctor.appUserId]: doctor.address,
            }))
          );
      } else {
        setResolvedAddresses((prev) => ({
          ...prev,
          [doctor.appUserId]: doctor.address || "No address available",
        }));
      }
    });
  }, [doctors]);

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    for (let i = 0; i < full; i++)
      stars.push(<FaStar key={`f-${i}`} color={COLORS.ACCENT} />);
    if (half) stars.push(<FaStarHalfAlt key="h" color={COLORS.ACCENT} />);
    for (let i = 0; i < 5 - full - (half ? 1 : 0); i++)
      stars.push(<FaRegStar key={`e-${i}`} color={COLORS.BORDER} />);
    return stars;
  };

  const handleViewDetails = (id) => navigate(`/user/getappointments/${id}`);
  const handleViewReviews = (id) => navigate(`/user/getdoctorreviews/${id}`);
  const handleMessageDoctor = (id) => navigate(`/chat/${id}/${appUserId}/null`);

  return (
    <div
      className="container"
      style={{
        fontFamily: "'Poppins', sans-serif",
        padding: "2rem",
        maxWidth: 1200,
        margin: "auto",
        color: COLORS.TEXT,
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: COLORS.PRIMARY,
          fontWeight: "bold",
        }}
      >
        Doctors Specialized in {specialization}
      </h2>

      {message && (
        <div style={{ textAlign: "center", color: COLORS.ACCENT, fontWeight: "600" }}>
          {message}
        </div>
      )}

      {doctors.length === 0 ? (
        <div style={{ textAlign: "center", color: COLORS.TEXT }}>No doctors found.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "1.8rem",
          }}
        >
          {doctors.map((doctor) => {
            const rating = averageRatings[doctor.appUserId] || 0;
            return (
              <div
                key={doctor.appUserId}
                style={{
                  borderRadius: "15px",
                  padding: "1.5rem",
                  backgroundColor: `${COLORS.PRIMARY}33`, // 20% opacity (33 hex)
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src={
                    doctor.image
                      ? `data:image/jpeg;base64,${doctor.image}`
                      : "/default-avatar.jpg"
                  }
                  alt={`Dr. ${doctor.firstname} ${doctor.lastname}`}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: `3px solid ${COLORS.ACCENT}`,
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h3 style={{ color: COLORS.PRIMARY, marginBottom: 4 }}>
                    Dr. {doctor.firstname} {doctor.lastname}
                  </h3>
                  <p style={{ color: COLORS.ACCENT, fontWeight: "600" }}>
                    {doctor.specialization}
                  </p>
                  <p style={{ fontSize: "0.95rem" }}>
                    <strong>Experience:</strong> {doctor.experienceYears} year
                    {doctor.experienceYears > 1 ? "s" : ""}
                  </p>
                  <p style={{ fontSize: "0.95rem" }}>
                    <strong>Gender:</strong> {doctor.gender}
                  </p>
                  <p style={{ fontSize: "0.95rem" }}>
                    <strong>Phone:</strong> {doctor.phone}
                  </p>
                  <p style={{ fontSize: "0.95rem" }}>
                    <strong>Location:</strong> {resolvedAddresses[doctor.appUserId] || "Loading..."}
                  </p>
                  <p style={{ fontSize: "0.95rem" }}>
                    <strong>Rating:</strong>{" "}
                    {rating > 0 ? renderStars(rating) : "No ratings"}
                  </p>

                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button
                      onClick={() => handleViewDetails(doctor.appUserId)}
                      style={buttonStyle(COLORS.ACCENT)}
                    >
                      Appointments
                    </button>
                    <button
                      onClick={() => handleViewReviews(doctor.appUserId)}
                      style={buttonStyle(COLORS.ACCENT)}
                    >
                      Reviews
                    </button>
                    <button
                      onClick={() => handleMessageDoctor(doctor.appUserId)}
                      style={buttonStyle(COLORS.ACCENT)}
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const buttonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: "#000000",
  border: "none",
  borderRadius: "6px",
  padding: "0.5rem 1rem",
  fontWeight: "600",
  cursor: "pointer",
  flex: 1,
  transition: "background-color 0.3s ease",
  // Darken on hover
  // We'll add inline events for hover in component if needed or add CSS classes in your project.
});

export default SpeciDr;
