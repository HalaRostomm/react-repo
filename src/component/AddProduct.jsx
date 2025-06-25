import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ProductService from "../service/ppservice";
import {
  FaUpload,
  FaTags,
  FaListUl,
  FaAlignLeft,
  FaPalette,
  FaRulerCombined,
  FaBoxes,
} from 'react-icons/fa';

const colors = {
  primary: '#FF9800', // Orange
  secondary: '#FFFFFF', // White
  background: '#FFFFFF',
  text: '#000000', // Black
};

const fontFamily = "'Poppins', sans-serif";

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: colors.primary,
    boxShadow: 'none',
    minHeight: '45px',
    padding: '2px',
    fontSize: '1rem',
    backgroundColor: colors.secondary,
    '&:hover': { borderColor: colors.primary },
    fontFamily,
    color: colors.text,
  }),
  multiValueLabel: (styles) => ({ ...styles, fontFamily }),
  menu: (provided) => ({ ...provided, fontFamily }),
};

const AddProduct = ({ token }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [priceMap, setPriceMap] = useState({});
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});
  const [categoryIdMap, setCategoryIdMap] = useState({});
  const [userId, setUserId] = useState(null);
  const [product, setProduct] = useState();

  const colorOptions = ["Regular","Red", "Green", "Blue", "Yellow", "Black", "White"].map(color => ({ label: color, value: color.toLowerCase() }));
  const sizeOptions = ["Small", "Medium", "Large", "Regular"].map(size => ({ label: size, value: size.toLowerCase() }));
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.appUserId);
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, [token]);

  useEffect(() => {
    ProductService.getProductCategories().then((res) => {
      const data = res.data;
      const categoryMap = {};
      const idMap = {};
      data.forEach(({ category_category_id, mscategory_key, mscategory }) => {
        if (!categoryMap[mscategory_key]) categoryMap[mscategory_key] = [];
        categoryMap[mscategory_key].push(mscategory);
        idMap[mscategory] = category_category_id;
      });
      setMainCategories(Object.keys(categoryMap));
      setCategoryMap(categoryMap);
      setCategoryIdMap(idMap);
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        setImageFile(file);
        setImagePreview(reader.result);
        setProduct(prev => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !productName || !description || !imageFile) return alert("Please fill in all fields.");
    const data = {
      productName,
      description,
      image: product.image,
      stockByColorAndSize: stockMap,
      priceByColorAndSize: priceMap,
    };
    try {
      await ProductService.addNewProduct(selectedCategoryId, userId, data);
      alert("✅ Product added successfully!");
      navigate("/pp/getallproducts");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: colors.background,
      padding: "2rem"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          fontFamily,
          backgroundColor: colors.secondary,
          padding: '2rem',
          width: '100%',
          maxWidth: 750,
          borderRadius: 12,
          color: colors.text,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ color: colors.primary, marginBottom: '1.5rem' }}>
          <FaBoxes style={{ marginRight: 8 }} /> Add Product
        </h2>

        <label><FaUpload /> Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: 12 }} />
        {imagePreview && <img src={imagePreview} alt="preview" style={{ maxWidth: '100%', marginBottom: 16, borderRadius: 8 }} />}

        <label><FaTags /> Main Category</label>
        <select value={selectedMainCategory} onChange={e => {
          setSelectedMainCategory(e.target.value);
          setSubCategories(categoryMap[e.target.value] || []);
        }} style={{ marginBottom: 12, width: '100%', height: 45, paddingLeft: 10, fontFamily }}>
          <option value="">Select</option>
          {mainCategories.map(cat => <option key={cat}>{cat}</option>)}
        </select>

        <label><FaListUl /> Sub Category</label>
        <select value={selectedSubCategory} onChange={e => {
          setSelectedSubCategory(e.target.value);
          setSelectedCategoryId(categoryIdMap[e.target.value]);
        }} style={{ marginBottom: 12, width: '100%', height: 45, paddingLeft: 10, fontFamily }}>
          <option value="">Select</option>
          {subCategories.map(sub => <option key={sub}>{sub}</option>)}
        </select>

        <label><FaAlignLeft /> Name</label>
        <input value={productName} onChange={e => setProductName(e.target.value)} style={{ marginBottom: 12, width: '100%', height: 40, paddingLeft: 10, fontFamily }} />

        <label><FaAlignLeft /> Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ marginBottom: 12, width: '100%', paddingLeft: 10, fontFamily }} />

        <label><FaPalette /> Colors</label>
        <Select isMulti options={colorOptions} value={selectedColors} onChange={setSelectedColors} styles={customSelectStyles} />

        <label style={{ marginTop: 12 }}><FaRulerCombined /> Sizes</label>
        <Select isMulti options={sizeOptions} value={selectedSizes} onChange={setSelectedSizes} styles={customSelectStyles} />

        {selectedColors.length && selectedSizes.length ? (
          <>
            <h4 style={{ marginTop: 20, color: colors.primary }}>Variants</h4>
            {selectedColors.map(color => selectedSizes.map(size => {
              const key = `${color.value}-${size.value}`;
              return (
                <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ minWidth: 100 }}>{color.label} / {size.label}</span>
                  <input
                    type="number"
                    placeholder="Stock"
                    onChange={e => setStockMap(prev => ({ ...prev, [key]: +e.target.value }))}
                    style={{ width: 80, fontFamily }}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    onChange={e => setPriceMap(prev => ({ ...prev, [key]: +e.target.value }))}
                    style={{ width: 80, fontFamily }}
                  />
                </div>
              );
            }))}
          </>
        ) : null}

        <button
          type="submit"
          style={{
            marginTop: 20,
            backgroundColor: colors.primary,
            color: colors.secondary,
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: 6,
            fontWeight: "600",
            fontSize: "1rem",
            fontFamily,
            cursor: "pointer"
          }}
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
