import React, { useState, useEffect } from "react";
import userService from "../service/userservice";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import authService from "../service/authService";
import { jwtDecode } from "jwt-decode";

// Color theme updates
const COLORS = {
  PRIMARY: "#13B6B9",    // header and card background base color
  ACCENT: "#FFA100",     // buttons and star icons
  BACKGROUND: "#F8F9FA", // page background
  TEXT: "#333333",       // dark gray text for better readability
  TEXT_LIGHT: "#666666", // lighter text for secondary info
  BORDER: "#E5E5E5",
  WHITE: "#FFFFFF",
  DANGER: "#DC3545",     // for error messages
};

// Create global styles for consistent styling
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
    background-color: ${COLORS.BACKGROUND};
    margin: 0;
    padding: 0;
    color: ${COLORS.TEXT};
  }
`;

// Inject global styles
const styleElement = document.createElement("style");
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);

const SpeciDr = () => {
  const { specialization } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [averageRatings, setAverageRatings] = useState({});
  const [resolvedAddresses, setResolvedAddresses] = useState({});
  const [appUserId, setAppUserId] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(true);
        const response = await userService.getDoctorsBySpecialization(specialization);
        setDoctors(response.data);
        await fetchRatings(response.data);
        setMessage("");
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setMessage("❌ Failed to fetch doctors. Please try again later.");
      } finally {
        setLoading(false);
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
    
    const fetchAddresses = async () => {
      const newAddresses = {};
      
      await Promise.all(
        doctors.map(async (doctor) => {
          if (doctor.address && doctor.address.includes(",")) {
            try {
              const [lon, lat] = doctor.address.split(",").map(Number);
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
              );
              const data = await response.json();
              newAddresses[doctor.appUserId] = data.display_name || doctor.address;
            } catch {
              newAddresses[doctor.appUserId] = doctor.address;
            }
          } else {
            newAddresses[doctor.appUserId] = doctor.address || "Address not available";
          }
        })
      );
      
      setResolvedAddresses(prev => ({ ...prev, ...newAddresses }));
    };
    
    fetchAddresses();
  }, [doctors]);

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    
    for (let i = 0; i < full; i++)
      stars.push(<FaStar key={`f-${i}`} color={COLORS.ACCENT} size={14} />);
    if (half) stars.push(<FaStarHalfAlt key="h" color={COLORS.ACCENT} size={14} />);
    for (let i = 0; i < 5 - full - (half ? 1 : 0); i++)
      stars.push(<FaRegStar key={`e-${i}`} color={COLORS.BORDER} size={14} />);
    
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {stars}
        <span style={{ marginLeft: 4, fontSize: "0.9rem" }}>
          {rating > 0 ? rating.toFixed(1) : "No ratings"}
        </span>
      </div>
    );
  };

  const handleViewDetails = (id) => navigate(`/user/getappointments/${id}`);
  const handleViewReviews = (id) => navigate(`/user/getdoctorreviews/${id}`);
  const handleMessageDoctor = (id) => navigate(`/chat/${id}/${appUserId}/null`);

  return (
    <div
      style={{
        padding: "2rem 1rem",
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: COLORS.PRIMARY,
          fontWeight: "600",
          fontSize: "1.8rem",
        }}
      >
        {specialization} Specialists
      </h2>

      {message && (
        <div style={{
          textAlign: "center",
          color: COLORS.DANGER,
          fontWeight: "500",
          margin: "1rem 0",
          padding: "0.5rem",
          backgroundColor: `${COLORS.DANGER}15`,
          borderRadius: "6px",
          maxWidth: "600px",
          margin: "0 auto 2rem",
        }}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px"
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: `4px solid ${COLORS.PRIMARY}33`,
            borderTopColor: COLORS.PRIMARY,
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
        </div>
      ) : doctors.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "2rem",
          backgroundColor: COLORS.WHITE,
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          No doctors found for this specialization.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {doctors.map((doctor) => {
            const rating = averageRatings[doctor.appUserId] || 0;
            return (
              <div
                key={doctor.appUserId}
                style={{
                  borderRadius: "12px",
                  padding: "1.5rem",
                  backgroundColor: COLORS.WHITE,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  border: `1px solid ${COLORS.BORDER}`,
                  ":hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
                  }
                }}
              >
                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}>
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
                      border: `3px solid ${COLORS.PRIMARY}`,
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.target.src = "/default-avatar.jpg";
                    }}
                  />

                  <div>
                    <h3 style={{ 
                      color: COLORS.PRIMARY, 
                      margin: "0 0 4px 0",
                      fontSize: "1.2rem",
                      fontWeight: "600"
                    }}>
                      Dr. {doctor.firstname} {doctor.lastname}
                    </h3>
                    <p style={{ 
                      color: COLORS.ACCENT, 
                      fontWeight: "500",
                      fontSize: "0.9rem",
                      margin: "0 0 8px 0"
                    }}>
                      {doctor.specialization}
                    </p>
                    <p style={{ 
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_LIGHT,
                      margin: "4px 0"
                    }}>
                      <strong>Experience:</strong> {doctor.experienceYears} year
                      {doctor.experienceYears > 1 ? "s" : ""}
                    </p>
                    <p style={{ 
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_LIGHT,
                      margin: "4px 0"
                    }}>
                      <strong>Gender:</strong> {doctor.gender}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "0.5rem" }}>
                  <p style={{ 
                    fontSize: "0.85rem",
                    color: COLORS.TEXT_LIGHT,
                    margin: "4px 0",
                    display: "flex",
                    alignItems: "flex-start"
                  }}>
                    <strong style={{ minWidth: "70px" }}>Phone:</strong> 
                    <span>{doctor.phone || "Not provided"}</span>
                  </p>
                  <p style={{ 
                    fontSize: "0.85rem",
                    color: COLORS.TEXT_LIGHT,
                    margin: "4px 0",
                    display: "flex",
                    alignItems: "flex-start"
                  }}>
                    <strong style={{ minWidth: "70px" }}>Location:</strong> 
                    <span>{resolvedAddresses[doctor.appUserId] || "Loading..."}</span>
                  </p>
                  <div style={{ 
                    fontSize: "0.85rem",
                    color: COLORS.TEXT_LIGHT,
                    margin: "4px 0",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <strong style={{ minWidth: "70px" }}>Rating:</strong> 
                    {rating > 0 ? renderStars(rating) : "No ratings yet"}
                  </div>
                </div>

                <div style={{ 
                  display: "flex", 
                  gap: "0.75rem", 
                  marginTop: "1.25rem",
                  flexWrap: "wrap"
                }}>
                  <button
                    onClick={() => handleViewDetails(doctor.appUserId)}
                    style={buttonStyle(COLORS.PRIMARY)}
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
                    style={buttonStyle(COLORS.WHITE, COLORS.PRIMARY)}
                  >
                    Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const buttonStyle = (bgColor, textColor = COLORS.WHITE, hoverBgColor = null) => ({
  backgroundColor: bgColor,
  color: textColor,
  border: bgColor === COLORS.WHITE ? `1px solid ${COLORS.PRIMARY}` : "none",
  borderRadius: "6px",
  padding: "0.5rem 0.75rem",
  fontWeight: "500",
  cursor: "pointer",
  flex: "1 1 auto",
  minWidth: "100px",
  transition: "all 0.2s ease",
  fontSize: "0.85rem",
  ":hover": {
    backgroundColor: hoverBgColor || `${bgColor}DD`,
    transform: "translateY(-1px)"
  },
  ":active": {
    transform: "translateY(0)"
  }
});

// Add keyframes for spinner animation
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const spinStyleElement = document.createElement("style");
spinStyleElement.innerHTML = spinKeyframes;
document.head.appendChild(spinStyleElement);

export default SpeciDr;