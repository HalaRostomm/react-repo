import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import doctorService from "../service/doctorservice";

const PassedAppDtls = () => {
  const { petId , appointmentId} = useParams();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState([""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await doctorService.getAppointmentById(appointmentId);
        const data = response.data;
        setAppointment(data);

        if (data.pet?.dietaryPreferences?.length > 0) {
          setPreferences(data.pet.dietaryPreferences);
        }
      } catch (err) {
        console.error("Fetch appointment error:", err);
        setError(err.message || "Failed to fetch appointment");
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  const renderImage = (base64) => {
    if (!base64) return <span>No Image</span>;
    return (
      <img
        src={`data:image/jpeg;base64,${base64}`}
        alt="Pet"
        style={styles.image}
      />
    );
  };

  const handlePreferenceChange = (index, value) => {
    const updated = [...preferences];
    updated[index] = value;
    setPreferences(updated);
  };

  const addPreferenceField = () => {
    setPreferences([...preferences, ""]);
  };

  const removePreferenceField = (index) => {
    const updated = preferences.filter((_, i) => i !== index);
    setPreferences(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = {
      dietaryPreferences: preferences.filter((p) => p.trim() !== "")
    };

    try {
      await doctorService.updateDietaryPreferencesForPet(petId, appointmentId, data);
      setMessage("Updated successfully.");
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div style={styles.error}>Error: {error}</div>;

  if (!appointment) {
    return <div style={styles.loading}>Loading appointment details...</div>;
  }

  const pet = appointment.pet || {};
  const user = appointment.appUser || {};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkup Details</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Appointment</h2>
        <p><strong>Date:</strong> {appointment.selectedDate || "N/A"} (
          {appointment.selectedDate
            ? new Date(appointment.selectedDate).toLocaleDateString("en-US", { weekday: "long" })
            : ""}
        )</p>
        <p><strong>Time:</strong> {appointment.startTime} - {appointment.endTime}</p>
        <p><strong>Price:</strong> ${appointment.price}</p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Owner Information</h2>
        <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Pet Information</h2>
        <p><strong>Name:</strong> {pet.petName}</p>
        <p><strong>Weight:</strong> {pet.weight} kg</p>
        <p><strong>Age:</strong> {pet.age} years</p>
        <p><strong>Last Vet Visit:</strong> {pet.lastVetVisit || "N/A"}</p>
        <p><strong>Category:</strong> {
          pet.petCategory?.MSCategory
            ? Object.entries(pet.petCategory.MSCategory).map(([key, value]) => `${key}: ${value}`).join(", ")
            : "Loading..."
        }</p>
        {renderImage(pet.image)}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Vaccination Records</h2>
        {pet.vaccinationRecord && Object.keys(pet.vaccinationRecord).length > 0 ? (
          <ul>
            {Object.entries(pet.vaccinationRecord).map(([vaccine, date]) => (
              <li key={vaccine}>{vaccine}: {new Date(date).toLocaleDateString()}</li>
            ))}
          </ul>
        ) : <p>No vaccination records.</p>}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Allergies</h2>
        {pet.allergies?.length > 0 ? (
          <ul>{pet.allergies.map((a, idx) => <li key={idx}>{a}</li>)}</ul>
        ) : <p>No allergies listed.</p>}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Medical Conditions</h2>
        {pet.medicalConditions?.length > 0 ? (
          <ul>{pet.medicalConditions.map((c, idx) => <li key={idx}>{c}</li>)}</ul>
        ) : <p>No medical conditions listed.</p>}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Dietary Preferences</h2>
        <form onSubmit={handleSubmit}>
          {preferences.map((pref, index) => (
            <div key={index} style={styles.inputGroup}>
              <input
                type="text"
                value={pref}
                onChange={(e) => handlePreferenceChange(index, e.target.value)}
                placeholder={`Preference #${index + 1}`}
                required
                style={styles.input}
              />
              {preferences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePreferenceField(index)}
                  style={styles.removeBtn}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addPreferenceField} style={styles.addBtn}>
            + Add Preference
          </button>

          <div style={{ marginTop: 20 }}>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Updating..." : "Submit"}
            </button>
          </div>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    padding: "2rem",
    color: "#000",
    backgroundColor: "#FAFAFA",
    maxWidth: "900px",
    margin: "0 auto"
  },
  title: {
    color: "#64B5F6",
    fontSize: "2rem",
    marginBottom: "2rem"
  },
  section: {
    marginBottom: "2rem",
    padding: "1.5rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
  },
  sectionTitle: {
    fontSize: "1.3rem",
    color: "#333",
    borderBottom: "1px solid #ccc",
    paddingBottom: "0.5rem",
    marginBottom: "1rem"
  },
  image: {
    maxWidth: "150px",
    maxHeight: "150px",
    marginTop: "1rem"
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px"
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  removeBtn: {
    marginLeft: "10px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer"
  },
  addBtn: {
    marginTop: "10px",
    backgroundColor: "#64B5F6",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer"
  },
  submitBtn: {
    backgroundColor: "#64B5F6",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer"
  },
  backBtn: {
    marginTop: "20px",
    backgroundColor: "#bbb",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer"
  },
  message: {
    marginTop: "15px",
    color: "#388E3C"
  },
  loading: {
    padding: "2rem",
    fontFamily: "'Poppins', sans-serif"
  },
  error: {
    padding: "2rem",
    color: "red",
    fontFamily: "'Poppins', sans-serif"
  }
};

export default PassedAppDtls;
