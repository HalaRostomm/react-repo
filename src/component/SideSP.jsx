import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Spservice from "../service/spservice";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChartPie,
  FaUser,
  FaBell,
  FaEnvelope,
  FaClock,
  FaWrench,
} from "react-icons/fa";

const SideSP = () => {
  const [SpId, setSpId] = useState(null);
  const [SpImage, setSpImage] = useState(null);
  const [SpName, setSpName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded?.appUserId;
        setSpId(id);

        Spservice.getSpById(id).then((res) => {
          setSpImage(`data:image/jpeg;base64,${res.data.image}`);
          setSpName(`${res.data.firstname} ${res.data.lastname}`);
        });
      } catch (err) {
        console.error("Error decoding token or fetching SP:", err);
      }
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
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

      <div className={`sidebar-sp ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>

        {SpImage && (
          <div className="sidebar-header">
            <img src={SpImage} alt="SP" className="sidebar-avatar" />
            <p>{SpName}</p>
          </div>
        )}

        <ul className="sidebar-links">
          <li>
            <Link to="/sp/dashboard">
              <FaChartPie /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/sp/profile">
              <FaUser /> My Profile
            </Link>
          </li>
          <li>
            <Link to={`/sp/getnotifications/${SpId}`}>
              <FaBell /> Notifications
            </Link>
          </li>
          <li>
            <Link to={`/sp/chats/${SpId}`}>
              <FaEnvelope /> Messages
            </Link>
          </li>
          <li>
            <Link to={`/sp/getavailability/${SpId}`}>
              <FaClock /> My Availability
            </Link>
          </li>
          <li>
            <Link to={`/sp/getservices/${SpId}`}>
              <FaWrench /> My Services
            </Link>
          </li>
        </ul>

        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <style>{`
        .sidebar-sp {
          width: 250px;
          background: #E7ECEF;
          color: #274C77;
          min-height: 100vh;
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          position: fixed;
          top: 0;
          left: -260px;
          z-index: 1000;
          overflow-y: auto;
          transition: 0.3s ease-in-out;
        }
        .sidebar-sp.open {
          left: 0;
        }
        .sidebar-toggle-btn {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 24px;
          background: none;
          border: none;
          color: #274C77;
          z-index: 1001;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          color: #274C77;
          cursor: pointer;
        }
        .sidebar-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .sidebar-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #A3CEF1;
        }
        .sidebar-header p {
          margin-top: 8px;
          font-weight: bold;
          color: #8B8C89;
        }
        .sidebar-links {
          list-style: none;
          padding: 0;
        }
        .sidebar-links li {
          margin-bottom: 12px;
        }
        .sidebar-links a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          color: #FFF;
          background-color: #6096BA;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }
        .sidebar-links a:hover {
          background-color: #A3CEF1;
          color: #274C77;
        }
        .logout-btn {
          background-color: #A3CEF1;
          color: #274C77;
          border: none;
          padding: 10px;
          width: 100%;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .logout-btn:hover {
          background-color: #6096BA;
          color: #FFF;
        }
      `}</style>
    </>
  );
};

export default SideSP;
