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

  const primary = "#7F7B72";
  const background = "#F7F0E0";

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
  document.body.style.backgroundColor = background;
  return () => {
    document.body.style.backgroundColor = null; // Reset on unmount
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const locationString = `${coords.longitude}, ${coords.latitude}`;
          setPp((prevPp) => ({
            ...prevPp,
            location: locationString,
            address: locationString,
          }));
        },
        () => setErrorMessage("Location permission denied.")
      );
    } else {
      setErrorMessage("Geolocation is not supported.");
    }
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
      style={{ fontFamily: "'Roboto Slab', serif", backgroundColor: background, padding: 30 }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg" style={{ borderColor: primary }}>
            <div
              className="card-header fs-4 text-center"
              style={{ backgroundColor: primary, color: "#fff", fontWeight: "700" }}
            >
              Update Profile Information
            </div>
            <div className="card-body">
              {message && (
                <div
                  className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"} text-center`}
                  style={{ fontWeight: "600", color: "#000" }}
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
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaUser className="me-2" /> First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstname"
                      value={productProvider.firstname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaUser className="me-2" /> Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastname"
                      value={productProvider.lastname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaBirthdayCake className="me-2" /> Date of Birth
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="birthDate"
                      value={productProvider.birthDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaTransgender className="me-2" /> Gender
                    </label>
                    <select
                      className="form-control"
                      name="gender"
                      value={productProvider.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaPhone className="me-2" /> Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={productProvider.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaMapMarkerAlt className="me-2" /> Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={productProvider.address}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-sm mt-2"
                      onClick={getCurrentLocation}
                      style={{ color: primary, borderColor: primary, fontWeight: "600" }}
                    >
                      <FaMapMarkedAlt className="me-2" />
                      Get Current Location
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaBuilding className="me-2" /> Company
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={productProvider.company.companyName}
                      readOnly
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
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100"
                    style={{
                      backgroundColor: primary,
                      color: "#fff",
                      fontWeight: "600",
                    }}
                    disabled={isLoading}
                  >
                    <FaSave className="me-2" />
                    {isLoading ? "Updating..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary w-100 mt-2"
                    onClick={() => navigate("/pp/profile")}
                    style={{ fontWeight: "600" }}
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
