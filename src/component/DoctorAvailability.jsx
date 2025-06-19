import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import doctorService from "../service/doctorservice";
import authService from "../service/authService";
import "react-toastify/dist/ReactToastify.css";

const COLORS = {
  dark: "#0D1B2A",
  deep: "#1B263B",
  steel: "#415A77",
  soft: "#778DA9",
  light: "#E0E1DD",
};

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [bookedDays, setBookedDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await authService.getToken();
        const doctor = authService.decodeToken(token);
        const id = doctor?.appUserId;
        if (!id) {
          toast.error("Doctor ID not found.");
          setLoading(false);
          return;
        }

        setDoctorId(id);

        const availResponse = await doctorService.getAvailability(id);
        const avail = availResponse.data || {};
        const cleanedAvailability = {};

        Object.entries(avail).forEach(([day, val]) => {
          if (typeof val === "object" && val !== null) {
            cleanedAvailability[day] = `${val.start} - ${val.end}`;
          } else {
            cleanedAvailability[day] = val;
          }
        });

        setAvailability(cleanedAvailability);

        const allAppointmentsResponse = await doctorService.getAppointments(id);
        const allAppointments = allAppointmentsResponse.data || [];
        const bookedAppointments = allAppointments.filter((appt) => appt.booked);

        const bookedDaysResponse = await doctorService.getBookedAppointments(id);
        const bookedDaysData = bookedDaysResponse.data || [];
        const uniqueBookedDays = [...new Set(bookedDaysData.map((d) => d.toLowerCase()))];

        setBookedDays(uniqueBookedDays);
        setAppointments(bookedAppointments);
      } catch (err) {
        console.error("Error initializing:", err);
        toast.error("Failed to load availability or appointments.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return `${h}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const handleTimeSave = async () => {
    if (startTime && endTime && selectedDay) {
      const formatted = `${formatTime(startTime)} - ${formatTime(endTime)}`;
      const updated = { ...availability, [selectedDay]: formatted };
      setAvailability(updated);

      try {
        const filtered = Object.fromEntries(Object.entries(updated).filter(([_, val]) => val));
        await doctorService.setAvailability(doctorId, filtered);
        toast.success(`Availability for ${selectedDay} saved.`);
      } catch (err) {
        toast.error("Failed to save availability.");
      }

      setSelectedDay(null);
      setStartTime("");
      setEndTime("");
    } else {
      toast.error("Please select both start and end time.");
    }
  };

  if (loading) return <p style={{ fontFamily: "'Crimson Pro', serif", textAlign: "center", color: COLORS.light }}>Loading...</p>;

  return (
    <div
      style={{
        fontFamily: "'Crimson Pro', serif",
        backgroundColor: COLORS.deep,
        color: COLORS.light,
        padding: "30px",
        maxWidth: "700px",
        margin: "40px auto",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      }}
    >
      <ToastContainer />
      <h2 style={{ color: COLORS.soft, fontWeight: 700, marginBottom: "20px", textAlign: "center" }}>
        Doctor Availability
      </h2>

      {weekDays.map((day) => {
        const hasAppointments = bookedDays.includes(day.toLowerCase());
        return (
          <div
            key={day}
            style={{
              marginBottom: "14px",
              padding: "14px 20px",
              backgroundColor: COLORS.dark,
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: COLORS.light }}>
              <strong>{day}:</strong> {availability[day] || "Not set"}
            </span>
            <button
              onClick={() => setSelectedDay(day)}
              disabled={hasAppointments}
              style={{
                cursor: hasAppointments ? "not-allowed" : "pointer",
                backgroundColor: hasAppointments ? "#aaa" : COLORS.steel,
                color: COLORS.light,
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
              }}
            >
              {hasAppointments ? "Booked" : "Set Time"}
            </button>
          </div>
        );
      })}

      {selectedDay && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: `1px solid ${COLORS.soft}`,
            borderRadius: "12px",
            backgroundColor: COLORS.dark,
          }}
        >
          <h4 style={{ marginBottom: "20px", color: COLORS.soft }}>
            Set time for <strong>{selectedDay}</strong>
          </h4>

          <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
            <label style={{ minWidth: "60px", color: COLORS.light }}>Start:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{
                padding: "8px",
                fontFamily: "'Crimson Pro', serif",
                border: `1px solid ${COLORS.soft}`,
                borderRadius: "6px",
                backgroundColor: COLORS.light,
                color: COLORS.dark,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
            <label style={{ minWidth: "60px", color: COLORS.light }}>End:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{
                padding: "8px",
                fontFamily: "'Crimson Pro', serif",
                border: `1px solid ${COLORS.soft}`,
                borderRadius: "6px",
                backgroundColor: COLORS.light,
                color: COLORS.dark,
              }}
            />
          </div>

          <button
            onClick={handleTimeSave}
            style={{
              backgroundColor: COLORS.steel,
              color: COLORS.light,
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontFamily: "'Crimson Pro', serif",
              fontWeight: 600,
              marginTop: "12px",
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;
