import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaTrash, FaChartBar } from "react-icons/fa";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    adminService
      .getAllUsers()
      .then((response) => {
        const usersData = response.data;

        usersData.forEach((user) => {
          if (user.address && user.address.includes(",")) {
            const [longitude, latitude] = user.address.split(",").map(Number);
            resolveAddressFromCoordinates(user, latitude, longitude);
          } else {
            user.resolvedAddress = user.address;
          }
        });

        setUsers(usersData);
        setLoading(false);
      })
      .catch((error) => {
        setMessage("❌ Failed to load users. Please try again.");
        setLoading(false);
        console.error("Error fetching users:", error);
      });
  };

  const resolveAddressFromCoordinates = async (user, latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      user.resolvedAddress = data.display_name;
    } catch {
      user.resolvedAddress = "Address not available";
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.appUserId === user.appUserId ? { ...u, resolvedAddress: user.resolvedAddress } : u
      )
    );
  };

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    adminService
      .deleteUser(id)
      .then(() => {
        setMessage(`✅ User with ID ${id} deleted successfully!`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.appUserId !== id));
      })
      .catch((error) => {
        setMessage("❌ Failed to delete user. Please try again.");
        console.error("Error:", error);
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
          maxWidth: "1400px",
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
          <h2 style={{ margin: 0, fontWeight: "700" }}>Pet Owner List</h2>
          <p style={{ margin: 0, color: "#f3e5f5", fontWeight: "400" }}>
            Manage all registered pet owners
          </p>
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
              onClick={() => navigate("/admin/adduser")}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#7b1fa2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#9c27b0")}
            >
              ➕ Add Pet Owner
            </button>
          </div>

          {loading ? (
            <div className="text-center text-muted fs-5">
              <i className="fas fa-spinner fa-spin me-2"></i> Loading users...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", color: "#e0e0e0" }}>
                <thead>
                  <tr style={{ color: "#c3baf0", textAlign: "center" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th>Name</th>
                    <th>Profile</th>
                    <th>Birth Date</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.appUserId}
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
                        <td style={{ padding: "10px" }}>{user.appUserId}</td>
                        <td>{user.firstname} {user.lastname}</td>
                        <td>
                          {user.image ? (
                            <img
                              src={`data:image/jpeg;base64,${user.image}`}
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
                        <td>{user.birthDate}</td>
                        <td>{user.username}</td>
                        <td>{user.resolvedAddress}</td>
                        <td>{user.phone}</td>
                        <td style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                          <button
                            onClick={() => navigate(`/admin/dashuser/${user.appUserId}`)}
                            style={{
                              backgroundColor: "#6f42c1",
                              color: "#fff",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <FaChartBar /> Stats
                          </button>
                          <button
                            onClick={() => deleteUser(user.appUserId)}
                            style={{
                              backgroundColor: "#e53935",
                              color: "#fff",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "6px",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <FaTrash /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-3">
                        No pet owners available at the moment.
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

export default UserList;
