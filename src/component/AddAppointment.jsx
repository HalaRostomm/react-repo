import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DoctorService from "../service/doctorservice";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const COLORS = {
  dark: "#0D1B2A",
  deep: "#1B263B",
  steel: "#415A77",
  soft: "#778DA9",
  light: "#E0E1DD",
};

const AddAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [price, setPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [workingTime, setWorkingTime] = useState(null);
  const [appointments, setAppointments] = useState([]);

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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) return;

        const response = await DoctorService.getAppointments(doctorId, token);
        setAppointments(response.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchAppointments();
  }, [doctorId]);

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

        const response = await DoctorService.getWorkingTimeByDay(dayOfWeek, doctorId, token);
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
  }, [selectedDate, doctorId]);

  const parseTimeWithDate = (date, timeStr) => {
    if (!date || !timeStr) return null;
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    return dayjs(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm");
  };

  const timeToMinutes = (timeStr, format) => {
    if (!timeStr) return null;
    const parsed = dayjs(timeStr, format);
    return parsed.isValid() ? parsed.hour() * 60 + parsed.minute() : null;
  };

  const isWithinWorkingHours = () => {
    if (!workingTime || workingTime.length !== 2) return false;
    const [startRangeMins, endRangeMins, startMins, endMins] = [
      timeToMinutes(workingTime[0], "h:mm A"),
      timeToMinutes(workingTime[1], "h:mm A"),
      timeToMinutes(startTime, "HH:mm"),
      timeToMinutes(endTime, "HH:mm"),
    ];

    if ([startRangeMins, endRangeMins, startMins, endMins].includes(null)) return false;
    return startMins >= startRangeMins && endMins <= endRangeMins && endMins > startMins;
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
    if (!price || !selectedDate || !startTime || !endTime) return alert("Please fill all fields");
    if (!isWithinWorkingHours()) return alert("Selected time is outside working hours");
    if (isTimeConflicting()) return alert("Time conflicts with an existing appointment");

    const token = localStorage.getItem("jwt_token");
    if (!token) return alert("Please login first");

    try {
      const appointmentData = {
        price,
        selectedDate: dayjs(selectedDate).format("YYYY-MM-DD"),
        startTime: convertToApiTimeValue(startTime),
        endTime: convertToApiTimeValue(endTime),
      };

      await DoctorService.addNewAppointment(doctorId, appointmentData, token);
      alert("Appointment added successfully");
      navigate(`/doctor/getappointments/${doctorId}`);
    } catch (error) {
      alert("Failed to add appointment: " + (error.response?.data || error.message));
    }
  };

  const containerStyle = {
    maxWidth: 500,
    margin: "40px auto",
    padding: 24,
    fontFamily: "'Crimson Pro', serif",
    backgroundColor: COLORS.deep,
    color: COLORS.light,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  };

  const headingStyle = {
    marginBottom: 24,
    color: COLORS.soft,
    fontWeight: 700,
    fontSize: 28,
    textAlign: "center",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 6,
    color: COLORS.soft,
    fontWeight: 600,
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    fontSize: 16,
    fontFamily: "'Crimson Pro', serif",
    backgroundColor: COLORS.light,
    border: `2px solid ${COLORS.soft}`,
    borderRadius: 6,
    outline: "none",
    marginBottom: 20,
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  };

  const buttonStyle = {
    marginTop: 8,
    width: "100%",
    padding: "14px 0",
    fontSize: 18,
    fontFamily: "'Crimson Pro', serif",
    fontWeight: 600,
    color: COLORS.light,
    backgroundColor: COLORS.steel,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={containerStyle}>
        <h2 style={headingStyle}>Add Appointment</h2>
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Price</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={inputStyle}
            placeholder="Enter appointment price"
          />

          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Add Appointment
          </button>
        </form>
      </div>
    </>
  );
};

export default AddAppointment;
