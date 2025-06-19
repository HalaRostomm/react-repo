import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or danger
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = () => {
    adminService
      .getAllAdmins()
      .then((response) => {
        setAdmins(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setMessage("❌ Failed to load admins. Please try again.");
        setMessageType("danger");
        setLoading(false);
        console.error("Error fetching admins:", error);
      });
  };

  const deleteAdmin = (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    adminService
      .deleteAdmin(id)
      .then(() => {
        setMessage(`✅ Admin deleted successfully!`);
        setMessageType("success");
        setAdmins((prev) => prev.filter((admin) => admin.appUserId !== id));
      })
      .catch((error) => {
        setMessage("❌ Failed to delete admin. Please try again.");
        setMessageType("danger");
        console.error("Error deleting admin:", error);
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
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#1e293b",
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(90deg, #9c27b0, #d63384)",
            padding: "20px 30px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          <h2 style={{ margin: 0, fontWeight: "700" }}>Admin List</h2>
          <p style={{ margin: 0, color: "#f3e5f5", fontWeight: "400" }}>
            View and manage all admin accounts
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`alert text-center fw-semibold`}
            style={{
              margin: 0,
              borderRadius: 0,
              color: messageType === "danger" ? "#f8d7da" : "#d4edda",
              backgroundColor: messageType === "danger" ? "#721c24" : "#155724",
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
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#7b1fa2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#9c27b0")}
              onClick={() => navigate("/admin/addadmin")}
            >
              ➕ Add Admin
            </button>
          </div>

          {/* Table */}
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length > 0 ? (
                    admins.map((admin) => (
                      <tr
                        key={admin.appUserId}
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
                        <td style={{ padding: "10px" }}>{admin.appUserId}</td>
                        <td>{admin.firstname} {admin.lastname}</td>
                        <td>{admin.username}</td>
                        <td>{admin.phone}</td>
                        <td>
                          {admin.image ? (
                            <img
                              src={`data:image/jpeg;base64,${admin.image}`}
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
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteAdmin(admin.appUserId)}
                            style={{
                              borderRadius: "6px",
                              fontWeight: "500",
                              padding: "6px 12px",
                              border: "none",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">
                        No admins available at the moment.
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

export default AdminList;
