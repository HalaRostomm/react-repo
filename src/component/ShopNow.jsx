import React, { useState, useEffect } from "react";
import userService from "../service/userservice";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../service/authService";
import { Modal, Button, Form } from "react-bootstrap";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Design constants
const PRIMARY_COLOR = "#000000"; // black text
const ACCENT_COLOR = "#FFA100"; // orange buttons & icons
const CARD_BG_COLOR = "rgba(19, 182, 185, 0.2)"; // #13b6b9 with 20% opacity
const HEADER_COLOR = "#13b6b9";
const FONT_FAMILY = "'Poppins', sans-serif";

const loadPoppinsFont = () => {
  if (!document.getElementById("poppins-font")) {
    const link = document.createElement("link");
    link.id = "poppins-font";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
};

const ShopNow = () => {
  loadPoppinsFont();
  const { category, id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [averageRatings, setAverageRatings] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selection, setSelection] = useState({ color: "", size: "", quantity: 1 });
  const [stockLeft, setStockLeft] = useState(0);
  const [price, setPrice] = useState(0);
  const [categoriesMap, setCategoriesMap] = useState({});

  useEffect(() => {
    if (!category) return;

    const fetchCategories = async () => {
      try {
        const response = await userService.getProductCategories();
        const transformed = response.data.map((item) => ({
          id: item.category_category_id,
          key: item.mscategory_key,
          value: item.mscategory,
        }));
        const map = {};
        transformed.forEach((cat) => {
          map[cat.id] = cat;
        });
        setCategoriesMap(map);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    const fetchRatings = async (products) => {
      try {
        const ratings = {};
        await Promise.all(
          products.map(async (product) => {
            const res = await userService.productOverallRatings(product.productId);
            ratings[product.productId] = res.data || 0;
          })
        );
        setAverageRatings(ratings);
      } catch (err) {
        console.error("Error fetching ratings:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await userService.getAllProducts(category);
        setProducts(response.data);
        setMessage("");
        await fetchRatings(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setMessage("❌ Failed to fetch products.");
      }
    };

    fetchCategories();
    fetchProducts();
  }, [category]);

  const handleViewDetails = (productId) => {
    navigate(`/user/getproduct/${productId}`);
  };

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setSelection({ color: "", size: "", quantity: 1 });
    setStockLeft(0);
    setPrice(0);
    setShowModal(true);
  };

  const handleSelectionChange = (type, value) => {
    const newSelection = { ...selection, [type]: value };
    if (type === "color") {
      newSelection.size = "";
    }

    setSelection(newSelection);

    if (newSelection.color && newSelection.size && selectedProduct) {
      const key = `${newSelection.color}_${newSelection.size}`;
      const stock = selectedProduct.stockByColorAndSize?.[key] ?? 0;
      const itemPrice = selectedProduct.priceByColorAndSize?.[key] ?? 0;
      setStockLeft(stock);
      setPrice(itemPrice);
      setSelection((prev) => ({
        ...prev,
        quantity: stock > 0 ? 1 : 0,
      }));
    } else {
      setStockLeft(0);
      setPrice(0);
      setSelection((prev) => ({
        ...prev,
        quantity: 1,
      }));
    }
  };

  const handleQuantityChange = (delta) => {
    setSelection((prev) => {
      const newQuantity = Math.max(1, Math.min(stockLeft, prev.quantity + delta));
      return { ...prev, quantity: newQuantity };
    });
  };

  const handleAddToCart = async () => {
    if (!selection.color || !selection.size) {
      alert("Please select both color and size.");
      return;
    }

    try {
      const token = await authService.getToken();
      const cartItem = {
        color: selection.color,
        size: selection.size,
        quantity: selection.quantity,
      };

      await userService.addToCart(id, selectedProduct.productId, cartItem, token);
      alert("✅ Product added to cart!");
      setShowModal(false);
      navigate(`/user/getcart/${id}`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add to cart.");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++)
      stars.push(<FaStar key={"full" + i} color={ACCENT_COLOR} />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" color={ACCENT_COLOR} />);
    for (let i = 0; i < emptyStars; i++)
      stars.push(<FaRegStar key={"empty" + i} color={ACCENT_COLOR} />);
    return stars;
  };

  return (
    <div
      className="container mt-5"
      style={{
        fontFamily: FONT_FAMILY,
        color: PRIMARY_COLOR,
        backgroundColor: "#FFFFFF", // white background
        maxWidth: "900px",
      }}
    >
      <h2
        style={{
          borderBottom: `3px solid ${HEADER_COLOR}`,
          paddingBottom: "0.3rem",
          marginBottom: 20,
          color: HEADER_COLOR,
        }}
      >
        Products in Category: <span style={{ color: ACCENT_COLOR }}>{category}</span>
      </h2>

      {message && <p className="text-danger">{message}</p>}
      {products.length === 0 && <p>No products found.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => {
          const rating = averageRatings[product.productId];
          const allStock = Object.values(product.stockByColorAndSize || {});
          const outOfStock = allStock.every((stock) => stock <= 0);

          const prices = Object.values(product.priceByColorAndSize || {});
          const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
          const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

          return (
            <div
              key={product.productId}
              style={{
                border: `1px solid #00000033`,
                borderRadius: 10,
                padding: 20,
                boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`,
                backgroundColor: CARD_BG_COLOR,
                fontFamily: FONT_FAMILY,
              }}
            >
              <h4 style={{ color: PRIMARY_COLOR }}>{product.productName}</h4>
              {product.image && (
                <img
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.productName}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "contain",
                    marginBottom: 15,
                    borderRadius: 8,
                    backgroundColor: "#f9f9f9",
                  }}
                />
              )}
              <p style={{ fontSize: 16, color: "#555", height: 60, overflow: "hidden" }}>
                Description: {product.description}
              </p>
              <p style={{ color: PRIMARY_COLOR }}>
                Price: ${minPrice.toFixed(2)} – ${maxPrice.toFixed(2)}
              </p>
              <p>
                <strong>Average Rating:</strong>{" "}
                {rating && rating > 0 ? renderStars(rating) : "No ratings"}
              </p>
              <div>
                <button
                  onClick={() => handleViewDetails(product.productId)}
                  style={{
                    backgroundColor: "transparent",
                    color: ACCENT_COLOR,
                    border: `2px solid ${ACCENT_COLOR}`,
                    padding: "6px 12px",
                    borderRadius: 6,
                    marginRight: 10,
                    cursor: "pointer",
                  }}
                >
                  🔍 View Details
                </button>
                {outOfStock ? (
                  <span
                    style={{
                      backgroundColor: "#6c757d", // grey for out of stock
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: 6,
                    }}
                  >
                    Out of Stock
                  </span>
                ) : (
                  <span
                    style={{
                      backgroundColor: HEADER_COLOR, // #13b6b9 for available
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: 6,
                    }}
                  >
                    Available
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for variant selection (unchanged) */}
      {/* ... */}
    </div>
  );
};

export default ShopNow;
