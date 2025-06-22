import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
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
      {/* Load Raleway font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <button onClick={toggleSidebar} className="sidebar-toggle-btn" aria-label="Toggle sidebar">
        <FaBars />
      </button>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar} aria-label="Close sidebar">
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
                border: "2px solid #000000",
              }}
            />
            <p
              style={{
                marginTop: "10px",
                fontWeight: "700",
                color: "#000000",
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              {adminName}
            </p>
          </div>
        )}

        <ul
          className="sidebar-links"
          style={{
            listStyle: "none",
            padding: 0,
            fontFamily: "'Raleway', sans-serif",
            color: "#000000",
          }}
        >
          {[
            { to: "/admin/profile", label: "My Profile" },
            { to: "/admin/admindashboard", label: "Dashboard" },
            { to: "/admin/getallcompanies", label: "Company List" },
            { to: "/admin/getallsp", label: "Sp List" },
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
                  color: "#000000",
                  textDecoration: "none",
                  padding: "10px 15px",
                  display: "block",
                  borderRadius: "8px",
                  backgroundColor: "#D0D5CE",
                  transition: "background-color 0.3s ease",
                  fontWeight: "600",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#bfc6be")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#D0D5CE")}
                onClick={() => setIsSidebarOpen(false)} // close sidebar on link click
              >
                {item.label}
              </Link>
            </li>
          ))}

          <li style={{ marginTop: 20 }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#000000",
                color: "#D0D5CE",
                border: "none",
                borderRadius: 8,
                padding: "10px 15px",
                fontWeight: "700",
                width: "100%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "'Raleway', sans-serif",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333333")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000000")}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Styling */}
      <style>{`
        .sidebar {
          height: 100vh;
          width: 260px;
          position: fixed;
          top: 0;
          left: -260px;
          background-color: #D0D5CE;
          padding: 20px;
          color: #000000;
          transition: left 0.3s ease;
          z-index: 1000;
          overflow-y: auto;
          box-shadow: 2px 0 8px rgba(0,0,0,0.1);
          font-family: 'Raleway', sans-serif;
        }
        .sidebar.open {
          left: 0;
        }
        .sidebar-toggle-btn {
          position: fixed;
          top: 10px;
          left: 10px;
          font-size: 24px;
          background: none;
          border: none;
          color: #000000;
          z-index: 1001;
          cursor: pointer;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          color: #000000;
          cursor: pointer;
        }
        .sidebar-links li a:focus {
          outline: 2px solid #000000;
          outline-offset: 2px;
        }
        button:focus {
          outline: 2px solid #000000;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
};

export default SideAdmin;
