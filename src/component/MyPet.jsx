import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import UserService from "../service/userservice";
import {jwtDecode} from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import SideImage from "../assets/cb7406436111647efd94e16f849faedd.jpg"; // Adjust path if needed

const MyPet = ({ token }) => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const [petStatus, setPetStatus] = useState("");

  // Decode JWT and get user ID
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

  // Fetch categories and build map
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

        const map = {};
        transformedCategories.forEach((cat) => {
          map[cat.id] = cat;
        });
        setCategoriesMap(map);
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















  // Fetch pet by petId param
  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) {
        setMessage({ text: "No pet ID provided in URL", type: "error" });
        setLoading(false);
        return;
      }
      setLoading(true);
      setMessage({ text: "", type: "" });
      try {
        const response = await UserService.getPetById(petId);
       if (response.data) {
  setPet(response.data);
  setPetStatus(response.data.status || ""); // e.g., Lost, Adopted, For Adoption

        } else {
          setMessage({ text: "Pet not found", type: "info" });
        }
      } catch (error) {
        console.error("Failed to fetch pet:", error);
        setMessage({
          text: error.response?.data?.message || "Failed to load pet.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  // Render base64 image
 // Render base64 image
const renderImage = (base64) => {
  if (!base64) return <span>No Image</span>;
  try {
    return (
      <img
        src={`data:image/jpeg;base64,${base64}`}
        alt="Pet"
        className="card-img-pet"
      />
    );
  } catch (error) {
    console.error("Image rendering error:", error);
    return <span>Invalid Image</span>;
  }
};

  // Delete pet handler
  const handleDelete = async (id) => {
    try {
      const confirmation = window.confirm("Are you sure you want to delete this pet?");
      if (confirmation) {
        await UserService.deletePet(id);
        setPet(null);
        setMessage({ text: "Pet deleted successfully", type: "success" });
        navigate("/user/getpets"); 
      }
    } catch (error) {
      console.error("Failed to delete pet:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to delete pet.",
        type: "error",
      });
    }
  };

  // Update pet handler
  const handleUpdate = (id, categoryId) => {
    navigate(`/user/updatepet/${id}/${categoryId}`);
  };

const handleNavigateToAdoptionPost = (petId, userId) => {
  navigate(`/user/addforadoptionpost/${userId}`, { state: { petId } });
};


const handleNavigateToLostPost = (petId, userId) => {
  navigate(`/user/addfoundlostpost/${userId}`, { state: { petId } });
};


  const handleMarkAsFound = async (petId, postId) => {
  try {
    await UserService.markAsFound(pet.petId, pet.lostPostId);
    setPetStatus("Adopted");
  } catch (error) {
    console.error("Failed to mark pet as found:", error);
    setMessage({
      text: error.response?.data?.message || "Failed to mark pet as found.",
      type: "error",
    });
  }
};



const handleCancelAdoption = async (petId, postId) => {
  try {
    await UserService.cancelForAdoption(petId, postId);
    setPet((prev) => ({ ...prev, forAdoption: false }));
    setMessage({ text: "Adoption canceled successfully.", type: "success" });
  } catch (error) {
    console.error("Failed to cancel adoption:", error);
    setMessage({
      text: error.response?.data?.message || "Failed to cancel adoption.",
      type: "error",
    });
  }
};


  if (loading) return <div className="text-center mt-5">Loading pet...</div>;

  return (
   
 <>
 <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #E5E5E5;
    margin: 0;
    padding: 0;
    color: #000000;
  }

  .pet-container {
   max-width: 600px;
    margin: 3rem auto;
  padding: 2rem 2rem;
  
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  h2 {
    color: #13B6B9;
    font-size: 2.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
  }

  .card {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
   
    backdrop-filter: blur(8px);
   
      background: rgba(19, 182, 185, 0.2); /* 20% opacity */
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  }

  .card-body {
    flex: 1 1 60%;
    min-width: 280px;
  }

  .card-title {
    font-size: 2rem;
   color: #13B6B9;
    margin-bottom: 1rem;
  }

  .card-text {
    font-size: 1.1rem;
    line-height: 1.6;
  }
.card-img-pet {
  max-width: 300px;
  width: 100%;
  height: auto;
  border-radius: 16px;
  border: 4px solid #14213D;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  object-fit: cover;
}

  .card-img {
  flex: 1 1 35%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 1rem;
}

  .card-img img {
  max-width: 300px;
  width: 100%;
  height: auto;
  border-radius: 16px;
  border: 4px solid #14213D;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  object-fit: cover;
}

  .section-heading {
    font-size: 1.25rem;
    color: #14213D;
    margin-top: 1.5rem;
    font-weight: bold;
  }

  ul.list-unstyled {
    padding-left: 1rem;
  }

  .list-unstyled li {
    margin-bottom: 0.5rem;
  }

 .btn {
    background-color: #FFA100;
    color: #fff;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: background 0.2s ease-in-out;
  }

  .btn-success {
    background-color: #FFA100 !important;
    color: #fff !important;
  }

  .btn-warning {
   background-color: #FFA100 !important;
    color: #fff !important;
  }

  .btn-info {
    background-color: #FFA100 !important;
    color: #fff !important;
  }

  .btn-danger {
  background-color: #FFA100 !important;
    color: #fff !important;
  }

  .btn:hover {
    background-color: #e39100;
    transform: translateY(-1px);
  }

  .card-footer {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
    .attribute-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}


.side-image-wrapper {
  flex: 0 0 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.side-img {
  width: 500px;
  height: auto;
  border-radius: 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  object-fit: cover;
  margin-top: 3rem;
}

.page-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 3rem;
  padding: 2rem;
  min-height: 100vh;
  background-color: #E5E5E5;
}


.pet-container {
  flex:  0 0 60%;
  background: #FFFFFF;
   padding: 2rem 3rem;

  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-width: 8000px;
}

.badge-pill {
  background-color: #13B6B9;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    font-weight: 500;
  font-size: 0.95rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: inline-block;
  white-space: nowrap;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  min-width: 160px;
  height: 45px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  text-align: center;
}

  .alert {
    border-radius: 8px;
    font-weight: 500;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .text-center {
    text-align: center;
  }

 @media (max-width: 992px) {
  .page-wrapper {
    flex-direction: column;
    padding: 1rem;
  }

  .side-img {
    max-width: 100%;
    width: 100%;
  }

  .pet-container {
    width: 100%;
    flex: 1 1 auto;
  }
}
`}</style>
  
  <div className="page-wrapper">
  <div className="side-image-wrapper">
    <img src={SideImage} alt="Dog and couple" className="side-img" />
  </div>

  <div className="pet-container">
    <h2>🐶 My Pet Details</h2>

    {message.text && (
      <div
        className={`alert alert-${
          message.type === "error"
            ? "danger"
            : message.type === "info"
            ? "info"
            : "success"
        }`}
      >
        {message.text}
      </div>
    )}

    {!pet ? (
      <div className="alert alert-info">No pet data available.</div>
    ) : (
     <div className="card shadow">
  <div className="card-body d-flex flex-wrap justify-content-between align-items-start">
    {/* LEFT COLUMN: TEXT */}
    <div style={{ flex: "1 1 60%", minWidth: "250px" }}>
      <h5 className="card-title">{pet.petName || "Unnamed Pet"}</h5>
     <div className="attribute-badges">
  <span className="badge-pill">🐾 Gender: {pet.gender || "Unknown"}</span>
  <span className="badge-pill">🎂 Age: {pet.age || "Unknown"} yrs</span>
  <span className="badge-pill">⚖️ Weight: {pet.weight || "Unknown"} kg</span>
  <span className="badge-pill">🩺 Last Vet Visit: {pet.lastVetVisit || "Unknown"}</span>
</div>

<h6 className="section-heading">📦 Category</h6>
<div className="attribute-badges">
  {pet.petCategory?.MSCategory ? (
    Object.entries(pet.petCategory.MSCategory).map(([key, value], idx) => (
      <span key={idx} className="badge-pill">
        {key}: {value}
      </span>
    ))
  ) : (
    <span className="badge-pill">Loading...</span>
  )}
</div>

     <h6 className="section-heading">🩺 Vaccinations</h6>
{pet.vaccinationRecord && Object.keys(pet.vaccinationRecord).length > 0 ? (
  <div className="attribute-badges">
    {Object.entries(pet.vaccinationRecord).map(([name, date], i) => (
      <span key={i} className="badge-pill">{name}: {date}</span>
    ))}
  </div>
) : (
  <p>No vaccinations recorded.</p>
)}<h6 className="section-heading">⚕️ Medical Conditions</h6>
{pet.medicalConditions?.length ? (
  <div className="attribute-badges">
    {pet.medicalConditions.map((cond, i) => (
      <span key={i} className="badge-pill">{cond}</span>
    ))}
  </div>
) : (
  <p>No medical conditions.</p>
)}

<h6 className="section-heading">🍽 Dietary Preferences</h6>
{pet.dietaryPreferences?.length ? (
  <div className="attribute-badges">
    {pet.dietaryPreferences.map((pref, i) => (
      <span key={i} className="badge-pill">{pref}</span>
    ))}
  </div>
) : (
  <p>No dietary preferences.</p>
)}

<h6 className="section-heading">🌼 Allergies</h6>
{pet.allergies?.length ? (
  <div className="attribute-badges">
    {pet.allergies.map((allergy, i) => (
      <span key={i} className="badge-pill">{allergy}</span>
    ))}
  </div>
) : (
  <p>No allergies.</p>
)}
    </div>

    {/* RIGHT COLUMN: IMAGE */}
    <div style={{ flex: "1 1 30%", minWidth: "150px", textAlign: "right" }}>
      {renderImage(pet.image)}
    </div>
  </div>

  {/* ACTION BUTTONS */}
<div className="d-flex flex-wrap gap-2 justify-content-start mb-3">
<button
  className="btn btn-success"
  onClick={() =>
    pet.forAdoption
      ? handleCancelAdoption(pet.petId, pet.adoptPostId)
      : handleNavigateToAdoptionPost(pet.petId, userId)
  }
>
  🐾 {pet.forAdoption ? "Cancel Adoption" : "Mark for Adoption"}
</button>



  {petStatus === "Lost" ? (
    <button className="btn btn-info" onClick={() => handleMarkAsFound(pet.petId , pet.lostPostId)}>
      🔍 Mark as Found
    </button>
  ) : (
 <button className="btn btn-warning" onClick={() => handleNavigateToLostPost(pet.petId, userId)}>
  📍 Mark as Lost
</button>


  )}
</div>

<div className="d-flex flex-wrap gap-2">
  <button
    className="btn btn-warning"
    onClick={() => handleUpdate(pet.petId, pet.petCategory?.categoryId)}
  >
    ✏️ Edit Pet
  </button>

  <button
    className="btn btn-danger"
    onClick={() => handleDelete(pet.petId)}
  >
    🗑 Delete
  </button>
</div>
</div>

    )}
  </div>
  </div>
</>
  );
};

MyPet.propTypes = {
  token: PropTypes.string.isRequired,
};

export default MyPet;
