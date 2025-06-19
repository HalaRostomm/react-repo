
import { FaToolbox } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";

const SpList = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadServiceProviders();
  }, []);

  const loadServiceProviders = () => {
    adminService
      .getAllSP()
      .then((response) => {
        setServiceProviders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setMessage("❌ Failed to load service providers. Please try again.");
        setLoading(false);
        console.error(error);
      });
  };

  const deleteServiceProvider = (id) => {
    if (!window.confirm("Are you sure you want to delete this provider?")) return;

    adminService
      .deleteSP(id)
      .then(() => {
        setMessage("✅ Service provider deleted successfully!");
        setServiceProviders((prev) => prev.filter((sp) => sp.appUserId !== id));
      })
      .catch((error) => {
        setMessage("❌ Failed to delete service provider. Please try again.");
        console.error(error);
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "50px",
        color: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          backgroundColor: "#1e293b",
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
        }}
      >
       <div
  style={{
    background: "linear-gradient(90deg, #9c27b0, #d63384)",
    padding: "20px 30px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }}
>
  <FaToolbox size={24} />
  <div>
    <h2 style={{ margin: 0, fontWeight: "700" }}>Service Provider List</h2>
    <p style={{ margin: 0, color: "#f3e5f5", fontWeight: "400" }}>
      Overview of all registered service providers
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
              color: message.includes("❌") ? "#f8d7da" : "#d4edda",
              backgroundColor: message.includes("❌") ? "#721c24" : "#155724",
              border: "none",
            }}
          >
            {message}
          </div>
        )}

        <div style={{ padding: "30px" }}>
          {/* Add Button */}
          <div className="text-end mb-4">
            <button
              className="btn"
              style={{
                backgroundColor: "#9c27b0",
                color: "#fff",
                fontWeight: "600",
                padding: "8px 20px",
                borderRadius: "30px",
                border: "none",
                boxShadow: "0 4px 12px rgba(156, 39, 176, 0.6)",
              }}
              onClick={() => navigate("/admin/addsp")}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#7b1fa2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#9c27b0")}
            >
              ➕ Add Service Provider
            </button>
          </div>

          {loading ? (
            <div className="text-center text-muted fs-5">
              <i className="fas fa-spinner fa-spin me-2"></i> Loading...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", color: "#e0e0e0" }}>
                <thead>
                  <tr style={{ color: "#c3baf0", textAlign: "center" }}>
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
                  {serviceProviders.length > 0 ? (
                    serviceProviders.map((sp) => (
                      <tr
                        key={sp.appUserId}
                        style={{
                          borderTop: "1px solid #334155",
                          textAlign: "center",
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#1a2235")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <td style={{ padding: "10px" }}>{sp.appUserId}</td>
                        <td>{sp.firstname} {sp.lastname}</td>
                        <td>
                          {sp.image ? (
                            <img
                              src={`data:image/jpeg;base64,${sp.image}`}
                              alt="Profile"
                              style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #9c27b0",
                              }}
                            />
                          ) : (
                            <span className="text-muted">No Image</span>
                          )}
                        </td>
                        <td>{sp.username}</td>
                        <td>{sp.phone}</td>
                        <td>{sp.gender}</td>
                        <td>{sp.company ? sp.company.companyName : "N/A"}</td>
                        <td>
                          <button
                            onClick={() => navigate(`/admin/dashsp/${sp.appUserId}`)}
                            style={{
                              backgroundColor: "#6f42c1",
                              color: "#fff",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "6px",
                              marginRight: "8px",
                              fontWeight: "500",
                            }}
                          >
                            Stats
                          </button>
                          <button
                            onClick={() => deleteServiceProvider(sp.appUserId)}
                            style={{
                              backgroundColor: "#e53935",
                              color: "#fff",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "500",
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
                        No service providers available at the moment.
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

export default SpList;
