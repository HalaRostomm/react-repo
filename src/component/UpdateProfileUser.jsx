import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBirthdayCake,
  FaVenusMars,
  FaPhone,
  FaMapMarkerAlt,
  FaImage,
  FaLocationArrow,
  FaSave
} from "react-icons/fa";
import userService from "../service/userservice";

const UpdateProfileUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
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

  useEffect(() => {
    if (!id) return setMessage("❌ Missing user ID");

    userService.getUserById(id)
      .then((res) => {
        const data = res.data;
        setUser({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          birthDate: data.birthDate || "",
          gender: data.gender || "",
          phone: data.phone || "",
          address: data.address || "",
          image: data.image || "",
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Failed to load user data.");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUser((prev) => ({ ...prev, image: reader.result.split(",")[1] }));
    };
    reader.readAsDataURL(file);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const locationStr = `${coords.longitude}, ${coords.latitude}`;
        setUser((prev) => ({
          ...prev,
          location: locationStr,
          address: locationStr,
        }));
      },
      () => alert("Permission denied.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userService.updateUser(id, user);
      setMessage("✅ Profile updated!");
      setTimeout(() => navigate("/user/profile"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    page: {
      backgroundColor: "#E5E5E5",
      minHeight: "100vh",
      padding: "2rem 1rem",
      fontFamily: "'Tinos', serif",
      color: "#000000",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#14213D",
      textAlign: "center",
      marginBottom: "2rem",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "1.5rem",
    },
    label: {
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#14213D",
    },
    input: {
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "1rem",
    },
    button: {
      backgroundColor: "#FCA311",
      color: "#FFFFFF",
      padding: "0.75rem 2rem",
      border: "none",
      borderRadius: "6px",
      fontSize: "1.1rem",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "1rem",
    },
    message: {
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: message.startsWith("✅") ? "green" : "red",
    },
    container: {
      maxWidth: "700px",
      margin: "0 auto",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Edit Your Profile</h1>

        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}><FaUser /> First Name</label>
            <input type="text" name="firstname" value={user.firstname} onChange={handleInputChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}><FaUser /> Last Name</label>
            <input type="text" name="lastname" value={user.lastname} onChange={handleInputChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}><FaBirthdayCake /> Birth Date</label>
            <input type="date" name="birthDate" value={user.birthDate} onChange={handleInputChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}><FaVenusMars /> Gender</label>
            <select name="gender" value={user.gender} onChange={handleInputChange} style={styles.input} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}><FaPhone /> Phone</label>
            <input type="text" name="phone" value={user.phone} onChange={handleInputChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}><FaMapMarkerAlt /> Address</label>
            <input type="text" name="address" value={user.address} onChange={handleInputChange} style={styles.input} required />
            <button type="button" onClick={getCurrentLocation} style={{ ...styles.button, backgroundColor: "#000000", fontSize: "0.9rem", marginTop: "0.5rem" }}>
              <FaLocationArrow /> Use My Location
            </button>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}><FaImage /> Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={styles.input} />
          </div>

          <div style={{ textAlign: "center" }}>
            <button type="submit" style={styles.button} disabled={isLoading}>
              <FaSave /> {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileUser;
