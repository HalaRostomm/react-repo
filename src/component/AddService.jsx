import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import spService from "../service/spservice";

const AddService = ({ token }) => {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [categoryIdMap, setCategoryIdMap] = useState({});
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [disabledSubCategories, setDisabledSubCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.appUserId);
    } catch {
      setMessage({ text: "Invalid token", type: "error" });
    }
  }, [token]);

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await spService.getSelectedServiceCategories(userId);
        const allVals = res.data
          .filter(Boolean)
          .flatMap((item) => Object.values(item))
          .map((val) => val.toString());
        setDisabledSubCategories(allVals);
      } catch (err) {
        console.error(err);
      }
    };
    if (userId) fetchAssigned();
  }, [userId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await spService.getServiceCategories();
        const tempMap = {};
        const idMap = {};

        res.data.forEach(({ mscategory_key, mscategory, category_category_id }) => {
          if (!tempMap[mscategory_key]) tempMap[mscategory_key] = [];
          tempMap[mscategory_key].push(mscategory);
          idMap[`${mscategory_key}_${mscategory}`] = category_category_id;
        });

        setCategoryMap(tempMap);
        setMainCategories(Object.keys(tempMap));
        setCategoryIdMap(idMap);
      } catch {
        setMessage({ text: "Failed to load categories", type: "error" });
      }
    };
    fetchCategories();
  }, []);

  const handleMainChange = (e) => {
    const main = e.target.value;
    setSelectedMainCategory(main);
    setSubCategories(categoryMap[main] || []);
    setSelectedSubCategory("");
  };

  const handleSubChange = (e) => {
    const sub = e.target.value;
    setSelectedSubCategory(sub);
    setSelectedCategoryId(categoryIdMap[`${selectedMainCategory}_${sub}`]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !form.name || !form.description || !form.price) {
      return setMessage({ text: "Please fill in all fields", type: "error" });
    }
    if (disabledSubCategories.includes(selectedSubCategory)) {
      return setMessage({ text: "This subcategory is already assigned", type: "error" });
    }

    setIsSubmitting(true);
    try {
      await spService.addNewService(selectedCategoryId, userId, {
        ...form,
        price: parseFloat(form.price),
      });
      setMessage({ text: "✅ Service added successfully!", type: "success" });
      setForm({ name: "", description: "", price: "" });
      setSelectedMainCategory("");
      setSelectedSubCategory("");
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to add service",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    marginTop: "6px",
    marginBottom: "18px",
    fontSize: "15px",
    borderRadius: "6px",
    border: "1px solid #A3CEF1",
    backgroundColor: "#F0F4F8",
    color: "#274C77",
  };

  const labelStyle = {
    fontWeight: "600",
    fontSize: "14px",
    display: "block",
    color: "#274C77",
  };

  return (
    <div
      style={{
        maxWidth: "540px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "#E7ECEF",
        fontFamily: "'Poppins', sans-serif",
        boxShadow: "0 6px 20px rgba(96, 150, 186, 0.2)",
        color: "#274C77",
      }}
    >
      <h2 style={{ fontWeight: "700", color: "#274C77", textAlign: "center", marginBottom: "24px" }}>
        Add Service
      </h2>

      {message.text && (
        <div
          style={{
            backgroundColor: message.type === "error" ? "#F8D7DA" : "#D4EDDA",
            color: message.type === "error" ? "#721C24" : "#155724",
            padding: "10px 16px",
            borderRadius: "6px",
            marginBottom: "18px",
            fontWeight: "600",
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Main Category</label>
        <select
          value={selectedMainCategory}
          onChange={handleMainChange}
          required
          style={inputStyle}
        >
          <option value="">Select</option>
          {mainCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Subcategory</label>
        <select
          value={selectedSubCategory}
          onChange={handleSubChange}
          required
          style={inputStyle}
        >
          <option value="">Select</option>
          {subCategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Service Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleInputChange}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>Price</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleInputChange}
          style={inputStyle}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#6096BA",
            color: "#fff",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          {isSubmitting ? "Adding..." : "Add Service"}
        </button>
      </form>
    </div>
  );
};

AddService.propTypes = {
  token: PropTypes.string.isRequired,
};

export default AddService;
