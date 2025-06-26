import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";

const SpAppoi = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await authService.getToken();
        const user = authService.decodeToken(token);
        setCurrentUser(user);

        if (!serviceId) {
          setMessage("❌ Service ID is not specified.");
          return;
        }

        const response = await userService.getServiceAppointments(serviceId);

        const today = new Date().toISOString().split("T")[0];
        const futureAppointments = response.data.filter(
          (appointment) => appointment.selectedDate >= today
        );

        if (futureAppointments.length > 0) {
          setAppointments(futureAppointments);
          setMessage("");
        } else {
          setMessage("⚠️ No upcoming appointments available.");
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("❌ Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const handleBookAppointment = (appointmentId) => {
    if (!currentUser) {
      alert("Please login to book an appointment");
      return;
    }
    navigate(
      `/confirmservicebooking/${currentUser.appUserId}/${serviceId}/${appointmentId}`
    );
  };

  return (
    <>
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

  * {
    box-sizing: border-box;
  }

  .container {
    max-width: 900px; /* increased container size */
    margin: 2rem auto;
    padding: 2rem;
    font-family: 'Poppins', sans-serif;
    background: rgba(19, 182, 185, 0.2); /* #13b6b9 with 20% opacity */
    border-radius: 15px;
    box-shadow: 0 6px 18px rgba(20, 33, 61, 0.15);
    color: #000000; /* black text */
  }

  h2 {
    text-align: center;
    font-weight: 700;
    font-size: 2.3rem;
    color: #13b6b9; /* header color */
    margin-bottom: 1.5rem;
    letter-spacing: 1.2px;
  }

  .message {
    text-align: center;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    color: #ffa100; /* orange */
  }

  .message.error {
    color: #FF4C4C;
  }

  .loading {
    text-align: center;
    font-size: 1.2rem;
    color: #000000; /* black */
    margin: 2rem 0;
    font-weight: 700;
  }

  table {
    width: 100%; /* changed from 150% for better responsiveness */
    border-collapse: collapse;
    font-size: 1.1rem;
    color: #000000; /* black */
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border-radius: 10px;
    overflow: hidden;
  }

  thead {
    background-color: #E5E5E5;
    font-weight: 700;
  }

  /* Make date, start time, etc. same color as buttons */
  thead th {
    color: #ffa100;
  }

  th, td {
    padding: 0.75rem 1rem;
    text-align: center;
    border-bottom: 1px solid #ccc;
  }

  tbody tr:hover {
    background-color: #f0f8fa;
    transition: background-color 0.3s ease;
  }

  button {
    background-color: #ffa100; /* orange buttons */
    color: #ffffff;
    border: none;
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 4px 10px rgba(255, 161, 0, 0.4);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    user-select: none;
  }

  button:hover {
    background-color: #cc8300; /* darker orange */
    box-shadow: 0 6px 16px rgba(204, 131, 0, 0.6);
  }

  @media (max-width: 600px) {
    .container {
      padding: 1rem;
      margin: 1rem;
    }

    h2 {
      font-size: 1.8rem;
    }

    th, td {
      padding: 0.5rem 0.6rem;
      font-size: 1rem;
    }

    button {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
  }
`}</style>



      <div className="container" role="main" aria-live="polite">
        <h2>📅 Available Service Appointments</h2>
        {message && (
          <div className={`message ${message.startsWith("❌") ? "error" : ""}`}>
            {message}
          </div>
        )}
        {loading ? (
          <div className="loading">🔄 Loading appointments...</div>
        ) : appointments.length > 0 ? (
          <table aria-label="Available appointments table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.appointmentId || index}>
                  <td>{index + 1}</td>
                  <td>{appointment.selectedDate}</td>
                  <td>{appointment.startTime}</td>
                  <td>{appointment.endTime}</td>
                  <td>{appointment.service?.price} $</td>
                  <td>
                    <button
                      onClick={() =>
                        handleBookAppointment(appointment.appointmentId)
                      }
                      aria-label={`Book appointment on ${appointment.selectedDate} from ${appointment.startTime} to ${appointment.endTime}`}
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && (
            <div className="message" role="alert">
              ⚠️ No appointments available.
            </div>
          )
        )}
      </div>
    </>
  );
};

export default SpAppoi;
