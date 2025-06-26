import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import spService from "../service/spservice";

const AppDtlsSp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAppointment = async () => {
      try {
        const response = await spService.getAppointmentById(id);
        setAppointment(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAppointment();
  }, [id]);

  const renderImage = (base64) => {
    if (!base64) return <span>No Image</span>;
    try {
      return (
        <img
          src={`data:image/jpeg;base64,${base64}`}
          alt="Pet"
          style={{
            maxWidth: "140px",
            maxHeight: "140px",
            borderRadius: "12px",
            boxShadow: "0 0 8px rgba(96,150,186,0.4)",
            border: "2px solid #6096BA",
            marginTop: "10px",
          }}
        />
      );
    } catch (error) {
      console.error("Image rendering error:", error);
      return <span>Invalid Image</span>;
    }
  };

  const isPastAppointment = () => {
    if (!appointment?.selectedDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const apptDate = new Date(appointment.selectedDate);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate < today;
  };

  const handleCancelBooking = async () => {
    try {
      await spService.cancelAppointment(appointment.appointmentId);
      alert("✅ Booking cancelled successfully!");
      navigate(-1);
    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      alert("❌ Failed to cancel booking.");
    }
  };

  if (error)
    return (
      <div style={{ backgroundColor: "#ffcccc", color: "#900000", padding: "1rem", borderRadius: "12px", maxWidth: "700px", margin: "2rem auto", textAlign: "center", fontWeight: "bold" }}>
        ❌ Error: {error}
      </div>
    );

  if (!appointment) return <p style={{ textAlign: "center" }}>Loading appointment details...</p>;

  const pet = appointment.pet || {};
  const user = appointment.appUser || {};

  const Section = ({ title, children }) => (
    <section style={{ marginBottom: 24, borderBottom: "1px solid #A3CEF1", paddingBottom: 12 }}>
      <h4 style={{ color: "#274C77", marginBottom: 8 }}>{title}</h4>
      {children}
    </section>
  );

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#E7ECEF",
        color: "#274C77",
        padding: 30,
        maxWidth: 960,
        margin: "40px auto",
        borderRadius: 16,
        boxShadow: "0 0 20px rgba(96, 150, 186, 0.25)",
        border: "1px solid #A3CEF1",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>📋 Appointment Details</h2>

      <Section title="🗓️ Appointment">
        <p>📅 Date: {appointment.selectedDate} ({new Date(appointment.selectedDate).toLocaleDateString("en-US", { weekday: "long" })})</p>
        <p>⏰ Time: {appointment.startTime} - {appointment.endTime}</p>
       
      </Section>

      <Section title="👤 Owner Information">
        <p>🧑 Name: {user.firstname} {user.lastname}</p>
        <p>📞 Phone: {user.phone}</p>
      </Section>

      <Section title="🐾 Pet Information">
        <p>🐕 Name: {pet.petName}</p>
        <p>⚖️ Weight: {pet.weight} kg</p>
        <p>🎂 Age: {pet.age} years</p>
        <p>
          🐶 Category: {pet.petCategory?.MSCategory ? Object.entries(pet.petCategory.MSCategory).map(([k, v]) => `${k} - ${v}`).join(", ") : "N/A"}
        </p>
        <p>🩺 Last Vet Visit: {pet.lastVetVisit || "N/A"}</p>
        {renderImage(pet.image)}
      </Section>

      <Section title="💉 Vaccination Records">
        {pet.vaccinationRecord && Object.keys(pet.vaccinationRecord).length > 0 ? (
          <ul>
            {Object.entries(pet.vaccinationRecord).map(([vaccine, date]) => (
              <li key={vaccine}>{vaccine}: {new Date(date).toLocaleDateString()}</li>
            ))}
          </ul>
        ) : (
          <p>📭 No vaccination records.</p>
        )}
      </Section>

      <Section title="🌿 Allergies">
        {pet.allergies?.length ? (
          <ul>{pet.allergies.map((a, i) => <li key={i}>{a}</li>)}</ul>
        ) : (
          <p>😌 No allergies listed.</p>
        )}
      </Section>

      <Section title="🍽️ Dietary Preferences">
        {pet.dietarypreferences?.length ? (
          <ul>{pet.dietarypreferences.map((d, i) => <li key={i}>{d}</li>)}</ul>
        ) : (
          <p>🥣 No dietary preferences listed.</p>
        )}
      </Section>

      <Section title="🧬 Medical Conditions">
        {pet.medicalConditions?.length ? (
          <ul>{pet.medicalConditions.map((m, i) => <li key={i}>{m}</li>)}</ul>
        ) : (
          <p>🧘 No medical conditions listed.</p>
        )}
      </Section>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ backgroundColor: "#6096BA", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}
        >⬅ Back</button>

        {appointment.booked && !isPastAppointment() && (
          <button
            onClick={handleCancelBooking}
            style={{ backgroundColor: "#8B8C89", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}
          >❌ Cancel Booking</button>
        )}
      </div>
    </div>
  );
};

export default AppDtlsSp;
