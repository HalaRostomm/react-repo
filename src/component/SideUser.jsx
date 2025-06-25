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

// Inject Poppins font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const SideUser = () => {
  const [userId, setUserId] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [categories, setCategories] = useState({
    product: [],
    service: [],
    specialization: []
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [speciOpen, setSpeciOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
const deduplicate = (arr) => [...new Set(arr)];
const deduplicateByKey = (arr) => {
  const map = new Map();
  arr.forEach(item => {
    if (!map.has(item.key)) {
      map.set(item.key, item);
    }
  });
  return Array.from(map.values());
};
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const id = decoded?.appUserId;
        setUserId(id);

        // Fetch user data and categories in parallel
        const [userRes, productRes, serviceRes, speciRes] = await Promise.all([
          userService.getUserById(id),
          userService.getProductCategories(),
          userService.getServicesCategories(),
          userService.getSpecializations()
        ]);
console.log("Specializations from backend:", speciRes.data);

        setUserImage(`data:image/jpeg;base64,${userRes.data.image}`);
        setUserName(`${userRes.data.firstname} ${userRes.data.lastname}`);
        
      setCategories({
  product: deduplicate(productRes.data),
  service: deduplicate(serviceRes.data),
specialization: deduplicate(speciRes.data),
});


      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const DropdownButton = ({ title, icon, isOpen, toggle, children }) => (
    <>
      <div className="sidebar-button" onClick={toggle}>
        {icon}
        {title}
        <span style={{ marginLeft: "auto" }}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      {isOpen && children}
    </>
  );

  if (isLoading) {
    return (
      <button onClick={toggleSidebar} className="sidebar-toggle-btn">
        <FaBars />
      </button>
    );
  }

  return (
    <>
      <button onClick={toggleSidebar} className="sidebar-toggle-btn">
        <FaBars />
      </button>

      <div className={`sidebar-user ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>

        {userImage && (
          <div className="sidebar-header">
            <img src={userImage} alt="User" className="sidebar-avatar" />
            <p>{userName}</p>
          </div>
        )}

        <nav className="sidebar-links">
          <Link to="/user/home" className="sidebar-button">
            <FaHome /> Home
          </Link>
          <Link to="/user/profile" className="sidebar-button">
            <FaUser /> My Profile
          </Link>
          <Link to="/user/geturgentdoctors" className="sidebar-button">
            <FaBriefcaseMedical /> Urgent
          </Link>
          <Link to="/user/getpets" className="sidebar-button">
            <FaPaw /> My Pets
          </Link>
          <Link to={`/user/getcart/${userId}`} className="sidebar-button">
            <FaShoppingCart /> My Cart
          </Link>
          <Link to={`/user/order/${userId}`} className="sidebar-button">
            <FaListAlt /> My Orders
          </Link>
          <Link to={`/user/chats/${userId}`} className="sidebar-button">
            <FaComments /> Chats
          </Link>
          <Link to={`/user/getuserappointments/${userId}`} className="sidebar-button">
            <FaCalendarCheck /> Appointments
          </Link>
          <Link to={`/user/getnotifications/${userId}`} className="sidebar-button">
            <FaBell /> Notifications
          </Link>

          <DropdownButton
            title="Shop Now"
            icon={<FaStore />}
            isOpen={shopOpen}
            toggle={() => setShopOpen(!shopOpen)}
          >{categories.product.map((item) => (
  <Link
    key={item} // unique key
    to={`/user/getproducts/${item}`}
    className="sidebar-button sidebar-sub"
  >
    {item}
  </Link>
))}

          </DropdownButton>

          <DropdownButton
            title="Services"
            icon={<FaServicestack />}
            isOpen={serviceOpen}
            toggle={() => setServiceOpen(!serviceOpen)}
          >
           {categories.service.map((item) => (
  <Link key={item} to={`/user/getallservices/${item}`} className="sidebar-button sidebar-sub">
    {item}
  </Link>
))}

          </DropdownButton>

          <DropdownButton
            title="Doctors"
            icon={<FaStethoscope />}
            isOpen={speciOpen}
            toggle={() => setSpeciOpen(!speciOpen)}
          >
            {categories.specialization.map((item) => (
  <Link key={item} to={`/user/getspecializeddoctors/${item}`} className="sidebar-button sidebar-sub">
    {item}
  </Link>
))}

          </DropdownButton>

          <DropdownButton
            title="Posts"
            icon={<FaClipboard />}
            isOpen={postOpen}
            toggle={() => setPostOpen(!postOpen)}
          >
            <Link to={`/user/getadoptionposts/${userId}`} className="sidebar-button sidebar-sub">
              Adoption
            </Link>
            <Link to={`/user/getlostfoundposts/${userId}`} className="sidebar-button sidebar-sub">
              Lost & Found
            </Link>
          </DropdownButton>

          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      <style>{`
        .sidebar-user {
          width: 260px;
          background: #14213D;
          color: #E5E5E5;
          min-height: 100vh;
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          position: fixed;
          top: 0;
          left: -270px;
          z-index: 1000;
          transition: 0.3s ease-in-out;
          overflow-y: auto;
          max-height: 100vh;
          scrollbar-width: thin;
          scrollbar-color: #3FEDF1 transparent;
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
          color: #3FEDF1;
          z-index: 1100;
          cursor: pointer;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 22px;
          color: #3FEDF1;
          cursor: pointer;
        }
        .sidebar-header {
          text-align: center;
          margin-bottom: 20px;
          color: #3FEDF1;
        }
        .sidebar-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #3FEDF1;
        }
        .sidebar-header p {
          margin-top: 8px;
          font-weight: 600;
          color: #3FEDF1;
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
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .sidebar-button:hover {
          background: #3FEDF1;
          color: #000000;
        }
        .sidebar-sub {
          margin-left: 20px;
          font-size: 14px;
          background: rgba(63, 237, 241, 0.22);
          color: #FFFFFF;
          padding-left: 10px;
        }
        .sidebar-sub:hover {
          background: #3FEDF1;
          color: #000000;
        }
        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: #3FEDF1;
          color: #000000;
          border: none;
          padding: 10px;
          width: 100%;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
          transition: background-color 0.2s ease;
        }
        .logout-btn:hover {
          background-color: #88f8fc;
        }
      `}</style>
    </>
  );
};

export default SideUser;