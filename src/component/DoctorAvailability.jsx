import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import doctorService from "../service/doctorservice";
import authService from "../service/authService";
import "react-toastify/dist/ReactToastify.css";

const COLORS = {
  primary: "#64B5F6",
  lightBg: "#f9f9f9",
  cardBg: "#ffffff",
  border: "#cbd5e1",
  text: "#000000",
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

  if (loading)
    return (
      <p style={{ fontFamily: "'Poppins', sans-serif", textAlign: "center", color: COLORS.primary }}>
        Loading...
      </p>
    );

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: COLORS.lightBg,
        color: COLORS.text,
        padding: "30px",
        maxWidth: "700px",
        margin: "40px auto",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <ToastContainer />
      <h2
        style={{
          color: COLORS.primary,
          fontWeight: 700,
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
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
              backgroundColor: COLORS.cardBg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <strong>{day}:</strong> {availability[day] || "Not set"}
            </span>
            <button
              onClick={() => setSelectedDay(day)}
              disabled={hasAppointments}
              style={{
                cursor: hasAppointments ? "not-allowed" : "pointer",
                backgroundColor: hasAppointments ? "#ccc" : COLORS.primary,
                color: "#fff",
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
            border: `1px solid ${COLORS.primary}`,
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <h4 style={{ marginBottom: "20px", color: COLORS.primary }}>
            Set time for <strong>{selectedDay}</strong>
          </h4>

          <div style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "center" }}>
            <label style={{ minWidth: "60px" }}>Start:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{
                padding: "8px",
                fontFamily: "'Poppins', sans-serif",
                border: `1px solid ${COLORS.border}`,
                borderRadius: "6px",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "center" }}>
            <label style={{ minWidth: "60px" }}>End:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{
                padding: "8px",
                fontFamily: "'Poppins', sans-serif",
                border: `1px solid ${COLORS.border}`,
                borderRadius: "6px",
              }}
            />
          </div>

          <button
            onClick={handleTimeSave}
            style={{
              backgroundColor: COLORS.primary,
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontFamily: "'Poppins', sans-serif",
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
