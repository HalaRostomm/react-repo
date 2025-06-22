import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaBoxOpen, FaUserCircle } from "react-icons/fa";

const PpList = () => {
  const [productProviders, setProductProviders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProductProviders();
  }, []);

  const loadProductProviders = () => {
    adminService
      .getAllPP()
      .then((response) => {
        setProductProviders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setMessage("❌ Failed to load product providers. Please try again.");
        setLoading(false);
        console.error(error);
      });
  };

  const deletePP = (id) => {
    if (!window.confirm("Are you sure you want to delete this provider?")) return;
    adminService
      .deletePP(id)
      .then(() => {
        setMessage("✅ Product provider deleted successfully!");
        setProductProviders((prev) => prev.filter((p) => p.appUserId !== id));
      })
      .catch((error) => {
        setMessage("❌ Failed to delete product provider. Please try again.");
        console.error(error);
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        padding: "50px",
        color: "#333",
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            background: "#D0D5CE",
            padding: "20px 30px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#000000",
          }}
        >
          <FaBoxOpen size={26} />
          <div>
            <h2 style={{ margin: 0, fontWeight: "700" }}>Product Provider List</h2>
            <p style={{ margin: 0, color: "#000000" }}>
              View and manage registered product providers
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`alert text-center fw-semibold`}
            style={{
              margin: "0",
              borderRadius: 0,
              color: message.includes("❌") ? "#721c24" : "#155724",
              backgroundColor: message.includes("❌") ? "#f8d7da" : "#d4edda",
              border: "none",
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            {message}
          </div>
        )}

        <div style={{ padding: "30px" }}>
          <div className="text-end mb-4">
            <button
              className="btn"
              style={{
                backgroundColor: "#D0D5CE",
                color: "#000000",
                fontWeight: "600",
                padding: "8px 20px",
                borderRadius: "30px",
                border: "none",
                fontFamily: "'Raleway', sans-serif",
              }}
              onClick={() => navigate("/admin/addpp")}
            >
              ➕ Add Product Provider
            </button>
          </div>

          {loading ? (
            <div className="text-center text-muted fs-5">
              <i className="fas fa-spinner fa-spin me-2"></i> Loading...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", color: "#333", fontFamily: "'Raleway', sans-serif" }}>
                <thead>
                  <tr style={{ color: "#000000", textAlign: "center" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th>Full Name</th>
                    <th>Profile</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Company</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productProviders.length > 0 ? (
                    productProviders.map((provider) => (
                      <tr
                        key={provider.appUserId}
                        style={{
                          borderTop: "1px solid #ccc",
                          textAlign: "center",
                          transition: "background-color 0.3s",
                          fontFamily: "'Raleway', sans-serif",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <td style={{ padding: "10px" }}>{provider.appUserId}</td>
                        <td>{provider.firstname} {provider.lastname}</td>
                        <td>
                          {provider.image ? (
                            <img
                              src={`data:image/jpeg;base64,${provider.image}`}
                              alt="Profile"
                              style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #D05ECE",
                              }}
                            />
                          ) : (
                            <FaUserCircle size={45} color="#555" />
                          )}
                        </td>
                        <td>{provider.username}</td>
                        <td>{provider.phone}</td>
                        <td>{provider.gender}</td>
                        <td>{provider.company?.companyName || "N/A"}</td>
                        <td>
                          <button
                            onClick={() => navigate(`/admin/dashpp/${provider.appUserId}`)}
                            style={{
                              backgroundColor: "#D0D5CE",
                              color: "#000000",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "6px",
                              marginRight: "8px",
                              fontWeight: "500",
                              fontFamily: "'Raleway', sans-serif",
                            }}
                          >
                            Stats
                          </button>
                          <button
                            onClick={() => deletePP(provider.appUserId)}
                            style={{
                              backgroundColor: "#8B0000",
                              color: "#D0D5CE",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "500",
                              fontFamily: "'Raleway', sans-serif",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-3">
                        No product providers available at the moment.
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

export default PpList;
