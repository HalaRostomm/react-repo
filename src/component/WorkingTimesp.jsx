import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import spService from "../service/spservice";
import authService from "../service/authService";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WorkingTimesp = () => {
  const { spId } = useParams();
  const [availability, setAvailability] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [bookedDays, setBookedDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await authService.getToken();
        const sp = authService.decodeToken(token);
        const id = sp?.appUserId;
        if (!id) {
          toast.error("SP ID not found.");
          setLoading(false);
          return;
        }

        const availResponse = await spService.getAvailability(id);
        const avail = availResponse.data || {};

        const cleanedAvailability = {};
        Object.entries(avail).forEach(([day, value]) => {
          if (typeof value === "object" && value !== null) {
            cleanedAvailability[day] = `${value.start} - ${value.end}`;
          } else if (typeof value === "string") {
            cleanedAvailability[day] = value;
          }
        });
        setAvailability(cleanedAvailability);

        const allAppointments = (await spService.getAppointmentsBySp(id)).data || [];
        const bookedAppointments = allAppointments.filter((appt) => appt.booked === true);
        setAppointments(bookedAppointments);

        const bookedDaysData = (await spService.getBookedAppointments(id)).data || [];
const now = new Date();

const futureBookedDays = [
  ...new Set(
    bookedDaysData
      .filter((appt) => {
        if (!appt.selectedDate || !appt.startTime) return false;

        console.log("🧪 Raw startTime:", appt.startTime);
        console.log("🧪 Raw selectedDate:", appt.selectedDate);

        const start24h = convertTo24Hour(appt.startTime); // convert AM/PM to 24h
        const fullDateTimeStr = `${appt.selectedDate}T${start24h}`;

        const appointmentStart = new Date(fullDateTimeStr);
        console.log("⏰ Appointment Start (parsed):", appointmentStart.toString());
        console.log("🔄 Now:", now.toString());

        return appointmentStart.getTime() > now.getTime();
      })
      .map((appt) => {
        const start24h = convertTo24Hour(appt.startTime);
        const appointmentStart = new Date(`${appt.selectedDate}T${start24h}`);
        return appointmentStart.toLocaleString("en-us", { weekday: "long" }).toLowerCase();
      })
  ),
];

console.log("📌 Future Booked Days (blocked):", futureBookedDays);
setBookedDays(futureBookedDays);



       
      } catch (err) {
        console.error("Error initializing:", err);
        toast.error("Failed to load availability or appointments.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [spId]);

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return `${h}:${minute.toString().padStart(2, "0")} ${period}`;
  };
  function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(' '); // e.g. "09:30", "AM"
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier.toUpperCase() === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  // Make sure hours and minutes are two digits
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.padStart(2, '0');

  return `${hours}:${minutes}`;
}

  const handleTimeSave = async () => {
    if (startTime && endTime && selectedDay) {
      const formatted = `${formatTime(startTime)} - ${formatTime(endTime)}`;
      const updated = { ...availability, [selectedDay]: formatted };
      setAvailability(updated);

      try {
        const filtered = Object.fromEntries(Object.entries(updated).filter(([_, val]) => val));
        await spService.setAvailability(spId, filtered);
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

  if (loading) return <p style={{ textAlign: "center", color: "#8B8C89" }}>Loading...</p>;

  return (
   <div
  style={{
    fontFamily: "Poppins, sans-serif",
    backgroundColor: "#E7ECEF",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  }}
>
  <div
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: "20px",
      padding: "2rem 2.5rem",
      maxWidth: "700px",
      width: "100%",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      color: "#274C77",
    }}
  >

 
      <ToastContainer />
      <h2 style={{ color: "#274C77", fontWeight: "700", marginBottom: "1.5rem" }}>
        My Availability
      </h2>

      {weekDays.map((day) => {
        const hasAppointments = bookedDays.includes(day.toLowerCase());

        return (
          <div
            key={day}
            style={{
              marginBottom: "12px",
              padding: "14px 16px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #A3CEF1",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <strong>{day}:</strong> {availability[day] || <span style={{ color: "#8B8C89" }}>Not set</span>}
            </span>
            <button
              onClick={() => setSelectedDay(day)}
              disabled={hasAppointments}
              style={{
                cursor: hasAppointments ? "not-allowed" : "pointer",
                backgroundColor: hasAppointments ? "#8B8C89" : "#6096BA",
                color: "white",
                padding: "8px 14px",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
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
            border: "1.5px solid #A3CEF1",
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <h4 style={{ color: "#274C77", marginBottom: "16px" }}>
            Set Time for <span style={{ color: "#6096BA" }}>{selectedDay}</span>
          </h4>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <label style={{ minWidth: "60px" }}>Start:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{
                padding: "6px 12px",
                border: "1px solid #A3CEF1",
                borderRadius: "6px",
                fontFamily: "Poppins, sans-serif",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <label style={{ minWidth: "60px" }}>End:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{
                padding: "6px 12px",
                border: "1px solid #A3CEF1",
                borderRadius: "6px",
                fontFamily: "Poppins, sans-serif",
              }}
            />
          </div>

          <button
            onClick={handleTimeSave}
            style={{
              backgroundColor: "#274C77",
              color: "white",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              marginTop: "10px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Save Availability
          </button>
        </div>
      )}
    </div>
     </div>
  );
};

export default WorkingTimesp;
