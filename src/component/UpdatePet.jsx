import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../service/userservice";
import {jwtDecode} from "jwt-decode";
const ALLERGY_OPTIONS = [
  "Pollen", "Dust", "Mold spores", "Household cleaning products",
  "Perfumes", "Beef", "Chicken", "Eggs", "Shampoos or grooming products"
];

const MEDICAL_CONDITION_OPTIONS = [
  "Diabetes", "Arthritis", "Heart Disease", "IVDD",
  "Fractures", "strains", "Pneumonia", "Anemia"
];

const VACCINE_OPTIONS = [
  "Rabies", "Parvo", "Distemper", "DHPP / DA2PP", "Leptospirosis", "FVRCP"
];
const UpdatePet = () => {
  const { petId, categoryId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // ✅ add this line

  const [error, setError] = useState(null);
  const [newVaccineName, setNewVaccineName] = useState("");
  const [newVaccineDate, setNewVaccineDate] = useState("");
  const [pet, setPet] = useState({
    petName: "",
    gender: "",
    weight: "",
    age: "",
    vaccinationRecord: {},
    medicalConditions: [],
    allergies: [],
    lastVetVisit: "",
    image: "",
    categoryId: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
 const [userId, setUserId] = useState(null);



useEffect(() => {
    if (!token) {
      setMessage({ text: "No token provided", type: "error" });
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.appUserId) {
        setUserId(decoded.appUserId);
      } else {
        setMessage({ text: "Invalid token structure - missing appUserId", type: "error" });
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      setMessage({ text: "Invalid token", type: "error" });
    }
  }, [token]);








  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) {
        console.error("petId is undefined!");
        setError("Invalid Pet ID.");
        setLoading(false);
        return;
      }

    


      try {
        const response = await userService.getPetById(petId, token);
        let petData = response.data;

        // Remove authorities if nested inside petUserId
        if (petData.petUserId && petData.petUserId.authorities) {
          delete petData.petUserId.authorities;
        }

        const validCategoryId = categoryId && !isNaN(categoryId) ? parseInt(categoryId) : petData.categoryId;

        setPet({
          ...petData,
          categoryId: validCategoryId,
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to load pet details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId, categoryId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPet((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVaccination = () => {
    if (!newVaccineName.trim() || !newVaccineDate) return;
    const formattedDate = formatDate(newVaccineDate);
    setPet((prev) => ({
      ...prev,
      vaccinationRecord: {
        ...prev.vaccinationRecord,
        [newVaccineName.trim()]: formattedDate,
      },
    }));
    setNewVaccineName("");
    setNewVaccineDate("");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // yyyy-MM-dd
  };

  const handleVaccinationRecordChange = (vaccine, date) => {
    const formattedDate = formatDate(date);
    setPet((prev) => ({
      ...prev,
      vaccinationRecord: {
        ...prev.vaccinationRecord,
        [vaccine]: formattedDate,
      },
    }));
  };

  const handleRemoveVaccination = (vaccineName) => {
    const updatedRecord = { ...pet.vaccinationRecord };
    delete updatedRecord[vaccineName];
    setPet((prev) => ({
      ...prev,
      vaccinationRecord: updatedRecord,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      // Exclude petUserId before update
      const { petUserId, ...petWithoutUser } = pet;

      const updatedPet = {
        ...petWithoutUser,
        categoryId: parseInt(pet.categoryId) || 1,
      };

      await userService.updatePet(petId, pet.categoryId, updatedPet);
      setMessage("✅ Pet updated successfully!");
      setTimeout(() => navigate("/user/getpets"), 1500);
    } catch (error) {
      setMessage("❌ Failed to update pet. Please check your data and try again.");
      console.error("Update error:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPet({ ...pet, image: reader.result.split(",")[1] });
      };
      reader.onerror = (error) => {
        console.error("Error converting image to Base64: ", error);
      };
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          {error}
          <button className="btn btn-link" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');


        body, h1, h2, h3, h4, h5, h6, p, label, input, button, textarea {
          font-family: 'Poppins', sans-serif !important;
        }

        .card-header.bg-primary {
          background-color: #3FEDF1 !important;
          border-bottom: none;
          color: #000;
          font-weight: 700;
          font-size: 1.8rem;
        }

        .btn-primary {
          background-color: #FEA70F !important;
          border-color: #FEA70F !important;
          color: #000 !important;
          font-weight: 700;
          transition: background-color 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #e39500 !important;
          border-color: #e39500 !important;
          color: #000 !important;
        }

        .btn-outline-secondary {
          font-weight: 700;
          color: #FEA70F !important;
          border-color: #FEA70F !important;
          transition: all 0.3s ease;
        }

        .btn-outline-secondary:hover {
          background-color: #FEA70F !important;
          color: #000 !important;
        }

        .form-label {
          font-weight: 700;
          color: #444;
        }

        .form-control {
          border-radius: 8px;
          border: 1.5px solid #3FEDF1;
          transition: border-color 0.3s ease;
        }

        .form-control:focus {
          border-color: #FEA70F;
          box-shadow: 0 0 6px #FEA70F;
          outline: none;
        }

        .card {
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(63, 237, 241, 0.3);
          border: none;
        }

        .card-body {
          background-color: #fefefe;
          padding: 2rem;
        }

        .btn-success {
          background-color: #3FEDF1 !important;
          border-color: #3FEDF1 !important;
          color: #000 !important;
          font-weight: 700;
          transition: background-color 0.3s ease;
        }

        .btn-success:hover {
          background-color: #2cc0c5 !important;
          border-color: #2cc0c5 !important;
          color: #000 !important;
        }

        .btn-danger {
          background-color: #FEA70F !important;
          border-color: #FEA70F !important;
          color: #000 !important;
          font-weight: 700;
          transition: background-color 0.3s ease;
        }

        .btn-danger:hover {
          background-color: #e39500 !important;
          border-color: #e39500 !important;
          color: #000 !important;
        }

        .btn:hover {
          opacity: 0.9;
        }

        h2, h3, h4 {
          font-weight: 700;
          color: #3FEDF1;
          margin-bottom: 1rem;
        }

        .spinner-border {
          color: #3FEDF1;
          width: 4rem;
          height: 4rem;
        }

        .alert {
          border-radius: 12px;
          font-weight: 700;
        }

        /* Vaccination inputs */
        .vaccination-row input.form-control {
          border-radius: 6px;
          border: 1px solid #3FEDF1;
        }

        /* Responsive fixes */
        @media (max-width: 576px) {
          .card-body {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="container mt-4 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-center">
                Update Pet Information
              </div>
              <div className="card-body">
                {message && (
                  <div
                    className={`alert ${
                      message.includes("✅") ? "alert-success" : "alert-danger"
                    } text-center`}
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Pet Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="petName"
                        value={pet.petName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-control"
                        name="gender"
                        value={pet.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Weight (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="weight"
                        value={pet.weight}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Age</label>
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={pet.age}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <h3>Upload Image</h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="form-control"
                    />
                    {pet.image && (
                      <img
                        src={`data:image/jpeg;base64,${pet.image}`}
                        alt="Pet"
                        style={{ marginTop: "10px", maxWidth: "150px", borderRadius: "12px" }}
                      />
                    )}
                  </div>

                  <div>
                    <h4>Vaccination Record</h4>
                    <div className="row g-2 align-items-end mb-3 vaccination-row">
                      <div className="col-md-5">
                        <select
  className="form-select"
  value={newVaccineName}
  onChange={(e) => setNewVaccineName(e.target.value)}
>
  <option value="">Select Vaccine</option>
  {VACCINE_OPTIONS.map((vaccine, idx) => (
    <option key={idx} value={vaccine}>{vaccine}</option>
  ))}
</select>

                      </div>
                      <div className="col-md-5">
                        <input
                          type="date"
                          className="form-control"
                          value={newVaccineDate}
                          onChange={(e) => setNewVaccineDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-success w-100"
                          onClick={handleAddVaccination}
                          disabled={!newVaccineName || !newVaccineDate}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {Object.entries(pet.vaccinationRecord).map(([vaccine, date]) => (
                      <div key={vaccine} className="mb-2 d-flex align-items-center">
                        <input className="form-control me-2" value={vaccine} disabled />
                        <input
                          type="date"
                          className="form-control me-2"
                          value={date}
                          onChange={(e) => handleVaccinationRecordChange(vaccine, e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveVaccination(vaccine)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3 mt-4">
                    <label className="form-label">Medical Conditions</label>
                   {pet.medicalConditions.map((cond, i) => (
  <div key={i} className="mb-2 d-flex align-items-center">
    <select
      className="form-select me-2"
      value={cond}
      onChange={(e) =>
        setPet((prev) => {
          const updated = [...prev.medicalConditions];
          updated[i] = e.target.value;
          return { ...prev, medicalConditions: updated };
        })
      }
    >
      <option value="">Select Condition</option>
      {MEDICAL_CONDITION_OPTIONS.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
    <button
      type="button"
      className="btn btn-sm btn-danger"
      onClick={() =>
        setPet((prev) => {
          const updated = [...prev.medicalConditions];
          updated.splice(i, 1);
          return { ...prev, medicalConditions: updated };
        })
      }
    >
      Remove
    </button>
  </div>
))}
<button
  type="button"
  className="btn btn-sm btn-outline-secondary"
  onClick={() => setPet((prev) => ({ ...prev, medicalConditions: [...prev.medicalConditions, ""] }))}
>
  Add Condition
</button>

                  </div>

                  <div className="mb-3">
                    <label className="form-label">Allergies</label>
                   {pet.allergies.map((allergy, i) => (
  <div key={i} className="mb-2 d-flex align-items-center">
    <select
      className="form-select me-2"
      value={allergy}
      onChange={(e) =>
        setPet((prev) => {
          const updated = [...prev.allergies];
          updated[i] = e.target.value;
          return { ...prev, allergies: updated };
        })
      }
    >
      <option value="">Select Allergy</option>
      {ALLERGY_OPTIONS.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
    <button
      type="button"
      className="btn btn-sm btn-danger"
      onClick={() =>
        setPet((prev) => {
          const updated = [...prev.allergies];
          updated.splice(i, 1);
          return { ...prev, allergies: updated };
        })
      }
    >
      Remove
    </button>
  </div>
))}
<button
  type="button"
  className="btn btn-sm btn-outline-secondary"
  onClick={() => setPet((prev) => ({ ...prev, allergies: [...prev.allergies, ""] }))}
>
  Add Allergy
</button>

                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Vet Visit</label>
                      <input
                        type="date"
                        className="form-control"
                        name="lastVetVisit"
                        value={pet.lastVetVisit || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Update Pet
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/user/getpets")}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePet;
