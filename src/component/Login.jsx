import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../service/authService";
import { FaEnvelope, FaLock } from "react-icons/fa";
import logo from "../assets/pawnoback.gif";

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

      if (!response.ok) throw new Error("Failed to fetch user details");

      const user = await response.json();
      if (!user.firstname || user.firstname.trim() === "") {
        navigate(`${updateProfileEndpoint}/${user.appUserId}`);
      } else {
        switch (userRole) {
          case "ROLE_ADMIN":
            navigate("/admin/admindashboard"); break;
          case "ROLE_DOCTOR":
            navigate("/doctor/dashboard"); break;
          case "ROLE_SP":
            navigate("/sp/dashboard"); break;
          case "ROLE_USER":
            navigate("/user/home"); break;
          case "ROLE_PP":
            navigate("/pp/dashboard"); break;
          default:
            navigate("/");
        }
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
      <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
      <div style={styles.innerWrapper}>
        <img src={logo} alt="logo" style={styles.bigLogo} />

        <div style={styles.card}>
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputWrapper}>
              <FaEnvelope color="#FFA100" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="enter your email"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputWrapper}>
              <FaLock color="#FFA100" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter your password"
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.button}>Login</button>
            <p style={styles.register}>
              Don’t have an account? <a href="/register" style={styles.registerLink}>Register</a>
            </p>
            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#ffffff",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  innerWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "70px",
  },
  bigLogo: {
    width: "450px",
    height: "450px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "40px",
    width: "400px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #A8D5BA",
    borderRadius: "14px",
    padding: "12px 16px",
    gap: "10px",
    backgroundColor: "#fff",
  },
  input: {
    border: "none",
    outline: "none",
    fontSize: "15px",
    flex: 1,
    fontFamily: "'Poppins', sans-serif",
  },
  button: {
    backgroundColor: "#FFA100",
    color: "#fff",
    border: "none",
    padding: "14px 0",
    fontSize: "17px",
    fontWeight: "bold",
    borderRadius: "14px",
    cursor: "pointer",
    marginTop: "6px",
  },
  register: {
    fontSize: "14px",
    marginTop: "10px",
    color: "#000",
  },
  registerLink: {
    color: "#13b6b9",
    fontWeight: "bold",
    textDecoration: "none",
  },
  error: {
    marginTop: "14px",
    color: "#d93025",
    fontWeight: "600",
  },
};

export default Login;
