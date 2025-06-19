import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import adminservice from "../service/adminService";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const SideAdmin = () => {
  const [adminImage, setAdminImage] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded?.appUserId;

        adminservice.getAdminById(id).then((res) => {
          const imageSrc = `data:image/jpeg;base64,${res.data.image}`;
          setAdminImage(imageSrc);
          setAdminName(`${res.data.firstname} ${res.data.lastname}`);
        });
      } catch (err) {
        console.error("Error decoding token or fetching admin:", err);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <>
      <button onClick={toggleSidebar} className="sidebar-toggle-btn">
        <FaBars />
      </button>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>

        {adminImage && (
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <img
              src={adminImage}
              alt="Admin"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #8e6dda",
              }}
            />
            <p style={{ marginTop: "10px", fontWeight: "bold", color: "#8e6dda" }}>
              {adminName}
            </p>
          </div>
        )}

        <ul className="sidebar-links" style={{ listStyle: "none", padding: 0 }}>
          {[
            { to: "/admin/profile", label: "My Profile" },
            { to: "/admin/admindashboard", label: "Dashboard" },
            { to: "/admin/getallcompanies", label: "Company List" },
            { to: "/admin/getallsp", label: "Sp List" },
            { to: "/admin/getadmins", label: "Admin List" },
            { to: "/admin/getpetcategories", label: "PetCategory List" },
            { to: "/admin/getproductcategories", label: "ProductCategory List" },
            { to: "/admin/getservicecategories", label: "ServiceCategory List" },
            { to: "/admin/getallpp", label: "Pp List" },
            { to: "/admin/getallusers", label: "User List" },
            { to: "/admin/getdoctors", label: "Dr List" },
          ].map((item, index) => (
            <li key={index} style={{ margin: "10px 0" }}>
              <Link
                to={item.to}
                style={{
                  color: "#c3baf0",
                  textDecoration: "none",
                  padding: "10px 15px",
                  display: "block",
                  borderRadius: "8px",
                  backgroundColor: "#1e293b",
                  transition: "0.3s",
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}

          <li style={{ marginTop: 20 }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ffb703",
                color: "#023047",
                border: "none",
                borderRadius: 8,
                padding: "10px 15px",
                fontWeight: "bold",
                width: "100%",
                cursor: "pointer",
              }}
            >
              <FaSignOutAlt style={{ marginRight: 8 }} />
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Optional Styling */}
      <style>{`
      .sidebar {
  height: 100vh;
  width: 260px;
  position: fixed;
  top: 0;
  left: -260px;
  background-color: #0f172a;
  padding: 20px;
  color: white;
  transition: left 0.3s ease;
  z-index: 1000;
  overflow-y: auto; /* ✅ This enables scrolling */
}
        .sidebar.open {
          left: 0;
        }
        .sidebar-toggle-btn {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 24px;
          background: none;
          border: none;
          color: #8e6dda;
          z-index: 1001;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          color: #8e6dda;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default SideAdmin;
