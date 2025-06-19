import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ppservice from "../service/ppservice";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBoxOpen,
  FaUserCircle,
  FaBell,
  FaClipboardList
} from "react-icons/fa";

const SidePP = () => {
  const [ppId, setPpId] = useState(null);
  const [ppImage, setPpImage] = useState(null);
  const [ppName, setPpName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded?.appUserId;
        setPpId(id);

        ppservice.getPPById(id).then((res) => {
          setPpImage(`data:image/jpeg;base64,${res.data.image}`);
          setPpName(`${res.data.firstname} ${res.data.lastname}`);
        });
      } catch (err) {
        console.error("Error decoding token or fetching PP:", err);
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

      <div className={`sidebar-pp ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>

        {ppImage && (
          <div className="sidebar-header">
            <img src={ppImage} alt="PP" className="sidebar-avatar" />
            <p>{ppName}</p>
          </div>
        )}

        <ul className="sidebar-links">
          <li><Link to="/pp/dashboard"><FaTachometerAlt /> Dashboard</Link></li>
          <li><Link to="/pp/getallproducts"><FaBoxOpen /> Product List</Link></li>
          <li><Link to="/pp/profile"><FaUserCircle /> My Profile</Link></li>
          <li><Link to={`/pp/getnotifications/${ppId}`}><FaBell /> Notifications</Link></li>
          <li><Link to={`/pp/getorders/${ppId}`}><FaClipboardList /> Orders</Link></li>
        </ul>

        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt style={{ marginRight: 8 }} /> Logout
        </button>
      </div>

      <style>{`
        .sidebar-pp {
          width: 250px;
          background: #F1EADC;
          color: #000000;
          min-height: 100vh;
          padding: 20px;
          font-family: 'Roboto Slab', serif;
          position: fixed;
          top: 0;
          left: -260px;
          z-index: 1000;
          overflow-y: auto;
          transition: 0.3s ease-in-out;
        }
        .sidebar-pp.open {
          left: 0;
        }
        .sidebar-toggle-btn {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 24px;
          background: none;
          border: none;
          color: #7F7B72;
          z-index: 1001;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          color: #7F7B72;
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
          border: 2px solid #E5DED4;
        }
        .sidebar-header p {
          margin-top: 8px;
          font-weight: bold;
          color: #7F7B72;
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
          padding: 10px 12px;
          color: #F7F0E0;
          background-color: #7F7B72;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
        }
        .sidebar-links a:hover {
          background-color: #F7F0E0;
          color: #000000;
        }
        .logout-btn {
          background-color: #E5DED4;
          color: #000000;
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
        }
        .logout-btn:hover {
          background-color: #7F7B72;
          color: #F7F0E0;
        }
      `}</style>
    </>
  );
};

export default SidePP;
