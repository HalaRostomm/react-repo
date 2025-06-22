import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import doctorService from "../service/doctorservice";
import authService from "../service/authService";
import { jwtDecode } from "jwt-decode";

const COLORS = {
  primary: "#64B5F6",     // Light blue
  background: "#FFFFFF",  // White background
  card: "#F3F6FA",         // Light card background
  text: "#000000",        // Black text
  warning: "#f0ad4e",     // Orange for Edit
  danger: "#d9534f",      // Red for Delete
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [appUserId, setAppUserId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [bookedDaysMap, setBookedDaysMap] = useState({});

  useEffect(() => {
    fetchAppUserId();
  }, []);

  useEffect(() => {
    if (appUserId) {
      fetchAppointments();
    }
  }, [appUserId]);

  const fetchAppUserId = async () => {
    try {
      const token = await authService.getToken();
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.appUserId) {
          setAppUserId(decodedToken.appUserId);
        } else {
          setMessage("❌ Doctor ID not found.");
        }
      } else {
        setMessage("❌ No token found.");
      }
    } catch (error) {
      setMessage("❌ Failed to fetch doctor ID.");
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = await authService.getToken();
      const response = await doctorService.getAppointments(appUserId, token);
      const allAppointments = response.data;
      setAppointments(allAppointments);

      const bookedResponse = await doctorService.getBookedAppointments(appUserId, token);
      const bookedAppointments = bookedResponse.data;

      const dayMap = {};
      bookedAppointments.forEach((a) => {
        if (a.selectedDate) {
          const day = new Date(a.selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
          });
          dayMap[a.appointmentId] = day;
        }
      });

      setBookedDaysMap(dayMap);
    } catch (error) {
      setMessage("❌ Failed to fetch appointments.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await doctorService.deleteAppointment(id);
      setMessage("✅ Appointment deleted successfully!");
      fetchAppointments();
    } catch (error) {
      setMessage("❌ Failed to delete appointment.");
    }
  };

  const handleUpdate = (appointmentId, appointment) => {
    navigate(`/doctor/updateappointment/${appointmentId}`, { state: { appointment } });
  };

  const getFilteredAppointments = () => {
    const today = new Date().toISOString().split("T")[0];
    return appointments
      .filter((a) => new Date(a.selectedDate) >= new Date(today))
      .filter((a) => {
        switch (filter) {
          case "BOOKED": return a.booked === true;
          case "AVAILABLE": return a.booked === false;
          case "TODAY": return a.selectedDate === today;
          default: return true;
        }
      });
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Appointments List</h2>

      {message && <div style={styles.message}>{message}</div>}
      {!appUserId && <div style={styles.message}>Loading doctor data...</div>}

      <div style={styles.topBar}>
        <div>
          {["ALL", "BOOKED", "AVAILABLE", "TODAY"].map((f) => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === f ? COLORS.primary : COLORS.background,
                color: filter === f ? "#fff" : COLORS.primary,
              }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          style={styles.addBtn}
          onClick={() => navigate(`/doctor/addappointment/${appUserId}`)}
        >
          ➕ Add Appointment
        </button>
      </div>

      {filteredAppointments.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Price</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.appointmentId}>
                <td>{appointment.appointmentId}</td>
                <td>{appointment.price}</td>
                <td>
                  {appointment.selectedDate} (
                  {new Date(appointment.selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                  )
                </td>
                <td>{appointment.startTime}</td>
                <td>{appointment.endTime}</td>
                <td>
                  {appointment.booked ? (
                    <button
                      style={{ ...styles.actionBtn, backgroundColor: COLORS.primary }}
                      onClick={() =>
                        navigate(`/doctor/getappointmentbyid/${appointment.appointmentId}`)
                      }
                    >
                       View 
                    </button>
                  ) : (
                    <>
                      <button
                        style={{ ...styles.actionBtn, backgroundColor:  COLORS.warning }}
                        onClick={() => handleUpdate(appointment.appointmentId, appointment)}
                      >
                         Edit
                      </button>
                      <button
                        style={{ ...styles.actionBtn, backgroundColor: COLORS.danger }}
                        onClick={() => handleDelete(appointment.appointmentId)}
                      >
                         Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={styles.noData}>No appointments found.</div>
      )}
    </div>
  );
};
const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: COLORS.background,
    color: COLORS.text,
    padding: "2rem",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: "2rem",
    fontWeight: 600,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  filterBtn: {
    padding: "0.5rem 1rem",
    border: `2px solid ${COLORS.primary}`,
    borderRadius: "8px",
    marginRight: "0.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundColor: COLORS.background,
    color: COLORS.primary,
    fontFamily: "'Poppins', sans-serif",
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: COLORS.card,
    color: COLORS.text,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
  },
  actionBtn: {
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.4rem 0.7rem",
    margin: "0 0.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
  },
  message: {
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#e3f2fd",
    borderLeft: `6px solid ${COLORS.primary}`,
    borderRadius: "5px",
    color: COLORS.text,
  },
  noData: {
    textAlign: "center",
    marginTop: "2rem",
    fontWeight: "bold",
    color: COLORS.primary,
  },
};


export default AppointmentList;
