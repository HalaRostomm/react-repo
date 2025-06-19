import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";
import dayjs from "dayjs";

const Vetappdtls = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [resolvedAddress, setResolvedAddress] = useState('');

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
useEffect(() => {
  if (
    appointment?.doctor?.address &&
    appointment.doctor.address.includes(',')
  ) {
    const [longitude, latitude] = appointment.doctor.address
      .split(',')
      .map(Number);

    const fetchAddressFromCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        setResolvedAddress(data.display_name);
      } catch (error) {
        setResolvedAddress('Address: ' + appointment.doctor.address);
      }
    };

    fetchAddressFromCoordinates();
  }
}, [appointment]);
  

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
        href="https://fonts.googleapis.com/css2?family=Tinos&display=swap"
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
            <DataRow label="Price" value={`${appointment.price} $`} />
            <DataRow label="Dr Name" value={`${appointment.doctor?.firstname} ${appointment.doctor?.lastname}`} />
<DataRow label="Dr Address" value={resolvedAddress || appointment.doctor?.address} />

            <DataRow label="Pet Name" value={appointment.pet?.petName} />
          </tbody>
        </table>

        {isFutureAppointment && (
          <div className="text-end mt-3">
            <button
              className="btn"
              onClick={() =>
                navigate(`/user/rescheduleappointment/${appointment.appointmentId}/${appointment.doctor?.appUserId}`)
              }
              style={styles.rescheduleButton}
            >
              Reschedule Appointment
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const DataRow = ({ label, value }) => (
  <tr>
    <th style={styles.th}>{label}</th>
    <td style={styles.td}>{value}</td>
  </tr>
);

// 🎨 Updated styles with your color scheme and Tinos font
const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Tinos', serif",
    color: "#000000",
  },
  heading: {
    textAlign: "center",
    color: "#14213D",
    marginBottom: "30px",
    fontWeight: "700",
    fontSize: "28px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "18px",
  },
  th: {
    textAlign: "left",
    backgroundColor: "#FCA311",
    color: "#FFFFFF",
    padding: "12px",
    fontWeight: "700",
    width: "40%",
    border: "1px solid #ccc",
  },
  td: {
    padding: "12px",
    backgroundColor: "#E5E5E5",
    border: "1px solid #ccc",
    color: "#14213D",
  },
  alert: {
    backgroundColor: "#ffe6e6",
    color: "#b30000",
    padding: "12px",
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "'Tinos', serif",
    borderLeft: "5px solid #ff4d4d",
    borderRadius: "8px",
  },
  loading: {
    textAlign: "center",
    fontFamily: "'Tinos', serif",
    marginTop: "50px",
    fontSize: "18px",
  },
  rescheduleButton: {
    fontFamily: "'Tinos', serif",
    fontWeight: "bold",
    backgroundColor: "#FCA311",
    border: "none",
    color: "#FFFFFF",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default Vetappdtls;
