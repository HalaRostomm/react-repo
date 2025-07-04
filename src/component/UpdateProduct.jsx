import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../service/ppservice";
import { FaImage, FaEdit, FaBoxOpen } from "react-icons/fa";

const UpdateProduct = () => {
  const { categoryId, productId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const colors = {
    primary: "#FF9800",
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
  };
  const fontFamily = "'Poppins', sans-serif";

  const [product, setProduct] = useState({
    productId: "",
    productName: "",
    description: "",
    priceByColorAndSize: {},
    stockByColorAndSize: {},
    image: null,
  });

  useEffect(() => {
    ProductService.getProductById(productId)
      .then((res) => {
        const data = res.data;
        const priceMap =
          typeof data.priceByColorAndSize === "string"
            ? JSON.parse(data.priceByColorAndSize)
            : data.priceByColorAndSize || {};

        const stockMap =
          typeof data.stockByColorAndSize === "string"
            ? JSON.parse(data.stockByColorAndSize)
            : data.stockByColorAndSize || {};

        setProduct({
          ...data,
          priceByColorAndSize: priceMap,
          stockByColorAndSize: stockMap,
          image: data.image,
        });
      })
      .catch((err) => {
        setMessage("❌ Failed to load product details.");
        console.error("Fetch error:", err);
      });
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };


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

  const handlePriceStockChange = (e) => {
    const { name, value } = e.target;
    const [key, type] = name.split("_");

    setProduct((prev) => {
      const updated = { ...prev };
      if (type === "price") {
        updated.priceByColorAndSize[key] = value;
      } else if (type === "stock") {
        updated.stockByColorAndSize[key] = value;
      }
      return updated;
    });
  };
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    const base64 = reader.result.split(",")[1];
    setProduct((prev) => ({
      ...prev,
      image: base64,
    }));
  };
};

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProduct = {
      productName: product.productName,
      description: product.description,
      priceByColorAndSize: product.priceByColorAndSize,
      stockByColorAndSize: product.stockByColorAndSize,
      image: product.image,
    };

    ProductService.updateProduct(categoryId, productId, updatedProduct)
      .then(() => {
        setMessage("✅ Product updated successfully!");
        navigate("/pp/getallproducts");
      })
      .catch((err) => {
        setMessage("❌ Update failed.");
        console.error("Update error:", err);
      });
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "2rem", borderRadius: 10, background: colors.card, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontFamily }}>
      <h2 style={{ color: colors.primary, textAlign: "center", marginBottom: "1.5rem" }}>🛠️ Update Product</h2>

      {message && <p style={{ textAlign: "center", marginBottom: 16, color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "600", color: colors.text }}><FaBoxOpen /> Product Name:</label>
          <input
            type="text"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `1.5px solid ${colors.primary}`,
              borderRadius: 6,
              fontSize: "1rem",
              fontFamily,
              color: colors.text,
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "600", color: colors.text }}><FaEdit /> Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={4}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: `1.5px solid ${colors.primary}`,
              borderRadius: 6,
              fontSize: "1rem",
              fontFamily,
              color: colors.text,
            }}
          />
        </div>

      {product.image && (
  <img
    src={`data:image/jpeg;base64,${product.image}`}
    alt="Product Preview"
    style={{ width: "200px", height: "auto", marginBottom: "1rem" }}
  />
)}
  <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "600", color: colors.text }}><FaImage /> Choose New Image:</label>
         <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: 12 }} />
        {imagePreview && <img src={imagePreview} alt="preview" style={{ maxWidth: '100%', marginBottom: 16, borderRadius: 8 }} />}
      </div>

        {Object.keys(product.priceByColorAndSize).map((key) => (
          <div key={key} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "center" }}>
            <span style={{ minWidth: 100, fontWeight: 500, color: colors.text }}>{key}</span>
            <input
              type="number"
              name={`${key}_price`}
              placeholder="Price"
              value={product.priceByColorAndSize[key]}
              onChange={handlePriceStockChange}
              style={{
                width: "100px",
                padding: "0.3rem",
                borderRadius: 6,
                border: `1px solid ${colors.primary}`,
                fontFamily,
                color: colors.text,
              }}
            />
            <input
              type="number"
              name={`${key}_stock`}
              placeholder="Stock"
              value={product.stockByColorAndSize[key] || ""}
              onChange={handlePriceStockChange}
              style={{
                width: "100px",
                padding: "0.3rem",
                borderRadius: 6,
                border: `1px solid ${colors.primary}`,
                fontFamily,
                color: colors.text,
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: colors.primary,
            color: "#fff",
            padding: "0.75rem",
            fontSize: "1rem",
            fontWeight: "600",
            border: "none",
            borderRadius: 8,
            marginTop: "1rem",
            cursor: "pointer",
            fontFamily,
          }}
        >
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
