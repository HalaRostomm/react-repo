import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SpService from "../service/spservice";
import { FaSave, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";

const UpdateProfileSp = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [serviceProvider, setSp] = useState({
    firstname: "",
    lastname: "",
    birthDate: "",
    gender: "",
    phone: "",
    location: "",
    address: "",
    image: "",
    company: { companyId: "", companyName: "" },
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    SpService.getSpById(id)
      .then((response) => {
        const data = response.data || {};
        setSp({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          birthDate: data.birthDate || "",
          gender: data.gender || "",
          phone: data.phone || "",
          address: data.address || "",
          location: data.location || "",
          image: data.image || "",
          company: data.company || { companyId: "", companyName: "" },
        });
        setMessage("");
      })
      .catch((error) => {
        setMessage("❌ Failed to load profile data. Please try again.");
        console.error("Error fetching profile details:", error);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSp((prev) => ({
          ...prev,
          image: reader.result.split(",")[1],
        }));
      };
      reader.onerror = (error) => {
        console.error("Error converting image to Base64: ", error);
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
          setSp((prev) => ({
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

    SpService.updateSp(id, serviceProvider)
      .then(() => {
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => navigate("/sp/profile"), 2000);
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || "❌ Failed to update profile.";
        setMessage(errorMsg);
        console.error("Error updating profile:", error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          color: "#274C77",
          backgroundColor: "#E7ECEF",
          minHeight: "100vh",
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "600px",
            padding: "2rem 3rem",
          }}
        >
          <h2
            style={{
              color: "#274C77",
              fontWeight: "600",
              fontSize: "1.8rem",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            Update Profile Information
          </h2>

          {message && (
            <div
              style={{
                backgroundColor: message.startsWith("✅") ? "#A3CEF1" : "#f8d7da",
                color: message.startsWith("✅") ? "#274C77" : "#721c24",
                borderRadius: "8px",
                padding: "12px 15px",
                marginBottom: "1.5rem",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {message}
            </div>
          )}

          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              <div
                className="spinner-border"
                role="status"
                style={{ color: "#6096BA", width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {[
                { label: "First Name", name: "firstname", type: "text" },
                { label: "Last Name", name: "lastname", type: "text" },
                { label: "Date of Birth", name: "birthDate", type: "date" },
                { label: "Phone", name: "phone", type: "text" },
                { label: "Address", name: "address", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name} style={{ marginBottom: "1.2rem" }}>
                  <label style={{ fontWeight: "600", marginBottom: "0.3rem", display: "block" }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={serviceProvider[name]}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      border: "1.5px solid #A3CEF1",
                      fontSize: "1rem",
                      outlineColor: "#274C77",
                      backgroundColor: "#F8FAFC",
                    }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ fontWeight: "600", marginBottom: "0.3rem", display: "block" }}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={serviceProvider.gender}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "1.5px solid #A3CEF1",
                    fontSize: "1rem",
                    outlineColor: "#274C77",
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ fontWeight: "600", marginBottom: "0.3rem", display: "block" }}>
                  Company
                </label>
                <input
                  type="text"
                  value={serviceProvider.company.companyName || ""}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "1.5px solid #A3CEF1",
                    backgroundColor: "#A3CEF1",
                    color: "#274C77",
                    fontWeight: "600",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ fontWeight: "600", marginBottom: "0.3rem", display: "block" }}>
                  Upload Image
                </label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                style={{
                  backgroundColor: "#6096BA",
                  color: "#fff",
                  width: "100%",
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <FaMapMarkerAlt /> Get Current Location
              </button>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: "#274C77",
                  color: "#fff",
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaSave /> {isLoading ? "Updating..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/sp/profile")}
                style={{
                  backgroundColor: "#8B8C89",
                  color: "#fff",
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaArrowLeft /> Back
              </button>

              {errorMessage && (
                <p style={{ color: "red", marginTop: "1rem", fontWeight: "600" }}>
                  {errorMessage}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateProfileSp;
