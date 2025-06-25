import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../service/ppservice";
import { jwtDecode } from "jwt-decode";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaBoxOpen,
  FaTags,
  FaEdit,
  FaPowerOff,
} from "react-icons/fa";
import ppservice from "../service/ppservice";

const ProductList = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [categoriesMap, setCategoriesMap] = useState({});
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [averageRatings, setAverageRatings] = useState({});
  const navigate = useNavigate();
 const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded.appUserId) {
        setUserId(decoded.appUserId);
      } else {
        setError("Invalid token structure");
      }
    } catch (err) {
      console.error("Token decoding error:", err);
      setError("Invalid token");
    }
  }, [token]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return;
      try {
        const response = await ProductService.getAllProducts(userId);
        const productsData = response.data || [];
        setProducts(productsData);
        await fetchRatings(productsData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load products.");
      }
    };
    fetchProducts();
  }, [userId]);


 useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ppservice.getProductCategories();
       const formatted = response.data.map((item) => ({
          id: item.category_category_id,
          mscategory: item.mscategory,
        }));
        setCategories(formatted);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);


const getCategoryName = (categoryId) => {
  // assuming categories is your categories list with .id fields
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return "Unknown";
  
  if (typeof cat.mscategory === "object" && cat.mscategory !== null) {
    return Object.values(cat.mscategory).join(", ");
  }
  
  return cat.mscategory || "Unknown";
};


  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  const fetchRatings = async (products) => {
    try {
      const ratings = {};
      await Promise.all(
        products.map(async (product) => {
          const res = await ProductService.getProductAverageRating(product.productId);
          ratings[product.productId] = res.data || 0;
        })
      );
      setAverageRatings(ratings);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const handleUpdate = (categoryId, productId) => {
    navigate(`/pp/updateproduct/${categoryId}/${productId}`);
  };

  const toggleActiveStatus = async (product) => {
    setUpdatingProductId(product.productId);
    try {
      if (product.status === "available") {
        await ProductService.inactiveProduct(product.productId);
        setProducts((prev) =>
          prev.map((p) =>
            p.productId === product.productId ? { ...p, status: "inactive" } : p
          )
        );
      } else {
        await ProductService.activeProduct(product.productId);
        setProducts((prev) =>
          prev.map((p) =>
            p.productId === product.productId ? { ...p, status: "available" } : p
          )
        );
      }
    } catch (err) {
      alert("Failed to update product status");
      console.error(err);
    } finally {
      setUpdatingProductId(null);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={"full" + i} color="#FF9800" />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" color="#FF9800" />);
    for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={"empty" + i} color="#FF9800" />);
    return stars;
  };
  return (

    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "auto",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#FF9800" }}>
        <FaBoxOpen style={{ marginRight: 8 }} /> Your Products
      </h2>

      {error && <p style={{ color: "#c62828", textAlign: "center" }}>{error}</p>}

      {products.length === 0 ? (
        
        <p style={{ textAlign: "center", fontStyle: "italic" }}>No products found.</p>
        
      ) : (
        <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/pp/addproduct")}
            style={{
              backgroundColor: "#FF9800",
              border: "none",
              color: "#ffffff",
              padding: "0.6rem 1.2rem",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ➕ Add Product
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {products.map((product) => {
          const rating = averageRatings[product.productId];
console.log("productCategory for product", product.productId, ":", product.productCategory);

          return (
            <div
              key={product.productId}
              style={{
                border: "1px solid #000000",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "1rem",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  marginBottom: "0.5rem",
                  fontWeight: "700",
                  fontSize: "1.25rem",
                  color: "#FF9800",
                }}
              >
                <FaTags style={{ marginRight: 6 }} /> {product.productName}
              </h3>

              <img
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.productName}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              />

              <p>
                <strong>Average Rating:</strong>{" "}
                {rating !== undefined && rating > 0 ? renderStars(rating) : "No ratings"}
              </p>

              <p style={{ fontSize: "0.9rem", color: "#000000" }}>
                <strong>Description:</strong> {product.description}
              </p>
<p>
  <strong>Category:</strong>{" "}
  {(() => {
    const cat = product.productCategory;

    if (!cat) return "Loading category...";

    // If productCategory is a number, treat it as categoryId
    if (typeof cat === "number") {
      return getCategoryName(cat);
    }

    // If productCategory is an object
    if (typeof cat === "object") {
      if (cat.categoryId) {
        return getCategoryName(cat.categoryId);
      }

      // fallback to mscategory if it exists and is string or object
      if (cat.mscategory) {
        if (typeof cat.mscategory === "object") {
          return Object.values(cat.mscategory).join(", ");
        }
        return cat.mscategory;
      }
    }

    return "Unknown category";
  })()}
</p>



              <h4
                style={{
                  fontWeight: "700",
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                  borderBottom: `2px solid #FF9800`,
                  paddingBottom: "0.3rem",
                }}
              >
                Variants
              </h4>

              <div style={{ marginBottom: "1rem" }}>
                {Object.entries(product.stockByColorAndSize || {}).map(([key, stock]) => (
                  <p
                    key={key}
                    style={{ fontSize: "0.9rem", marginBottom: "0.3rem", color: "#000000" }}
                  >
                    <strong>{key}:</strong> {stock} in stock | Price: {" "}
                    <span style={{ color: "#FF9800" }}>
                      {product.priceByColorAndSize?.[key] ?? "N/A"} $
                    </span>
                  </p>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem" }}>
                <button
                  onClick={() =>
                    handleUpdate( product.productCategory?.categoryId, product.productId)
                  }
                  style={{
                    flex: 1,
                    backgroundColor: "#FF9800",
                    color: "#ffffff",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <FaEdit style={{ marginRight: 6 }} /> Update
                </button>

                <button
                  onClick={() => toggleActiveStatus(product)}
                  disabled={updatingProductId === product.productId}
                  style={{
                    flex: 1,
                    backgroundColor:
                      product.status === "available" ? "#000000" : "#FF9800",
                    color: "#ffffff",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  {product.status === "available" ? (
                    <>
                      <FaPowerOff style={{ marginRight: 6 }} />Deactivate
                    </>
                  ) : (
                    <>
                      <FaPowerOff style={{ marginRight: 6 }} />Activate
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;