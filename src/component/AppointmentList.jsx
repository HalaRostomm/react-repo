import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import doctorService from "../service/doctorservice";
import authService from "../service/authService";
import { jwtDecode } from "jwt-decode";

const COLORS = {
  dark: "#0D1B2A",
  deep: "#1B263B",
  steel: "#415A77",
  soft: "#778DA9",
  light: "#E0E1DD",
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
                backgroundColor: filter === f ? COLORS.steel : COLORS.light,
                color: filter === f ? COLORS.light : COLORS.steel,
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
                      style={{ ...styles.actionBtn, backgroundColor: COLORS.soft }}
                      onClick={() =>
                        navigate(`/doctor/getappointmentbyid/${appointment.appointmentId}`)
                      }
                    >
                      👁️ View 
                    </button>
                  ) : (
                    <>
                      <button
                        style={{ ...styles.actionBtn, backgroundColor: "#f0ad4e" }}
                        onClick={() => handleUpdate(appointment.appointmentId, appointment)}
                      >
                         Edit
                      </button>
                      <button
                        style={{ ...styles.actionBtn, backgroundColor: "#d9534f" }}
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
    fontFamily: "'Crimson Pro', serif",
    backgroundColor: COLORS.dark,
    color: COLORS.light,
    padding: "2rem",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: COLORS.soft,
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
    border: `2px solid ${COLORS.steel}`,
    borderRadius: "8px",
    marginRight: "0.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "'Crimson Pro', serif",
  },
  addBtn: {
    backgroundColor: COLORS.steel,
    color: COLORS.light,
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "'Crimson Pro', serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: COLORS.deep,
    color: COLORS.light,
  },
  actionBtn: {
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.4rem 0.7rem",
    margin: "0 0.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "'Crimson Pro', serif",
  },
  message: {
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#fff3cd",
    borderLeft: "6px solid #ffeeba",
    borderRadius: "5px",
    color: "#0D1B2A",
  },
  noData: {
    textAlign: "center",
    marginTop: "2rem",
    fontWeight: "bold",
    color: COLORS.soft,
  },
};

export default AppointmentList;
