import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import drservice from "../service/doctorservice";
import { jwtDecode } from "jwt-decode";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

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
      <button onClick={toggleSidebar} className="sidebar-toggle-btn">
        <FaBars />
      </button>

      <div className={`sidebar-doctor ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}><FaTimes /></button>

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
      </div>

      <style>{`
        .sidebar-toggle-btn {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 24px;
          background: none;
          border: none;
          color: #E0E1DD;
          z-index: 1001;
        }

        .sidebar-doctor {
          width: 250px;
          background: #0D1B2A;
          color: #E0E1DD;
          min-height: 100vh;
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          position: fixed;
          top: 0;
          left: -260px;
          height: 100vh;
          z-index: 1000;
          overflow-y: auto;
          transition: 0.3s ease-in-out;
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
          color: #E0E1DD;
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
          border: 2px solid #778DA9;
        }

        .sidebar-header p {
          margin-top: 8px;
          font-weight: bold;
          color: #778DA9;
        }

        .sidebar-links {
          list-style: none;
          padding: 0;
        }

        .sidebar-links li {
          margin-bottom: 10px;
        }

        .sidebar-links a {
          display: block;
          padding: 10px;
          background: #1B263B;
          color: #E0E1DD;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 500;
        }

        .sidebar-links a:hover {
          background: #415A77;
          color: #E0E1DD;
        }

        .logout-btn {
          background-color: #415A77;
          color: #E0E1DD;
          border: none;
          padding: 10px;
          width: 100%;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
        }

        .logout-btn:hover {
          background-color: #778DA9;
        }
      `}</style>
    </>
  );
};

export default SideDoctor;
