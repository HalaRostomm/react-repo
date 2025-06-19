import React, { useEffect, useState } from "react";
import userservice from "../service/userservice";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import authService from "../service/authService";

const Services = () => {
  const { category } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [appUserId, setAppUserId] = useState(null);

  useEffect(() => {
    fetchAppUserId();
  }, []);

  const fetchAppUserId = async () => {
    try {
      const token = await authService.getToken();
      if (!token) throw new Error("Token not found");
      const decodedToken = jwtDecode(token);
      if (!decodedToken.appUserId) throw new Error("User ID not in token");
      setAppUserId(decodedToken.appUserId);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  useEffect(() => {
    userservice
      .getAllServices(category)
      .then((response) => {
        setServices(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch services.");
        setLoading(false);
      });
  }, [category]);

  const viewDetails = (serviceId) => {
    navigate(`/user/getservice/${serviceId}`);
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading services...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tinos&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          font-family: 'Tinos', serif;
          background-color: #E5E5E5;
          margin: 0;
          padding: 0;
          color: #000000;
        }

        .container {
          max-width: 700px;
          margin: 2rem auto;
          padding: 2rem;
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(20, 33, 61, 0.1);
        }

        h2 {
          color: #14213D;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          text-align: center;
          letter-spacing: 0.5px;
        }

        ul {
          list-style-type: none;
          padding-left: 0;
          margin: 0;
        }

        li.service-item {
          border: 1px solid #E5E5E5;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin-bottom: 1.25rem;
          background-color: #F8F9FA;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          cursor: pointer;
        }

        li.service-item:hover {
          box-shadow: 0 6px 16px rgba(252, 163, 17, 0.25);
          background-color: #ffffff;
          transform: translateY(-2px);
        }

        li strong {
          font-size: 1.3rem;
          color: #14213D;
          margin-bottom: 0.4rem;
        }

        li p {
          margin: 0.4rem 0 1rem 0;
          color: #333;
          font-weight: 600;
          font-size: 1rem;
        }

        .btn-view {
          padding: 0.5rem 1.2rem;
          font-weight: 700;
          font-size: 1rem;
          color: #FFFFFF;
          background-color: #FCA311;
          border: none;
          border-radius: 8px;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 10px rgba(252, 163, 17, 0.35);
          user-select: none;
        }

        .btn-view:hover {
          background-color: #d18a09;
          box-shadow: 0 6px 16px rgba(209, 138, 9, 0.5);
        }

        .loading-container, .error-message {
          max-width: 400px;
          margin: 3rem auto;
          text-align: center;
          font-weight: 700;
          font-size: 1.25rem;
          font-family: 'Tinos', serif;
          color: #14213D;
        }

        .spinner {
          margin: 0 auto 1rem auto;
          width: 40px;
          height: 40px;
          border: 4px solid #14213D;
          border-top: 4px solid #FCA311;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .container {
            margin: 1rem 1rem;
            padding: 1rem;
          }

          h2 {
            font-size: 1.5rem;
          }

          .btn-view {
            padding: 0.4rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="container" role="main" aria-live="polite">
        <h2>Available Services</h2>
        {services.length === 0 ? (
          <p>No services available.</p>
        ) : (
          <ul>
            {services.map((service) => {
              const id = service.id || service.serviceId || service.someUniqueId;
              return (
                <li
                  className="service-item"
                  key={id}
                  tabIndex={0}
                  aria-label={`Service: ${service.name || service.serviceName}`}
                >
                  <strong>{service.name || service.serviceName}</strong>
                  <p>
                    <strong>By:</strong> {service.serviceProvider.firstname}{" "}
                    {service.serviceProvider.lastname}
                  </p>
                  <button
                    className="btn-view"
                    onClick={() => viewDetails(id)}
                    aria-describedby={`service-${id}-details`}
                  >
                    View Details
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {message && (
          <div className="error-message" role="alert" style={{ color: "crimson" }}>
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default Services;
