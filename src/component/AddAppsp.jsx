import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import spService from "../service/spservice";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import authService from "../service/authService";
import { jwtDecode } from "jwt-decode";
dayjs.extend(customParseFormat);
const styles = {
  page: {
    backgroundColor: "#E7ECEF",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#274C77",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(96, 150, 186, 0.2)",
    borderRadius: 10,
    padding: 24,
    maxWidth: 500,
    width: "100%",
  },
  heading: {
    color: "#274C77",
    fontWeight: "700",
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 16,
    borderRadius: 6,
    border: "1.5px solid #A3CEF1",
    backgroundColor: "#F0F4F8",
    color: "#274C77",
    outlineOffset: 2,
    outlineColor: "transparent",
    transition: "outline-color 0.3s ease",
  },
  inputFocus: {
    outlineColor: "#6096BA",
  },
  button: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#6096BA",
    border: "none",
    color: "#fff",
    padding: "14px 0",
    fontSize: 18,
    fontWeight: "700",
    borderRadius: 6,
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(96, 150, 186, 0.4)",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#4a7ca1",
  },
  alertSuccess: {
    marginTop: 16,
    padding: "12px 16px",
    backgroundColor: "#D4EDDA",
    color: "#155724",
    fontWeight: "700",
    borderRadius: 4,
  },
  alertError: {
    marginTop: 16,
    padding: "12px 16px",
    backgroundColor: "#F8D7DA",
    color: "#721C24",
    fontWeight: "700",
    borderRadius: 4,
  },
};

const AddAppsp = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [price, setPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(""); 
  const [endTime, setEndTime] = useState("");    
  const [workingTime, setWorkingTime] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [token, setToken] = useState(null);

const [ spId, setspId]= useState("");

  const [alert, setAlert] = useState(null); // { type: 'success'|'error', message: string }
  useEffect(() => {
      const fetchAppUserId = async () => {
        try {
          const token = await authService.getToken();
          setToken(token);
          if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.appUserId) {
              setspId(decodedToken.appUserId);
            }
          }
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      };
      fetchAppUserId();
    }, []);

  const getDayOfWeek = (date) => dayjs(date).format("dddd");

  const convertToApiTimeValue = (timeStr) => {
    if (!timeStr) return "";
    const parsed = dayjs(timeStr, "HH:mm");
    return parsed.isValid() ? parsed.format("hh:mm A") : "";
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) return;

        const response = await spService.getAppointments(serviceId, token);
        setAppointments(response.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchAppointments();
  }, [serviceId]);

  useEffect(() => {
    if (!selectedDate) {
      setWorkingTime(null);
      return;
    }

    const fetchWorkingTime = async () => {
      const dayOfWeek = getDayOfWeek(selectedDate);
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) return;

        const response = await spService.getWorkingTime(dayOfWeek, spId, token);
        if (response.data) {
          setWorkingTime(response.data.split(" - "));
        } else {
          setWorkingTime(null);
        }
      } catch (err) {
        console.error("Failed to fetch working time", err);
        setWorkingTime(null);
      }
    };

    fetchWorkingTime();
  }, [selectedDate, spId]);

  const parseTimeWithDate = (date, timeStr) => {
    if (!date || !timeStr) return null;
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    return dayjs(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm");
  };

  const timeToMinutes = (timeStr, format) => {
    if (!timeStr) return null;
    const parsed = dayjs(timeStr, format);
    if (!parsed.isValid()) return null;
    return parsed.hour() * 60 + parsed.minute();
  };

  const isWithinWorkingHours = () => {
    if (!workingTime || workingTime.length !== 2) return false;

    const startRangeMins = timeToMinutes(workingTime[0], "h:mm A");
    const endRangeMins = timeToMinutes(workingTime[1], "h:mm A");
    const startMins = timeToMinutes(startTime, "HH:mm");
    const endMins = timeToMinutes(endTime, "HH:mm");

    if ([startRangeMins, endRangeMins, startMins, endMins].includes(null)) return false;
    if (startMins < startRangeMins) return false;
    if (endMins > endRangeMins) return false;
    if (endMins <= startMins) return false;

    return true;
  };

  const isTimeConflicting = () => {
    const newStart = parseTimeWithDate(selectedDate, startTime);
    const newEnd = parseTimeWithDate(selectedDate, endTime);

    if (!newStart || !newEnd) return false;

    for (let appt of appointments) {
      if (dayjs(appt.selectedDate).isSame(dayjs(selectedDate), "day")) {
        const apptStart = dayjs(`${appt.selectedDate} ${appt.startTime}`, "YYYY-MM-DD hh:mm A");
        const apptEnd = dayjs(`${appt.selectedDate} ${appt.endTime}`, "YYYY-MM-DD hh:mm A");

        if (newStart.isBefore(apptEnd) && newEnd.isAfter(apptStart)) return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!price || !selectedDate || !startTime || !endTime) {
      setAlert({ type: "error", message: "Please fill all fields" });
      return;
    }

    if (!isWithinWorkingHours()) {
      setAlert({ type: "error", message: "Selected time is outside doctor's working hours" });
      return;
    }

    if (isTimeConflicting()) {
      setAlert({ type: "error", message: "Selected time conflicts with an existing appointment" });
      return;
    }

    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setAlert({ type: "error", message: "Please login first" });
      return;
    }

    try {
      const appointmentData = {
        price,
        selectedDate: dayjs(selectedDate).format("YYYY-MM-DD"),
        startTime: convertToApiTimeValue(startTime),
        endTime: convertToApiTimeValue(endTime),
      };

      await spService.addNewAppointment(serviceId, appointmentData, token);

      setAlert({ type: "success", message: "Appointment added successfully" });

      setTimeout(() => {
        navigate(`/sp/getappointments/${serviceId}`);
      }, 1500);
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to add appointment: " + (error.response?.data || error.message),
      });
    }
  };

  // To handle input focus style dynamically:
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Price:</label>
            <input
              type="number"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onFocus={() => setFocusedInput("price")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.input,
                ...(focusedInput === "price" ? styles.inputFocus : {}),
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Date:</label>
            <input
              type="date"
              required
              value={selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : ""}
              onChange={(e) =>
                setSelectedDate(e.target.value ? new Date(e.target.value) : null)
              }
              onFocus={() => setFocusedInput("date")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.input,
                ...(focusedInput === "date" ? styles.inputFocus : {}),
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Start Time:</label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              onFocus={() => setFocusedInput("startTime")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.input,
                ...(focusedInput === "startTime" ? styles.inputFocus : {}),
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>End Time:</label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              onFocus={() => setFocusedInput("endTime")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.input,
                ...(focusedInput === "endTime" ? styles.inputFocus : {}),
              }}
            />
          </div>

          <button type="submit" style={styles.button}>
            Add Appointment
          </button>
          {alert && (
            <div
              style={
                alert.type === "success" ? styles.alertSuccess : styles.alertError
              }
            >
              {alert.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddAppsp;
