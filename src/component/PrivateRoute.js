import React from "react";
import { Route, Navigate } from "react-router-dom";
import authService from "../service/authService"; // Import AuthService to check token

const PrivateRoute = ({ element: Component, allowedRoles, role, ...rest }) => {
  const token = authService.getToken();
  const userRole = authService.getUserRole();

  if (!token || !userRole) {
    // If no token or role, redirect to login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // If the user does not have permission for the role, redirect to the home page
    return <Navigate to="/" />;
  }

  // If token exists and role is allowed, render the component
  return <Route {...rest} element={Component} />;
};

export default PrivateRoute;
