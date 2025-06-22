import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import drservice from "../service/doctorservice";
import {jwtDecode} from "jwt-decode";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const COLORS = {
  primary: "#64B5F6",  // Updated to match 0xFF64B5F6
  text: "#000000",
  background: "#ffffff",
  sidebarBg: "#ffffff",
  hover: "#bbdefb",
};

const SideDoctor = () => {
  const [doctorId, setDoctorId] = useState(null);
  const [DoctorImage, setDoctorImage] = useState(null);
  const [DoctorName, setDoctorName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded?.appUserId;
        setDoctorId(id);

        drservice.getDoctorById(id).then((res) => {
          setDoctorImage(`data:image/jpeg;base64,${res.data.image}`);
          setDoctorName(`${res.data.firstname} ${res.data.lastname}`);
        });
      } catch (err) {
        console.error("Error decoding token or fetching doctor:", err);
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
      <button onClick={toggleSidebar} className="sidebar-toggle-btn" aria-label="Toggle sidebar">
        <FaBars />
      </button>

      <nav className={`sidebar-doctor ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar} aria-label="Close sidebar">
          <FaTimes />
        </button>

        {DoctorImage && (
          <div className="sidebar-header">
            <img src={DoctorImage} alt="Doctor" className="sidebar-avatar" />
            <p>{DoctorName}</p>
          </div>
        )}

        <ul className="sidebar-links">
          <li><Link to="/doctor/dashboard">Dashboard</Link></li>
          <li><Link to="/doctor/profile">My Profile</Link></li>
          <li><Link to={`/doctor/chats/${doctorId}`}>Messages</Link></li>
          <li><Link to={`/doctor/getappointments/${doctorId}`}>My Appointments</Link></li>
          <li><Link to={`/doctor/getnotifications/${doctorId}`}>Notifications</Link></li>
          <li><Link to={`/doctor/getavailability/${doctorId}`}>My Availability</Link></li>
          <li><Link to={`/doctor/checkupappoi/${doctorId}`}>Checkup Appointments</Link></li>
        </ul>

        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      <style>{`
        .sidebar-toggle-btn {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 24px;
          background: none;
          border: none;
          color: ${COLORS.primary};
          z-index: 1001;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
        }

        .sidebar-doctor {
          width: 250px;
          background: ${COLORS.sidebarBg};
          color: ${COLORS.text};
          min-height: 100vh;
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          position: fixed;
          top: 0;
          left: -260px;
          height: 100vh;
          z-index: 1000;
          overflow-y: auto;
          transition: left 0.3s ease-in-out;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar-doctor.open {
          left: 0;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          color: ${COLORS.primary};
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
          border: 2px solid ${COLORS.primary};
        }

        .sidebar-header p {
          margin-top: 8px;
          font-weight: 600;
          color: ${COLORS.text};
        }

        .sidebar-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-links li {
          margin-bottom: 10px;
        }

        .sidebar-links a {
          display: block;
          padding: 10px;
          background: ${COLORS.primary};
          color: ${COLORS.text};
          border-radius: 10px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .sidebar-links a:hover {
          background: ${COLORS.hover};
          color: ${COLORS.text};
        }

        .logout-btn {
          background-color: ${COLORS.primary};
          color: ${COLORS.text};
          border: none;
          padding: 10px;
          width: 100%;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.3s;
        }

        .logout-btn:hover {
          background-color: ${COLORS.hover};
        }
      `}</style>
    </>
  );
};

export default SideDoctor;
