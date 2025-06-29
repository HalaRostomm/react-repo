import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../service/ppservice";
import {
  FaUser,
  FaBirthdayCake,
  FaTransgender,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaImage,
  FaSave,
  FaArrowLeft,
  FaMapMarkedAlt,
} from "react-icons/fa";

const UpdateProfilePp = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const primary = "#FCA311";
  const black = "#000000";
  const white = "#FFFFFF";

  const [productProvider, setPp] = useState({
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
    ProductService.getPPById(id)
      .then((response) => {
        const data = response.data || {};
        setPp({
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
      })
      .catch((error) => {
        setMessage("❌ Failed to load profile data. Please try again.");
        console.error("Error fetching profile details:", error);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    document.body.style.backgroundColor = white;
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPp((prev) => ({
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
        setPp((prev) => ({
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
        setPp((prev) => ({
          ...prev,
          address: data.display_name, // full human-readable address
          location: data.display_name,
        }));
        setErrorMessage(null); // clear any previous errors
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

    ProductService.updatePP(id, productProvider)
      .then(() => {
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => navigate("/pp/profile"), 2000);
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "❌ Failed to update profile.";
        setMessage(msg);
        console.error("Error updating profile:", error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      className="container mt-4"
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: white,
        padding: 30,
        color: black,
      }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div
              className="card-header fs-4 text-center"
              style={{ backgroundColor: primary, color: black, fontWeight: "700" }}
            >
              Update Profile Information
            </div>
            <div className="card-body">
              {message && (
                <div
                  className="alert text-center"
                  style={{
                    fontWeight: "600",
                    backgroundColor: white,
                    color: black,
                    border: `2px solid ${primary}`,
                    borderRadius: "10px",
                  }}
                >
                  {message}
                </div>
              )}

              {isLoading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status" style={{ color: primary }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {[
                    { label: "First Name", name: "firstname", icon: <FaUser /> },
                    { label: "Last Name", name: "lastname", icon: <FaUser /> },
                    { label: "Date of Birth", name: "birthDate", type: "date", icon: <FaBirthdayCake /> },
                    {
                      label: "Gender",
                      name: "gender",
                      type: "select",
                      icon: <FaTransgender />,
                      options: ["", "Male", "Female"],
                    },
                    { label: "Phone", name: "phone", icon: <FaPhone /> },
                    { label: "Address", name: "address", icon: <FaMapMarkerAlt /> },
                  ].map(({ label, name, type = "text", icon, options }) => (
                    <div className="mb-3" key={name}>
                      <label className="form-label fw-bold">
                        {icon} {label}
                      </label>
                      {type === "select" ? (
                        <select
                          className="form-control"
                          name={name}
                          value={productProvider[name]}
                          onChange={handleInputChange}
                          required
                          style={{ backgroundColor: white, border: `1px solid ${black}`, color: black }}
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt || "Select Gender"}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type}
                          className="form-control"
                          name={name}
                          value={productProvider[name]}
                          onChange={handleInputChange}
                          required
                          style={{ backgroundColor: white, border: `1px solid ${black}`, color: black }}
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-sm mt-2 mb-3"
                    onClick={getCurrentLocation}
                    style={{
                      backgroundColor: white,
                      border: `1px solid ${primary}`,
                      color: black,
                      fontWeight: "600",
                    }}
                  >
                    <FaMapMarkedAlt className="me-2" />
                    Get Current Location
                  </button>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaBuilding className="me-2" /> Company
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={productProvider.company.companyName}
                      readOnly
                      style={{ backgroundColor: white, color: black, border: `1px solid ${black}` }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaImage className="me-2" /> Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="form-control"
                      style={{ backgroundColor: white, color: black, border: `1px solid ${black}` }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100"
                    style={{
                      backgroundColor: primary,
                      color: black,
                      fontWeight: "600",
                      border: "none",
                    }}
                    disabled={isLoading}
                  >
                    <FaSave className="me-2" />
                    {isLoading ? "Updating..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="btn w-100 mt-2"
                    onClick={() => navigate("/pp/profile")}
                    style={{
                      backgroundColor: black,
                      color: white,
                      fontWeight: "600",
                      border: "none",
                    }}
                  >
                    <FaArrowLeft className="me-2" /> Back
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePp;
