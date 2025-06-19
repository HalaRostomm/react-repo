import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../service/ppservice";
import { jwtDecode } from "jwt-decode";
import { FaStar, FaStarHalfAlt, FaRegStar, FaBoxOpen, FaTags, FaEdit, FaPowerOff} from "react-icons/fa";
 // or FaSignOutAlt if it's for logout

const ProductList = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [categoriesMap, setCategoriesMap] = useState({});
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [averageRatings, setAverageRatings] = useState({});
  const navigate = useNavigate();

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
  document.body.style.backgroundColor = "#F7F0E0";
  return () => {
    document.body.style.backgroundColor = null; // Reset on unmount
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

  const handleUpdate = (productId, categoryId) => {
    navigate(`/pp/updateproduct/${productId}/${categoryId}`);
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

    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={"full" + i} color="gold" />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" color="gold" />);
    for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={"empty" + i} color="gold" />);
    return stars;
  };

  return (
    <div
      style={{
        fontFamily: "'Roboto Slab', serif",
        color: "#000000",
        backgroundColor: "#F7F0E0",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "auto",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#7F7B72" }}>
        <FaBoxOpen style={{ marginRight: 8 }} /> Your Products
      </h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {products.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>No products found.</p>
      ) : (
        <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/pp/addproduct")}
            style={{
              backgroundColor: "#7F7B72",
              border: "none",
              color: "#F7F0E0",
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
console.log("Product:", product);


          return (
            <div
              key={product.productId}
              style={{
                border: "1px solid #E5DED4",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgb(0 0 0 / 0.05)",
                padding: "1rem",
                backgroundColor: "#F1EADC",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  marginBottom: "0.5rem",
                  fontWeight: "700",
                  fontSize: "1.25rem",
                  color: "#7F7B72",
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

              <p style={{ fontSize: "0.9rem", color: "#444" }}>
                <strong>Description:</strong> {product.description}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {product.productCategory && product.productCategory.mscategory
                  ? Object.values(product.productCategory.mscategory).join(", ")
                  : "Loading category..."}
              </p>

              <h4
                style={{
                  fontWeight: "700",
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                  borderBottom: `2px solid #7F7B72`,
                  paddingBottom: "0.3rem",
                }}
              >
                Variants
              </h4>

              <div style={{ marginBottom: "1rem" }}>
                {Object.entries(product.stockByColorAndSize || {}).map(([key, stock]) => (
                  <p
                    key={key}
                    style={{ fontSize: "0.9rem", marginBottom: "0.3rem", color: "#444" }}
                  >
                    <strong>{key}:</strong> {stock} in stock | Price: {" "}
                    <span style={{ color: "#7F7B72" }}>
                      {product.priceByColorAndSize?.[key] ?? "N/A"} $
                    </span>
                  </p>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem" }}>
                <button
                  onClick={() =>
                    handleUpdate(product.productId, product.productCategory?.categoryId)
                  }
                  style={{
                    flex: 1,
                    backgroundColor: "#7F7B72",
                    color: "#F7F0E0",
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
                      product.status === "available" ? "#c62828" : "#2e7d32",
                    color: "#fff",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  {product.status === "available" ? (
                    <><FaPowerOff style={{ marginRight: 6 }} />Deactivate</>
                  ) : (
                    <><FaPowerOff  style={{ marginRight: 6 }} />Activate</>
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
