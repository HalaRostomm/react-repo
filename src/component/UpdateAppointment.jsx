import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import doctorService from "../service/doctorservice";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import authService from "../service/authService";
import { jwtDecode } from "jwt-decode";

dayjs.extend(customParseFormat);

const primaryColor = "#64B5F6";

const UpdateAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [price, setPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [workingTime, setWorkingTime] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState({
    appointment: true,
    workingTime: false,
    appointments: false
  });
  const [focusedInput, setFocusedInput] = useState(null);

  // Utility functions
 
  
  useEffect(() => {
    fetchAppUserId();
  }, []);

  const fetchAppUserId = async () => {
    try {
      const token = await authService.getToken();
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.appUserId) {
  console.log("Decoded appUserId:", decodedToken.appUserId);
  setDoctorId(decodedToken.appUserId);
}

        if (decodedToken.appUserId) {
          setDoctorId(decodedToken.appUserId);
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


 const getDayOfWeek = (date) => dayjs(date).format("dddd");

  const convertToInputTimeValue = (timeStr) => {
    if (!timeStr) return "";
    const parsed = dayjs(timeStr, "hh:mm A");
    return parsed.isValid() ? parsed.format("HH:mm") : "";
  };

  const convertToApiTimeValue = (timeStr) => {
    if (!timeStr) return "";
    const parsed = dayjs(timeStr, "HH:mm");
    return parsed.isValid() ? parsed.format("hh:mm A") : "";
  };

 

  

 // Effects
  useEffect(() => {
    fetchAppointmentData();
  }, [appointmentId]);

  useEffect(() => {
    fetchWorkingTime();
  }, [selectedDate, doctorId]);

  // Data fetching
  const fetchAppointmentData = async () => {
    try {
      setLoading(prev => ({ ...prev, appointment: true }));
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("Please login first");

      // Fetch appointment
      const response = await doctorService.getAppointmentById(appointmentId, token);
      const appt = response.data;
      if (!appt) throw new Error("Appointment not found");

      setPrice(appt.price || "");
      setSelectedDate(appt.selectedDate ? new Date(appt.selectedDate) : null);
      setStartTime(convertToInputTimeValue(appt.startTime));
      setEndTime(convertToInputTimeValue(appt.endTime));
      
      // Use doctorId from appointment, not from token
      if (appt.doctorId) {
        setDoctorId(appt.doctorId); // still store it for UI/navigation


      }
    } catch (error) {
      console.error("Failed to fetch appointment:", error);
      setMessage(error.message || "Failed to load appointment data");
    } finally {
      setLoading(prev => ({ ...prev, appointment: false }));
    }
  };

  useEffect(() => {
      const fetchDoctorAppointments = async () => {
        try {
          const token = localStorage.getItem("jwt_token");
          if (!token) return;
  
          const response = await doctorService.getAppointments(doctorId, token);
          setAppointments(response.data);
        } catch (err) {
          console.error("Failed to fetch appointments", err);
        }
      };
  
      fetchDoctorAppointments();
    }, [doctorId]);
  const fetchWorkingTime = async () => {
    if (!selectedDate || !doctorId) {
      setWorkingTime(null);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, workingTime: true }));
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("Please login first");

      const dayOfWeek = getDayOfWeek(selectedDate);
      const response = await doctorService.getWorkingTimeByDay(
        dayOfWeek, 
        doctorId, 
        token
      );

      if (response.data) {
        const times = response.data.split(" - ");
        setWorkingTime(times.length === 2 ? times : null);
      } else {
        setWorkingTime(null);
      }
    } catch (error) {
      console.error("Failed to fetch working time:", error);
      setWorkingTime(null);
      if (error.response?.status === 403) {
        setMessage("Session expired. Please login again.");
      }
    } finally {
      setLoading(prev => ({ ...prev, workingTime: false }));
    }
  };

 const parseTimeWithDate = (date, timeStr) => {
    if (!date || !timeStr) return null;
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    return dayjs(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm");
  };

  const timeToMinutes = (timeStr, format) => {
    if (!timeStr) return null;
    const parsed = dayjs(timeStr, format);
    if (!parsed.isValid()) {
      console.log("Failed to parse time:", timeStr, "with format:", format);
      return null;
    }
    return parsed.hour() * 60 + parsed.minute();
  };
  // Validation functions
  const isWithinWorkingHours = () => {
    if (!workingTime || !Array.isArray(workingTime) || workingTime.length !== 2) {
      return false;
    }

    const [startRange, endRange] = workingTime;
    const startRangeMins = timeToMinutes(startRange, "h:mm A");
    const endRangeMins = timeToMinutes(endRange, "h:mm A");
    const startMins = timeToMinutes(startTime, "HH:mm");
    const endMins = timeToMinutes(endTime, "HH:mm");

    if ([startRangeMins, endRangeMins, startMins, endMins].some(val => val === null)) {
      return false;
    }

    return startMins >= startRangeMins && 
           endMins <= endRangeMins && 
           endMins > startMins;
  };
  
console.log("Loaded appointments:", appointments);

const isTimeConflicting = () => {
  const newStart = parseTimeWithDate(selectedDate, startTime);
  const newEnd = parseTimeWithDate(selectedDate, endTime);

  if (!newStart || !newEnd) return false;

  for (let appt of appointments) {
    if (String(appt.appointmentId) === String(appointmentId)) continue;

    if (
      dayjs(appt.selectedDate).format("YYYY-MM-DD") ===
      dayjs(selectedDate).format("YYYY-MM-DD")
    ) {
      const apptStart = dayjs(`${appt.selectedDate} ${appt.startTime}`, ["YYYY-MM-DD hh:mm A", "YYYY-MM-DD HH:mm"]);
      const apptEnd = dayjs(`${appt.selectedDate} ${appt.endTime}`, ["YYYY-MM-DD hh:mm A", "YYYY-MM-DD HH:mm"]);

      if (newStart.isBefore(apptEnd) && newEnd.isAfter(apptStart)) {
        return true;
      }
    }
  }

  return false;
};





  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!price || !selectedDate || !startTime || !endTime) {
      setMessage("Please fill all fields");
      return;
    }

    if (!workingTime) {
      setMessage("Doctor has no working hours set for this day");
      return;
    }

    if (!isWithinWorkingHours()) {
      setMessage("Selected time is outside doctor's working hours");
      return;
    }

    if (isTimeConflicting()) {
      setMessage("Selected time conflicts with an existing appointment");
      return;
    }

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("Please login first");

      await doctorService.updateAppointment(
        appointmentId,
        {
          price,
          selectedDate: dayjs(selectedDate).format("YYYY-MM-DD"),
          startTime: convertToApiTimeValue(startTime),
          endTime: convertToApiTimeValue(endTime),
        },
        token
      );

      alert("Appointment updated successfully!");
      navigate(`/doctor/getappointments/${doctorId}`);
    } catch (error) {
      console.error("Error updating appointment:", error);
      setMessage(error.message || "Failed to update appointment");
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: 500,
    margin: "40px auto",
    padding: 24,
    fontFamily: "'Poppins', sans-serif",
    color: "black",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 4px 15px rgba(100, 181, 246, 0.2)",
  };

  const headingStyle = {
    marginBottom: 24,
    color: primaryColor,
    fontWeight: 700,
    fontSize: 28,
    textAlign: "center",
    letterSpacing: "1px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontWeight: 600,
    fontSize: 14,
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    fontSize: 16,
    borderRadius: 6,
    border: `2px solid #ccc`,
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: primaryColor,
    boxShadow: `0 0 8px ${primaryColor}`,
  };

  const buttonStyle = {
    marginTop: 16,
    width: "100%",
    padding: "14px 0",
    fontSize: 18,
    fontWeight: 600,
    color: "white",
    backgroundColor: primaryColor,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={containerStyle}>
        <h1 style={headingStyle}>Update Appointment</h1>
        
        {message && (
          <p style={{ 
            color: message.startsWith("✅") ? "green" : "red", 
            textAlign: "center",
            marginBottom: 16
          }}>
            {message}
          </p>
        )}

        {loading.appointment ? (
          <p style={{ textAlign: "center" }}>Loading appointment data...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={labelStyle} htmlFor="price">
              Price
            </label>
            <input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onFocus={() => setFocusedInput("price")}
              onBlur={() => setFocusedInput(null)}
              style={focusedInput === "price" ? inputFocusStyle : inputStyle}
              required
            />

            <label style={labelStyle} htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : ""}
              onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
              onFocus={() => setFocusedInput("date")}
              onBlur={() => setFocusedInput(null)}
              style={focusedInput === "date" ? inputFocusStyle : inputStyle}
              required
            />

            <label style={labelStyle} htmlFor="startTime">
              Start Time
            </label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              onFocus={() => setFocusedInput("startTime")}
              onBlur={() => setFocusedInput(null)}
              style={focusedInput === "startTime" ? inputFocusStyle : inputStyle}
              required
            />

            <label style={labelStyle} htmlFor="endTime">
              End Time
            </label>
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              onFocus={() => setFocusedInput("endTime")}
              onBlur={() => setFocusedInput(null)}
              style={focusedInput === "endTime" ? inputFocusStyle : inputStyle}
              required
            />

            {loading.workingTime ? (
              <p style={{ fontSize: 14, marginTop: 8 }}>Loading working hours...</p>
            ) : workingTime ? (
              <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
                Doctor's working hours: {workingTime.join(' - ')}
              </p>
            ) : (
              <p style={{ fontSize: 14, color: 'red', marginTop: 8 }}>
                No working hours set for this day
              </p>
            )}

           <button
  type="submit"
  style={buttonStyle}
  disabled={Object.values(loading).some(Boolean)} // include loading.appointments
>
  {loading.appointments ? "Updating..." : "Update Appointment"}
</button>

          </form>
        )}
      </div>
    </>
  );
};

export default UpdateAppointment;