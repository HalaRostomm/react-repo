import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SideAdmin from "./SideAdmin";
import SideDoctor from "./SideDoctor";
import SidePP from "./SidePP";
import SideSP from "./SideSP";
import SideUser from "./SideUser";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        const userRole = Array.isArray(decodedToken.role)
          ? decodedToken.role[0].authority
          : null;
        setRole(userRole);
        setUserId(decodedToken.appUserId);
      } catch (error) {
        console.error("Token decoding failed:", error);
        setIsAuthenticated(false);
        setRole(null);
      }
    }
  }, []);

  const renderSidebar = () => {
    if (!isAuthenticated || !role || !userId) return null;
    switch (role) {
      case "ROLE_ADMIN":
        return <SideAdmin adminId={userId} />;
      case "ROLE_DOCTOR":
        return <SideDoctor doctorId={userId} />;
      case "ROLE_PP":
        return <SidePP ppId={userId} />;
      case "ROLE_SP":
        return <SideSP spId={userId} />;
      case "ROLE_USER":
        return <SideUser userId={userId} />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderSidebar()}
    </>
  );
};

export default Navbar;
