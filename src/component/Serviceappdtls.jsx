import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";
import dayjs from "dayjs";
import {jwtDecode} from "jwt-decode";
const Serviceappdtls = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
const [userId, setUserId] = useState(null);

useEffect(() => {
  const loadUser = async () => {
    const token = await authService.getToken();
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.appUserId) setUserId(decoded.appUserId);
    }
  };
  loadUser();
}, []);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = await authService.getToken();
        if (!token) {
          setMessage("No authentication token found.");
          setLoading(false);
          return;
        }

        const response = await userService.getAppointmentById(id, token);
        setAppointment(response.data);
      } catch (error) {
        console.error("Failed to fetch appointment:", error);
        setMessage("Failed to fetch appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);


const handleUnbookAppointment = async () => {
  const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
  if (!confirmed) return;

  try {
    const token = await authService.getToken();
    const response = await userService.unbookAppointment(appointment.appointmentId, token);

    // Axios response check (no .ok)
    if (response.status === 200) {
      alert("Appointment cancelled successfully.");
    navigate(`/user/getuserappointments/${userId}`);
    } else {
      console.error("Unexpected response status:", response.status);
      alert("Failed to cancel appointment.");
    }
  } catch (error) {
    console.error("Unbooking error:", error);
    alert("Failed to cancel the appointment.");
  }
};














  if (loading) return <p style={styles.loading}>Loading appointment details...</p>;
  if (message) return <div style={styles.alert}>{message}</div>;
  if (!appointment) return <p>No appointment details found.</p>;

  const appointmentEnd = dayjs(`${appointment.selectedDate} ${appointment.endTime}`, [
    "YYYY-MM-DD hh:mm A", 
    "YYYY-MM-DD HH:mm"
  ]);
  const isFutureAppointment = appointmentEnd.isAfter(dayjs());

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
        rel="stylesheet"
      />
      <div style={styles.container}>
        <h2 style={styles.heading}>
          Appointment Details (ID: {appointment.appointmentId})
        </h2>
        <table style={styles.table}>
          <tbody>
            <DataRow label="Appointment ID" value={appointment.appointmentId} />
            <DataRow label="Duration" value={`${appointment.duration} mins`} />
            <DataRow label="Time" value={`${appointment.startTime} - ${appointment.endTime}`} />
            <DataRow label="Selected Date" value={appointment.selectedDate} />
            <DataRow label="Type" value={appointment.type} />
            
            <DataRow label="Service Name" value={appointment.service?.name} />
            <DataRow label="Pet Name" value={appointment.pet?.petName} />
          </tbody>
        </table>

        {isFutureAppointment && (
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <button
              onClick={() =>
                navigate(
                  `/user/rescheduleserviceappointment/${appointment.appointmentId}/${appointment.service?.serviceId}`
                )
              }
              style={styles.rescheduleButton}
            >
              Reschedule Appointment
            </button>
            <button
        onClick={handleUnbookAppointment}
        style={{ ...styles.rescheduleButton, backgroundColor: "#ff4d4d", marginLeft: "12px" }}
      >
        Cancel Appointment
      </button>
          </div>
        )}
      </div>
    </>
  );
};

// Helper component
const DataRow = ({ label, value }) => (
  <tr>
    <th style={styles.th}>{label}</th>
    <td style={styles.td}>{value}</td>
  </tr>
);

// Updated styles with your color scheme and font
const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "rgba(19, 182, 185, 0.2)", // #13B6B9 with 20% opacity
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Poppins', sans-serif",
    color: "#000000",
  },
  heading: {
    textAlign: "center",
    backgroundColor: "#13B6B9",
    color: "#000000",
    marginBottom: "30px",
    fontWeight: "700",
    fontSize: "28px",
    padding: "1rem 0",
    borderRadius: 8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "18px",
  },
  th: {
    textAlign: "left",
    backgroundColor: "#FFA100",
    color: "#000000",
    padding: "12px",
    fontWeight: "700",
    width: "40%",
    border: "1px solid #ccc",
  },
  td: {
    padding: "12px",
    backgroundColor: "#E5E5E5",
    border: "1px solid #ccc",
    color: "#000000",
  },
  alert: {
    backgroundColor: "#ffe6e6",
    color: "#b30000",
    padding: "12px",
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "'Poppins', sans-serif",
    borderLeft: "5px solid #ff4d4d",
    borderRadius: "8px",
  },
  loading: {
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    marginTop: "50px",
    fontSize: "18px",
  },
  rescheduleButton: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "bold",
    backgroundColor: "#FFA100",
    border: "none",
    color: "#000000",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Serviceappdtls;
