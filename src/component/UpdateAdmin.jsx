import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../service/adminService";

const UpdateAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    firstname: "",
    lastname: "",
    birthDate: "",
    gender: "",
    phone: "",
    address: "",
    location: "",
    image: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    adminService
      .getAdminById(id)
      .then((response) => {
        const data = response.data || {};
        setAdmin({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          birthDate: data.birthDate || "",
          gender: data.gender || "",
          phone: data.phone || "",
          address: data.address || "",
          location: data.location || "",
          image: data.image || "",
        });
      })
      .catch(() => {
        setMessage("❌ Failed to load profile data.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAdmin((prev) => ({ ...prev, image: reader.result.split(",")[1] }));
      };
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          setAdmin((prev) => ({
            ...prev,
            address: data.display_name,
            location: data.display_name,
          }));
        } catch {
          setErrorMessage("Unable to fetch location.");
        }
      },
      () => setErrorMessage("Location permission denied.")
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    adminService
      .updateAdmin(id, admin)
      .then(() => {
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => navigate("/admin/profile"), 2000);
      })
      .catch(() => setMessage("❌ Failed to update profile."))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff", // White background
          padding: "50px 20px",
          fontFamily: "'Raleway', sans-serif",
          color: "#333",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            backgroundColor: "#D0D5CE", // Card background color
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(90deg, #000000, #4a148c)", // Gradient header background
              padding: "20px 30px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              color: "#fff",
            }}
          >
            <h2 style={{ margin: 0, fontWeight: "700" }}>Edit Profile</h2>
            <p style={{ margin: 0, color: "#f3e5f5" }}>
              Update your personal details
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div
              style={{
                backgroundColor: message.startsWith("✅") ? "#2e7d32" : "#c62828",
                color: "#fff",
                padding: "10px",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {message}
            </div>
          )}
          {errorMessage && (
            <div
              style={{
                backgroundColor: "#c62828",
                color: "#fff",
                padding: "10px",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "30px" }}>
            <div className="row g-3">
              <div className="col-md-6">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstname"
                  className="form-control"
                  value={admin.firstname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  className="form-control"
                  value={admin.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="birthDate"
                  className="form-control"
                  value={admin.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label>Gender</label>
                <select
                  name="gender"
                  className="form-select"
                  value={admin.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="col-md-6">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={admin.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label>Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="col-12">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={admin.address}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="btn mt-2"
                  style={{
                    backgroundColor: "#f3e5f5",
                    border: "1px solid #000000",
                    color: "#000000",
                    fontWeight: "500",
                    borderRadius: "8px",
                  }}
                  onClick={getCurrentLocation}
                >
                  Use Current Location
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="text-end mt-4">
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#000000",
                  color: "#fff",
                  padding: "10px 20px",
                  fontWeight: "600",
                  borderRadius: "10px",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "UPDATE PROFILE"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateAdmin;
