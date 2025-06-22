import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorService from "../service/doctorservice";

const COLORS = {
  primary: "#64B5F6", // updated color
  black: "#000000",
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
        backgroundColor: COLORS.primary,
        color: COLORS.black,
        fontFamily: "'Poppins', sans-serif",
        padding: "2rem",
        borderRadius: "12px",
        maxWidth: "700px",
      }}
    >
      <h3 className="text-center mb-4" style={{ color: COLORS.black }}>
        Update Doctor Profile
      </h3>

      <div className="card shadow-lg" style={{ backgroundColor: "#BBDEFB", border: "none" }}>
        <div
          className="card-header text-center"
          style={{
            backgroundColor: "#90CAF9",
            color: COLORS.black,
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
              style={{ color: COLORS.black }}
            >
              {message}
            </div>
          )}

          {isLoading ? (
            <div className="text-center">
              <div
                className="spinner-border"
                role="status"
                style={{ color: COLORS.black }}
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
              ].map((field) => (
                <div className="mb-3" key={field.name}>
                  <label
                    className="form-label"
                    style={{ color: COLORS.black }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    className="form-control"
                    name={field.name}
                    value={doctor[field.name]}
                    onChange={handleInputChange}
                    required
                    style={{ color: COLORS.black }}
                  />
                </div>
              ))}

              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm"
                  onClick={getCurrentLocation}
                >
                  Get Current Location
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: COLORS.black }}>
                  Gender
                </label>
                <select
                  className="form-control"
                  name="gender"
                  value={doctor.gender}
                  onChange={handleInputChange}
                  required
                  style={{ color: COLORS.black }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: COLORS.black }}>
                  Specialization
                </label>
                <select
                  className="form-control"
                  name="specialization"
                  value={doctor.specialization}
                  onChange={handleInputChange}
                  required
                  style={{ color: COLORS.black }}
                >
                  <option value="">Select Specialization</option>
                  {[
                    "Bird",
                    "Cat",
                    "Dog",
                    "Ferret",
                    "Fish",
                    "Guinea Pig",
                    "Hamster",
                    "Lizard",
                    "Rabbit",
                    "Rat",
                    "Snake",
                    "Turtle",
                  ].map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: COLORS.black }}>
                  Years of Experience
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="experienceYears"
                  value={doctor.experienceYears}
                  onChange={handleInputChange}
                  required
                  style={{ color: COLORS.black }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: COLORS.black }}>
                  Upload Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: COLORS.black }}>
                  Urgent Cases
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={doctor.urgent}
                    onChange={toggleUrgentStatus}
                    id="urgentSwitch"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="urgentSwitch"
                    style={{ color: COLORS.black }}
                  >
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
                className="btn btn-dark w-100"
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
