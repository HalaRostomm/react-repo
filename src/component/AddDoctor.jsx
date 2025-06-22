import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaStethoscope } from "react-icons/fa";

const AddDoctor = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!doctor.username || !doctor.password) {
      setErrorMessage("❌ All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await adminService.addNewDoctor(doctor);
      if (response.status === 200) {
        navigate("/admin/getdoctors");
      } else {
        setErrorMessage("❌ Failed to add vet. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        `❌ ${error.response?.data?.message || "Something went wrong."}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        padding: "50px 20px",
        fontFamily: "'Raleway', sans-serif",
        color: "#000",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
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
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            color: "#000",
          }}
        >
          <FaStethoscope size={24} />
          <h3 style={{ margin: 0, fontWeight: "700" }}>Add New Vet</h3>
        </div>

        {/* Message */}
        {errorMessage && (
          <div
            className="text-center fw-semibold"
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "0 0 6px 6px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "30px" }}>
          <div className="mb-4">
            <label className="form-label">Email</label>
            <input
              type="text"
              name="username"
              className="form-control"
              style={{
                backgroundColor: "#f1f1f1",
                color: "#000",
                border: "1px solid #ccc",
              }}
              placeholder="Enter email"
              value={doctor.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              style={{
                backgroundColor: "#f1f1f1",
                color: "#000",
                border: "1px solid #ccc",
              }}
              placeholder="Enter password"
              value={doctor.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#D0D5CE",
              color: "#000",
              fontWeight: "600",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #bbb",
            }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Vet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
