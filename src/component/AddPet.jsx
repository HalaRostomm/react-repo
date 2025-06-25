import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserService from "../service/userservice";
import { jwtDecode } from "jwt-decode";
import petImage from '../assets/dogs-and-cats.jpg';
import { useNavigate } from "react-router-dom";
const AddPet = ({ token }) => {
  const initialPetState = {
    petName: "",
    gender: "",
    weight: "",
    age: "",
    vaccinationRecord: {},
    medicalConditions: [],
    allergies: [],
    lastVetVisit: "",
    categoryId: "",
    mscategory: "",
    image: "",
  };

  const [pet, setPet] = useState(initialPetState);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newVaccineName, setNewVaccineName] = useState("");
  const [newVaccineDate, setNewVaccineDate] = useState("");
const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded.appUserId) {
        setUserId(decoded.appUserId);
      } else {
        setMessage({ text: "Invalid token structure", type: "error" });
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      setMessage({ text: "Invalid token", type: "error" });
    }
  }, [token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await UserService.findPetCategories();
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid categories data format");
        }
        const transformedCategories = response.data.map((item) => ({
          id: item.category_category_id,
          value: item.mscategory_key,
          mscategory: item.mscategory,
        }));
        setCategories(transformedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setMessage({
          text: "Failed to load pet categories. Please refresh the page.",
          type: "error",
        });
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setPet((prev) => ({
      ...prev,
      categoryId: selectedCategoryId,
      mscategory: "",
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // yyyy-MM-dd
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

  const handleListChange = (listName, index, value) => {
    setPet((prev) => {
      const updated = [...prev[listName]];
      updated[index] = value;
      return { ...prev, [listName]: updated };
    });
  };

  const handleRemoveFromList = (listName, index) => {
    setPet((prev) => {
      const updated = [...prev[listName]];
      updated.splice(index, 1);
      return { ...prev, [listName]: updated };
    });
  };

  const handleAddToList = (listName) => {
    setPet((prev) => ({
      ...prev,
      [listName]: [...prev[listName], ""],
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    if (!userId) {
      setMessage({ text: "User authentication required", type: "error" });
      setIsSubmitting(false);
      return;
    }

    try {
      const formattedData = {
        ...pet,
        categoryId: Number(pet.categoryId),
      };

      await UserService.addNewPet(userId, pet.categoryId, formattedData);
      setMessage({ text: "Pet added successfully!", type: "success" });
      setPet(initialPetState);
      navigate("user/getpets");
    } catch (error) {
      console.error("Pet addition error:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to add pet. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
  <style>
    {`
     @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

      body, input, select, button, textarea {
        font-family: 'Poppins', sans-serif ;
        color: #000000;
      }

      .card {
        border-radius: 16px;
        border: 2px solid #FCA311;
        background-color: #FFFFFF;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
      }

      .card-header {
        background-color: #FCA311;
         font-family: 'Poppins', sans-serif;
        color: #14213D;
        font-weight: bold;
        font-size: 1.5rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        padding: 1rem;
        border-radius: 16px 16px 0 0;
      }

      .form-label {
        font-weight: bold;
        color: #14213D;
      }

      .btn-primary {
        background-color: #FCA311;
        border: none;
        color: #FFFFFF;
        font-weight: bold;
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
        transition: background 0.3s ease;
      }

      .btn-primary:hover {
        background-color: #e29000;
      }

      .btn-success {
        background-color: #14213D;
        color: #FFFFFF;
        font-weight: bold;
        border: none;
      }

      .btn-success:hover {
        background-color: #000000;
      }

      .btn-secondary {
        background-color: #E5E5E5;
        color: #000000;
      }

      .btn-danger {
        background-color: #FFE5E5;
        color: #D32F2F;
        font-weight: bold;
        border: none;
      }

      h4 {
        color: #FCA311;
        font-weight: bold;
        margin-top: 2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      legend.h6 {
        color: #3FEDF1;
        font-weight: bold;
      }

      .alert-success {
        background-color: #E8FDFB;
        border-left: 5px solid #3FEDF1;
        color: #000;
      }

      .alert-danger {
        background-color: #FFE8E8;
        border-left: 5px solid #f44336;
        color: #000;
      }

      .form-section-icon {
        color: #FCA311;
        font-size: 1.3rem;
      }

      .paw-icon {
        color: #14213D;
        font-size: 1.6rem;
      }

      .spinner-border-sm {
        vertical-align: middle;
      }

      input[type="file"]::file-selector-button {
        background-color: #FCA311;
        color: #FFF;
        font-weight: bold;
        border: none;
        padding: 0.4rem 1rem;
        margin-right: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
      }

      input[type="file"]::file-selector-button:hover {
        background-color: #e29000;
      }
    `}
  </style>

  

      
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="image-section" style={{ backgroundImage: `url(${petImage})` }} />

            <header className="card-header">
              <h2 className="h5 mb-0 text-center">Add New Pet</h2>
            </header>
            <div className="card-body">
              {message.text && (
                <div className={`alert alert-${message.type === "error" ? "danger" : "success"}`}>
                  {message.text}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <fieldset className="mb-4">
                  <legend className="h6 text-muted border-bottom pb-2">Basic Information</legend>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Pet Name *</label>
                      <input
                        name="petName"
                        type="text"
                        className="form-control"
                        value={pet.petName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Gender *</label>
                      <select
                        name="gender"
                        className="form-select"
                        value={pet.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">
  <i className="fas fa-image form-section-icon"></i> Upload Image
</label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Weight (kg) *</label>
                      <input
                        name="weight"
                        type="number"
                        className="form-control"
                        value={pet.weight}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Age (years) *</label>
                      <input
                        name="age"
                        type="number"
                        className="form-control"
                        value={pet.age}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Category */}
                <fieldset className="mb-4">
                  <legend className="h6 text-muted border-bottom pb-2">Category</legend>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Pet Category *</label>
                      <select
                        name="categoryId"
                        className="form-select"
                        value={pet.categoryId}
                        onChange={handleCategoryChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Breed/Type *</label>
                      <select
                        name="mscategory"
                        className="form-select"
                        value={pet.mscategory}
                        onChange={handleChange}
                        required
                        disabled={!pet.categoryId}
                      >
                        <option value="">Select Breed/Type</option>
                        {categories
                          .filter((c) => c.id === Number(pet.categoryId))
                          .map((c) => (
                            <option key={c.mscategory} value={c.mscategory}>
                              {c.mscategory}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </fieldset>
                <div className="col-md-6">
  <label className="form-label">Last Vet Visit</label>
  <input
    name="lastVetVisit"
    type="date"
    className="form-control"
    value={pet.lastVetVisit}
    onChange={handleChange}
  />
</div>

                {/* Vaccination Record */}
                <div className="mt-4">
                 <h4><i className="fas fa-syringe form-section-icon"></i>Vaccination Record</h4>
                  <div className="row g-2 align-items-end mb-3">
                    <div className="col-md-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Vaccine Name"
                        value={newVaccineName}
                        onChange={(e) => setNewVaccineName(e.target.value)}
                      />
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

                {/* Medical Conditions */}
                <div className="mt-4">
                 <h4><i className="fas fa-heartbeat form-section-icon"></i>Medical Conditions</h4>
                  {pet.medicalConditions.map((cond, i) => (
                    <div key={i} className="mb-2 d-flex align-items-center">
                      <input
                        className="form-control me-2"
                        value={cond}
                        onChange={(e) => handleListChange("medicalConditions", i, e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveFromList("medicalConditions", i)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddToList("medicalConditions")}
                    className="btn btn-sm btn-secondary mt-2"
                  >
                    Add Condition
                  </button>
                </div>

                {/* Allergies */}
                <div className="mt-4">
                <h4><i className="fas fa-allergies form-section-icon"></i>Allergies</h4>
                  {pet.allergies.map((allergy, i) => (
                    <div key={i} className="mb-2 d-flex align-items-center">
                      <input
                        className="form-control me-2"
                        value={allergy}
                        onChange={(e) => handleListChange("allergies", i, e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveFromList("allergies", i)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddToList("allergies")}
                    className="btn btn-sm btn-secondary mt-2"
                  >
                    Add Allergy
                  </button>
                </div>

                {/* Submit */}
                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Processing...
    </>
  ) : (
    <>
      <i className="fas fa-save me-2"></i> Save Pet Information
    </>
  )}
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

AddPet.propTypes = {
  token: PropTypes.string.isRequired,
};

export default AddPet;
