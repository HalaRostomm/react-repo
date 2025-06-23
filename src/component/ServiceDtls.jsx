import React, { useEffect, useState } from "react";
import userservice from "../service/userservice";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import authService from "../service/authService";

const ServiceDtls = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [appUserId, setAppUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchAppUserId();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const response = await userservice.getServiceById(id);
        setService(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load service.");
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const goToAppointments = (serviceId) => {
    navigate(`/user/getserviceappointments/${serviceId}`);
  };

  const goToReviews = (serviceId) => {
    navigate(`/user/getservicereviews/${serviceId}`);
  };

  const handleMessageSp = (serviceProviderId) => {
    if (!appUserId || !serviceProviderId) {
      alert("Missing user or provider ID");
      return;
    }

    if (appUserId === serviceProviderId) {
      alert("You cannot message yourself.");
      return;
    }

    navigate(`/chat/${serviceProviderId}/${appUserId}/null`);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading service...</p></div>;
  if (error) return <div className="error-message"><p>{error}</p></div>;
  if (!service) return <p>No service info available.</p>;

  return (
    <>
     <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #E5E5E5;
    margin: 0;
    padding: 0;
    color: #000000;
  }

  .container {
    max-width: 650px;
    margin: 2.5rem auto;
    background: rgba(19, 182, 185, 0.2); /* #13b6b9 with 20% opacity */
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 6px 18px rgba(20, 33, 61, 0.12);
  }

  h2 {
    color: #13b6b9; /* header color */
    font-weight: 700;
    font-size: 2rem;
    margin-bottom: 1.2rem;
    text-align: center;
  }

  p {
    font-size: 1.1rem;
    margin: 0.6rem 0;
    line-height: 1.5;
    color: #000000; /* black text */
  }

  strong {
    color: #13b6b9;
  }

  .btn-group {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }

  button {
    background-color: #ffa100; /* orange buttons */
    border: none;
    border-radius: 8px;
    color: #000000;
    font-weight: 700;
    padding: 0.6rem 1.3rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 161, 0, 0.25);
  }

  button:hover {
    background-color: #cc8300; /* darker orange */
    box-shadow: 0 6px 16px rgba(204, 131, 0, 0.5);
  }

  .btn-success {
    background-color: #13b6b9;
    color: #FFFFFF;
  }

  .btn-success:hover {
    background-color: #0f8d93; /* slightly darker teal */
  }

  .loading-container, .error-message {
    max-width: 400px;
    margin: 3rem auto;
    text-align: center;
    font-weight: 700;
    font-size: 1.25rem;
    font-family: 'Poppins', sans-serif;
    color: #13b6b9;
  }

  .spinner {
    margin: 0 auto 1rem;
    width: 40px;
    height: 40px;
    border: 4px solid #13b6b9;
    border-top: 4px solid #ffa100;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 480px) {
    .container {
      margin: 1rem;
      padding: 1rem;
    }

    h2 {
      font-size: 1.6rem;
    }

    button {
      padding: 0.5rem 1rem;
      font-size: 0.95rem;
    }
  }
`}</style>

      <main className="container" role="main" aria-live="polite">
        <h2>{service.name}</h2>

        <p><strong>By:</strong> {service.serviceProvider.firstname} {service.serviceProvider.lastname}</p>

        <img
          src={
            service.serviceProvider.image
              ? `data:image/jpeg;base64,${service.serviceProvider.image}`
              : '/default-avatar.jpg'
          }
          alt={`${service.serviceProvider.firstname} ${service.serviceProvider.lastname}`}
          style={{
            width: 100,
            height: 100,
            objectFit: "cover",
            borderRadius: "50%",
            border: "3px solid #FCA311",
            display: "block",
            margin: "1rem auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
        />

        <p><strong>Description:</strong> {service.description}</p>
        <p><strong>Price:</strong> ${service.price}</p>
      <p>
  <strong>Category:</strong>{" "}
  {service.serviceCategory?.MSCategory
    ? Object.values(service.serviceCategory.MSCategory).join(", ")
    : "Unknown"}
</p>



        <div className="btn-group">
          <button onClick={() => goToAppointments(service.serviceId)}>See Appointments</button>
          <button onClick={() => goToReviews(service.serviceId)}>See Reviews</button>
          <button className="btn-success" onClick={() => handleMessageSp(service.serviceProvider.appUserId)}>
            Message
          </button>
        </div>

        {message && (
          <div className="error-message" role="alert" style={{ color: "red", marginTop: "1rem" }}>
            {message}
          </div>
        )}
      </main>
    </>
  );
};

export default ServiceDtls;
