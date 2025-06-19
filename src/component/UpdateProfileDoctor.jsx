import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorService from "../service/doctorservice";

const COLORS = {
  dark: "#0D1B2A",
  deep: "#1B263B",
  steel: "#415A77",
  soft: "#778DA9",
  light: "#E0E1DD",
};

const UpdateProfileDoctor = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState({
    firstname: "",
    lastname: "",
    birthDate: "",
    gender: "",
    phone: "",
    address: "",
    location: "",
    urgent: false,
    specialization: "",
    experienceYears: "",
    image: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    DoctorService.getDoctorById(id)
      .then((response) => {
        const doctorData = response.data || {};
        setDoctor({
          firstname: doctorData.firstname || "",
          lastname: doctorData.lastname || "",
          birthDate: doctorData.birthDate || "",
          gender: doctorData.gender || "",
          phone: doctorData.phone || "",
          address: doctorData.address || "",
          location: doctorData.location || "",
          availableDays: doctorData.availableDays || {},
          specialization: doctorData.specialization || "",
          experienceYears: doctorData.experienceYears || "",
          image: doctorData.image || "",
          urgent: Boolean(doctorData.urgent),
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
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: value,
    }));
  };

  const handleAvailabilityChange = (day, hours) => {
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      availableDays: {
        ...prevDoctor.availableDays,
        [day]: hours,
      },
    }));
  };

  const toggleUrgentStatus = () => {
    setDoctor((prev) => ({
      ...prev,
      urgent: !prev.urgent,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setDoctor({ ...doctor, image: reader.result.split(",")[1] });
      };
      reader.onerror = (error) => {
        console.error("Error converting image to Base64: ", error);
      };
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${longitude}, ${latitude}`;
          setDoctor((prevDoctor) => ({
            ...prevDoctor,
            location: locationString,
            address: locationString,
          }));
        },
        () => setErrorMessage("Location permission denied.")
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = {
      ...doctor,
      urgent: doctor.urgent ? 1 : 0,
    };

    DoctorService.updateDoctor(id, dataToSend)
      .then(() => {
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => navigate("/doctor/profile"), 2000);
      })
      .catch((error) => {
        setMessage("❌ Failed to update user.");
        console.error("Error updating user:", error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      className="container mt-4"
      style={{
        backgroundColor: COLORS.dark,
        color: COLORS.light,
        fontFamily: "'Crimson Pro', serif",
        padding: "2rem",
        borderRadius: "12px",
        maxWidth: "700px",
      }}
    >
      <h3 className="text-center mb-4" style={{ color: COLORS.soft }}>
        Update Doctor Profile
      </h3>

      <div className="card shadow-lg" style={{ backgroundColor: COLORS.deep, border: "none" }}>
        <div
          className="card-header text-center"
          style={{
            backgroundColor: COLORS.steel,
            color: COLORS.light,
            fontSize: "1.25rem",
            fontWeight: "600",
          }}
        >
          Profile Details
        </div>
        <div className="card-body">
          {message && (
            <div
              className={`alert ${
                message.startsWith("✅") ? "alert-success" : "alert-danger"
              } text-center`}
            >
              {message}
            </div>
          )}

          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border text-light" role="status">
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
              ].map((field) => (
                <div className="mb-3" key={field.name}>
                  <label className="form-label">{field.label}</label>
                  <input
                    type={field.type}
                    className="form-control"
                    name={field.name}
                    value={doctor[field.name]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}

              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={getCurrentLocation}
                >
                  Get Current Location
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  name="gender"
                  value={doctor.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Specialization</label>
                <select
                  className="form-control"
                  name="specialization"
                  value={doctor.specialization}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Specialization</option>
                  {[
                    "Bird", "Cat", "Dog", "Ferret", "Fish", "Guinea Pig",
                    "Hamster", "Lizard", "Rabbit", "Rat", "Snake", "Turtle",
                  ].map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Years of Experience</label>
                <input
                  type="number"
                  className="form-control"
                  name="experienceYears"
                  value={doctor.experienceYears}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Urgent Cases</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={doctor.urgent}
                    onChange={toggleUrgentStatus}
                    id="urgentSwitch"
                  />
                  <label className="form-check-label" htmlFor="urgentSwitch">
                    {doctor.urgent
                      ? "Currently accepting urgent cases"
                      : "Not accepting urgent cases"}
                  </label>
                </div>
                {doctor.urgent && (
                  <span className="badge bg-danger mt-1">URGENT</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={() => navigate("/doctor/profile")}
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileDoctor;
