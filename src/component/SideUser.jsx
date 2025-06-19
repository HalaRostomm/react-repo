import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userService from "../service/userservice";
import { jwtDecode } from "jwt-decode";
import {
  FaHome, FaUser, FaBell, FaShoppingCart, FaCalendarCheck,
  FaComments, FaPaw, FaListAlt, FaBriefcaseMedical,
  FaBars, FaTimes, FaSignOutAlt, FaStore, FaStethoscope,
  FaServicestack, FaClipboard, FaChevronDown, FaChevronUp
} from "react-icons/fa";

// Inject Tinos font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Tinos&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const SideUser = () => {
  const [userId, setUserId] = useState(null);
  const [UserImage, setUserImage] = useState(null);
  const [UserName, setUserName] = useState("");
  const [productCategories, setProductCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [speciOpen, setSpeciOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded?.appUserId;
        setUserId(id);

        userService.getUserById(id).then((res) => {
          setUserImage(`data:image/jpeg;base64,${res.data.image}`);
          setUserName(`${res.data.firstname} ${res.data.lastname}`);
        });

        userService.getProductCategories().then(res => setProductCategories(res.data));
        userService.getServicesCategories().then(res => setServiceCategories(res.data));
        userService.getSpecializations().then(res => setSpecializations(res.data));
      } catch (err) {
        console.error("Error decoding token or fetching user:", err);
      }
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const DropdownButton = ({ title, icon, isOpen, toggle }) => (
    <div className="sidebar-button" onClick={toggle}>
      {icon}
      {title}
      <span style={{ marginLeft: "auto" }}>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
    </div>
  );

  return (
    <>
      <button onClick={toggleSidebar} className="sidebar-toggle-btn"><FaBars /></button>

      <div className={`sidebar-user ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}><FaTimes /></button>

        {UserImage && (
          <div className="sidebar-header">
            <img src={UserImage} alt="User" className="sidebar-avatar" />
            <p>{UserName}</p>
          </div>
        )}

        <nav className="sidebar-links">
          <Link to="/user/home" className="sidebar-button"><FaHome /> Home</Link>
          <Link to="/user/profile" className="sidebar-button"><FaUser /> My Profile</Link>
          <Link to="/user/geturgentdoctors" className="sidebar-button"><FaBriefcaseMedical /> Urgent</Link>
          <Link to="/user/getpets" className="sidebar-button"><FaPaw /> My Pets</Link>
          <Link to={`/user/getcart/${userId}`} className="sidebar-button"><FaShoppingCart /> My Cart</Link>
          <Link to={`/user/order/${userId}`} className="sidebar-button"><FaListAlt /> My Orders</Link>
          <Link to={`/user/chats/${userId}`} className="sidebar-button"><FaComments /> Chats</Link>
          <Link to={`/user/getuserappointments/${userId}`} className="sidebar-button"><FaCalendarCheck /> Appointments</Link>
          <Link to={`/user/getnotifications/${userId}`} className="sidebar-button"><FaBell /> Notifications</Link>

          <DropdownButton title="Shop Now" icon={<FaStore />} isOpen={shopOpen} toggle={() => setShopOpen(!shopOpen)} />
          {shopOpen && productCategories.map((item, i) => (
            <Link key={i} to={`/user/getproducts/${item}`} className="sidebar-button sidebar-sub">{item}</Link>
          ))}

          <DropdownButton title="Services" icon={<FaServicestack />} isOpen={serviceOpen} toggle={() => setServiceOpen(!serviceOpen)} />
          {serviceOpen && serviceCategories.map((item, i) => (
            <Link key={i} to={`/user/getallservices/${item}`} className="sidebar-button sidebar-sub">{item}</Link>
          ))}

          <DropdownButton title="Doctors" icon={<FaStethoscope />} isOpen={speciOpen} toggle={() => setSpeciOpen(!speciOpen)} />
          {speciOpen && specializations.map((item, i) => (
            <Link key={i} to={`/user/getspecializeddoctors/${item}`} className="sidebar-button sidebar-sub">{item}</Link>
          ))}

          <DropdownButton title="Posts" icon={<FaClipboard />} isOpen={postOpen} toggle={() => setPostOpen(!postOpen)} />
          {postOpen && (
            <>
              <Link to={`/user/getadoptionposts/${userId}`} className="sidebar-button sidebar-sub">Adoption</Link>
              <Link to={`/user/getlostfoundposts/${userId}`} className="sidebar-button sidebar-sub">Lost & Found</Link>
            </>
          )}

          <button onClick={handleLogout} className="logout-btn"><FaSignOutAlt /> Logout</button>
        </nav>
      </div>

      <style>{`
       .sidebar-user {
  width: 260px;
  background: #14213D;
  color: #E5E5E5;
  min-height: 100vh;
  padding: 20px;
  font-family: 'Tinos', serif;
  position: fixed;
  top: 0;
  left: -270px;
  z-index: 1000;
  transition: 0.3s ease-in-out;

  /* 👇 Scroll fix */
  overflow-y: auto;
  max-height: 100vh;
  scrollbar-width: thin;
  scrollbar-color: #FCA311 transparent;
}
        .sidebar-user.open {
          left: 0;
        }
        .sidebar-toggle-btn {
          position: fixed;
          top: 12px;
          left: 12px;
          font-size: 24px;
          background: none;
          border: none;
          color: #FCA311;
          z-index: 1100;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 22px;
          color: #FCA311;
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
          border: 2px solid #FCA311;
        }
        .sidebar-header p {
          margin-top: 8px;
          font-weight: bold;
          color: #FCA311;
        }
        .sidebar-links {
          display: flex;
          flex-direction: column;
        }
        .sidebar-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          color: #FFFFFF;
          background: transparent;
          border-radius: 10px;
          margin-bottom: 10px;
          text-decoration: none;
          font-weight: 600;
          transition: 0.3s;
        }
        .sidebar-button:hover {
          background: #FCA311;
          color: #000000;
        }
        .sidebar-sub {
          margin-left: 20px;
          font-size: 14px;
          background: #E5E5E5;
          color: #14213D;
          padding-left: 10px;
        }
        .sidebar-sub:hover {
          background: #FCA311;
          color: #000000;
        }
        .logout-btn {
          background-color: #FCA311;
          color: #000000;
          border: none;
          padding: 10px;
          width: 100%;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
        }
        .logout-btn:hover {
          background-color: #ffb347;
        }
      `}</style>
    </>
  );
};

export default SideUser;
