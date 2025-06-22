import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaChartBar, FaTrash, FaStethoscope, FaPaw } from "react-icons/fa";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = () => {
    adminService
      .getAllDoctors()
      .then(async (response) => {
        const doctorsData = response.data;
        const updatedDoctors = await Promise.all(
          doctorsData.map(async (doctor) => {
            if (doctor.address && doctor.address.includes(",")) {
              const [longitude, latitude] = doctor.address.split(",").map(Number);
              doctor.resolvedAddress = await resolveAddressFromCoordinates(latitude, longitude);
            } else {
              doctor.resolvedAddress = doctor.address;
            }
            return doctor;
          })
        );
        setDoctors(updatedDoctors);
        setLoading(false);
      })
      .catch((error) => {
        setMessage("❌ Failed to load vets. Please try again.");
        setMessageType("danger");
        setLoading(false);
        console.error("Error fetching doctors:", error);
      });
  };

  const resolveAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.display_name;
    } catch {
      return "Address not available";
    }
  };

  const deleteDoctor = (id) => {
    if (!window.confirm("Are you sure you want to delete this vet?")) return;

    adminService
      .deleteDoctor(id)
      .then(() => {
        setMessage("✅ Vet deleted successfully!");
        setMessageType("success");
        setDoctors((prev) => prev.filter((doc) => doc.appUserId !== id));
      })
      .catch((error) => {
        setMessage("❌ Failed to delete vet. Please try again.");
        setMessageType("danger");
        console.error("Error deleting doctor:", error);
      });
  };

  const formatAvailableDays = (availableDays) => {
    if (typeof availableDays === "object" && availableDays !== null) {
      return Object.keys(availableDays)
        .filter((day) => availableDays[day])
        .join(", ");
    }
    return availableDays || "Not set";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        padding: "50px",
        color: "#000",
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          backgroundColor: "#f5f5f5",
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#D0D5CE",
            padding: "20px 30px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FaStethoscope size={24} />
          <div>
            <h2 style={{ margin: 0, fontWeight: "700", color: "#000" }}>Vet List</h2>
            <p style={{ margin: 0, color: "#333", fontWeight: "400" }}>
              View and manage registered veterinarians
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`alert text-center fw-semibold`}
            style={{
              margin: "0",
              borderRadius: 0,
              color: messageType === "danger" ? "#721c24" : "#155724",
              backgroundColor: messageType === "danger" ? "#f8d7da" : "#d4edda",
              border: "none",
            }}
          >
            {message}
          </div>
        )}

        <div style={{ padding: "30px" }}>
          {/* Add Vet Button */}
          <div className="text-end mb-4">
            <button
              className="btn"
              style={{
                backgroundColor: "#D0D5CE",
                color: "#000",
                fontWeight: "600",
                padding: "8px 20px",
                borderRadius: "30px",
                border: "none",
              }}
              onClick={() => navigate("/admin/adddoctor")}
            >
              ➕ Add Vet
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <style>{`
                @keyframes pawBounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-10px); }
                }
              `}</style>
              <FaPaw
                size={40}
                style={{
                  color: "#000",
                  animation: "pawBounce 1s infinite ease-in-out"
                }}
              />
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", color: "#000" }}>
                <thead>
                  <tr style={{ backgroundColor: "#D0D5CE", textAlign: "center" }}>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Profile</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Address</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <tr
                        key={doctor.appUserId}
                        style={{
                          borderTop: "1px solid #ccc",
                          textAlign: "center",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td>{doctor.appUserId}</td>
                        <td>{doctor.firstname} {doctor.lastname}</td>
                        <td>
                          {doctor.image ? (
                            <img
                              src={`data:image/jpeg;base64,${doctor.image}`}
                              alt="Profile"
                              style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #D0D5CE",
                              }}
                            />
                          ) : (
                            <span className="text-muted">No Image</span>
                          )}
                        </td>
                        <td>{doctor.username}</td>
                        <td>{doctor.phone}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.experienceYears} yrs</td>
                        <td>{doctor.resolvedAddress || "Address not available"}</td>
                        <td>{formatAvailableDays(doctor.availableDays)}</td>
                        <td style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                          <button
                            onClick={() => navigate(`/admin/dashdr/${doctor.appUserId}`)}
                            style={{
                              backgroundColor: "#000",
                              color: "#fff",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <FaChartBar /> Stats
                          </button>
                          <button
                            onClick={() => deleteDoctor(doctor.appUserId)}
                            style={{
                              backgroundColor: "#000",
                              color: "#fff",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <FaTrash /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center text-muted py-3">
                        No vets available at the moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;