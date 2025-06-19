import React from "react";
import { useNavigate } from "react-router-dom";
import download from "../assets/animals.jpg";

// then use <img src={petImage} ... />

const Home = () => {
  const navigate = useNavigate();

  const buttonStyle = {
    padding: "16px 50px",
    margin: "15px 0",
    fontSize: "20px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#fff",
    minWidth: "180px",
    fontWeight: "700",
    boxShadow: "0 5px 12px rgba(0,0,0,0.18)",
    transition: "background-color 0.3s ease",
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #A8E6CF 0%, #DCEDC2 50%, #FFD3B6 100%)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "40px 60px",
        boxSizing: "border-box",
      }}
    >
      {/* Welcome Heading */}
      <h1
        style={{
          color: "#344E41",
          marginBottom: "60px",
          fontWeight: "800",
          fontSize: "42px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        Welcome to PAW!
      </h1>

      {/* Main content: sentences left, buttons right */}
      <div
        style={{
          display: "flex",
          gap: "80px",
          maxWidth: "900px",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
       <div
  style={{
    maxWidth: "460px",
    color: "#344E41",
    fontSize: "18px",
    lineHeight: "1.6",
    fontWeight: "600",
    userSelect: "none",
  }}
>
  <img src={download} alt="Download" style={{ width: "300px" }} />
  <p style={{ marginBottom: "16px" }}>
    Join our pet care community, <strong>We Provide </strong>:
  </p>
  <ul style={{ marginLeft: "20px", marginBottom: "24px" }}>
    <li>Urgent application</li>
    <li>Vets</li>
    <li>Services</li>
    <li>Food, Medicine, Toys..</li>
  </ul>
  <p>
    Trusted teams — <br />
    all your pet’s needs covered under one platform.
  </p>
</div>
        {/* Right side - Login/Register buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#6B8E23",
            }}
            onClick={() => navigate("/login")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#577020")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#6B8E23")
            }
          >
            Login
          </button>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#FF8C42",
            }}
            onClick={() => navigate("/register")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#cc722e")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#FF8C42")
            }
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
