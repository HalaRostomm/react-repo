import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import doctorService from "../service/doctorservice";

const AppoiDtls = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAppointment = async () => {
      try {
        const response = await doctorService.getAppointmentById(id);
        setAppointment(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAppointment();
  }, [id]);

  const renderImage = (base64) => {
    if (!base64) return <span>No Image</span>;
    return (
      <img
        src={`data:image/jpeg;base64,${base64}`}
        alt="Pet"
        style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "10px", border: "1px solid #ccc", marginTop: "10px" }}
      />
    );
  };

  const isPastAppointment = () => {
    if (!appointment?.selectedDate) return false;
    const now = new Date();
    const endTime = new Date(`${appointment.selectedDate} ${appointment.endTime}`);
    return endTime < now;
  };

  const handleCancelBooking = async () => {
    try {
      await doctorService.cancelBooking(appointment.appointmentId);
      alert("✅ Booking cancelled successfully!");
      navigate(-1);
    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      alert("❌ Failed to cancel booking.");
    }
  };

  if (error) return <div style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>Error: {error}</div>;
  if (!appointment) return null;

  const { pet = {}, appUser: user = {} } = appointment;

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: "#f2f9ff",
      padding: 30,
      maxWidth: 900,
      margin: "auto",
      borderRadius: 10,
      border: "1px solid #d3e0f0",
      color: "black"
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        `}
      </style>

      <h2 style={{ color: "#64B5F6", fontWeight: 600, textAlign: "center", marginBottom: 30 }}>Appointment Details</h2>

      <section style={{ marginBottom: 25 }}>
        <h4>Appointment</h4>
        <p>
          Date: {appointment.selectedDate} (
          {new Date(appointment.selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
          })}
          )
        </p>
        <p>Time: {appointment.startTime} - {appointment.endTime}</p>
        <p>Price: ${appointment.price}</p>
      </section>

      <hr />

      <section style={{ marginBottom: 25 }}>
        <h4>Owner Information</h4>
       <p>Name: {user?.firstname || "N/A"} {user?.lastname || ""}</p>

        <p>Phone: {user.phone}</p>
      </section>

      <hr />

      <section style={{ marginBottom: 25 }}>
        <h4>Pet Information</h4>
        <p>Name: {pet.petName}</p>
        <p>Weight: {pet.weight} kg</p>
        <p>Age: {pet.age} years</p>
        <p>
          <strong>Category:</strong>{" "}
          {pet.petCategory?.MSCategory
            ? Object.entries(pet.petCategory.MSCategory)
                .map(([key, value]) => `${key} - ${value}`)
                .join(", ")
            : "Loading category..."}
        </p>
        <p>Last Vet Visit: {pet.lastVetVisit || "N/A"}</p>
        {renderImage(pet.image)}
      </section>

      <hr />

      <section style={{ marginBottom: 25 }}>
        <h4>Vaccination Records</h4>
        {pet.vaccinationRecord && Object.keys(pet.vaccinationRecord).length > 0 ? (
          <ul>
            {Object.entries(pet.vaccinationRecord).map(([vaccine, date]) => (
              <li key={vaccine}>
                {vaccine}: {new Date(date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No vaccination records.</p>
        )}
      </section>

      <hr />

      <section style={{ marginBottom: 25 }}>
        <h4>Allergies</h4>
        {pet.allergies?.length > 0 ? (
          <ul>{pet.allergies.map((a, idx) => <li key={idx}>{a}</li>)}</ul>
        ) : (
          <p>No allergies listed.</p>
        )}
      </section>

      <hr />

      <section style={{ marginBottom: 25 }}>
        <h4>Dietary Preferences</h4>
        {pet.dietaryPreferences?.length > 0 ? (
          <ul>{pet.dietaryPreferences.map((d, idx) => <li key={idx}>{d}</li>)}</ul>
        ) : (
          <p>No dietary preferences listed.</p>
        )}
      </section>

      <hr />

      <section style={{ marginBottom: 25 }}>
        <h4>Medical Conditions</h4>
        {pet.medicalConditions?.length > 0 ? (
          <ul>{pet.medicalConditions.map((c, idx) => <li key={idx}>{c}</li>)}</ul>
        ) : (
          <p>No medical conditions listed.</p>
        )}
      </section>

      <div style={{ marginTop: 20, display: "flex", gap: "10px", justifyContent: "space-between" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#64B5F6",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: 6,
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          ⬅ Back
        </button>

        {appointment.booked && !isPastAppointment() && (
          <button
            onClick={handleCancelBooking}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: 6,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            ❌ Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default AppoiDtls;
