import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../service/authService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await authService.login(username, password);
      const userRoles = authService.getUserRole();
      const token = authService.getToken();

      if (!userRoles || userRoles.length === 0 || !token) {
        setError("Role or Token is undefined.");
        return;
      }

      const userRole = userRoles[0]?.authority;
      const BASE_URL = "http://localhost:8080";
      let userDetailsEndpoint = "";
      let updateProfileEndpoint = "";

      switch (userRole) {
        case "ROLE_ADMIN":
          userDetailsEndpoint = `${BASE_URL}/admin/profile`;
          updateProfileEndpoint = "/admin/updateadmin";
          break;
        case "ROLE_DOCTOR":
          userDetailsEndpoint = `${BASE_URL}/doctor/profile`;
          updateProfileEndpoint = "/doctor/updatedoctor";
          break;
        case "ROLE_SP":
          userDetailsEndpoint = `${BASE_URL}/sp/profile`;
          updateProfileEndpoint = "/sp/updatesp";
          break;
        case "ROLE_USER":
          userDetailsEndpoint = `${BASE_URL}/user/profile`;
          updateProfileEndpoint = "/user/updateuser";
          break;
        case "ROLE_PP":
          userDetailsEndpoint = `${BASE_URL}/pp/profile`;
          updateProfileEndpoint = "/pp/updatepp";
          break;
        default:
          navigate("/");
          return;
      }

      const response = await fetch(userDetailsEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const user = await response.json();

      if (!user.firstname || user.firstname.trim() === "") {
        navigate(`${updateProfileEndpoint}/${user.appUserId}`);
      } else {
        navigate(userDetailsEndpoint.replace(BASE_URL, ""));
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("role", JSON.stringify(userRoles));
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back!</h2>
        <p style={styles.subtitle}>Login to your pet care account</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <label htmlFor="username" style={styles.label}>
            Email
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
            placeholder="Enter your username"
          />

          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="Enter your password"
          />

          <button type="submit" style={styles.button}>
            Login
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background:
      "linear-gradient(135deg, #A8E6CF 0%, #DCEDC2 50%, #FFD3B6 100%)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px 30px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    width: "350px",
    textAlign: "center",
  },
  title: {
    color: "#344E41",
    marginBottom: "8px",
    fontWeight: "700",
  },
  subtitle: {
    color: "#6B8E23",
    marginBottom: "25px",
    fontWeight: "500",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    textAlign: "left",
    fontWeight: "600",
    color: "#344E41",
    fontSize: "14px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1.5px solid #A8D5BA",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#FF8C42",
    border: "none",
    color: "#fff",
    padding: "14px 0",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 5px 12px rgba(255,140,66,0.5)",
    transition: "background-color 0.3s ease",
  },
  error: {
    marginTop: "15px",
    color: "#d93025",
    fontWeight: "600",
  },
};

export default Login;
