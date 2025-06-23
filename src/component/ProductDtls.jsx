import React, { useState, useEffect } from 'react';
import userservice from '../service/userservice';
import authService from '../service/authService';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ProductDtls = ({ onProductUpdated }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState({});
  const [priceMap, setPriceMap] = useState({});
  const [stockMap, setStockMap] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [categoriesMap, setCategoriesMap] = useState({});

  useEffect(() => {
    fetchProduct();
    fetchUser();
    fetchAverageRating();
    fetchReviews();
    fetchCategory(); // ✅ Fetch categories on mount
  }, []);

  const fetchUser = async () => {
    try {
      const token = await authService.getToken();
      const user = authService.decodeToken(token);
      setUserId(user.appUserId);
    } catch (err) {
      console.error("❌ Failed to decode user token", err);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await userservice.getProductCategories();
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
      console.error("❌ Failed to fetch categories", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await userservice.getProductById(productId);
      setProduct(data);
      setImage(data.image);

      const prices = data.priceByColorAndSize;
      const stocks = data.stockByColorAndSize;
      const sizesMap = {};
      const colorsSet = new Set();

      Object.keys(prices).forEach(key => {
        const [color, size] = key.split('-');
        colorsSet.add(color);
        sizesMap[color] = sizesMap[color] || [];
        if (!sizesMap[color].includes(size)) sizesMap[color].push(size);
      });

      setAvailableColors([...colorsSet]);
      setAvailableSizes(sizesMap);
      setPriceMap(prices);
      setStockMap(stocks);
    } catch (err) {
      console.error("❌ Error fetching product", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await userservice.getProductReviews(productId);
      setReviews(res.data);
    } catch (err) {
      console.error("❌ Error fetching reviews", err);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const res = await userservice.productOverallRatings(productId);
      setAverageRating(res.data);
    } catch (err) {
      console.error("❌ Error fetching average rating", err);
    }
  };

  const handleAddReview = async () => {
    if (!userId) return setMessage("Login required to submit review.");
    if (userReview.rating === 0) return setMessage("Please select a rating.");
    try {
      await userservice.rateProduct(userId, productId, userReview);
      setUserReview({ rating: 0, comment: '' });
      setMessage("Review submitted successfully.");
      fetchReviews();
      fetchAverageRating();
    } catch (err) {
      console.error("❌ Failed to submit review", err);
      setMessage("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await userservice.deleteReview(reviewId);
      setMessage("Review deleted successfully.");
      fetchReviews();
      fetchAverageRating();
    } catch (err) {
      console.error("❌ Failed to delete review", err);
      setMessage("Failed to delete review.");
    }
  };

  const handleAddToCart = async () => {
    if (!userId) return;
    const key = `${selectedColor}-${selectedSize}`;
    const price = priceMap[key] || 0;

    const cartItem = {
      quantity,
      price,
      color: selectedColor,
      size: selectedSize,
    };

    try {
      await userservice.addToCart(userId, productId, cartItem);
      onProductUpdated && onProductUpdated();
      navigate(-1);
    } catch (err) {
      console.error("❌ Error adding to cart", err);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    const stock = stockMap[`${selectedColor}-${selectedSize}`] || 0;
    if (newQty >= 1 && newQty <= stock) {
      setQuantity(newQty);
      const price = priceMap[`${selectedColor}-${selectedSize}`] || 0;
      setTotalPrice(price * newQty);
    }
  };

   if (!product) return <p style={{ fontSize: 18, textAlign: 'center', marginTop: 50 }}>Loading...</p>;




return (
  <div
    style={{
      maxWidth: 900,
      margin: "40px auto",
      padding: 24,
      fontFamily: "'Poppins', sans-serif",
      color: "#000",
      lineHeight: 1.5,
      backgroundColor: "rgba(19, 182, 185, 0.2)", // #13b6b9 20% opacity
      borderRadius: 8,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }}
  >
    {message && (
      <p
        style={{
          color: "crimson",
          backgroundColor: "#ffe6e6",
          padding: "12px 20px",
          borderRadius: 6,
          fontWeight: 600,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        {message}
      </p>
    )}

    <h2
      style={{
        color: "#13b6b9",
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 8,
      }}
    >
      {product.productName}
    </h2>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
      }}
    >
      {[...Array(5)].map((_, i) =>
        i < averageRating ? (
          <FaStar key={i} color="#ffa100" size={22} />
        ) : (
          <FaRegStar key={i} color="#ccc" size={22} />
        )
      )}
      <span style={{ marginLeft: 12, fontWeight: "600", fontSize: 16 }}>
        {averageRating.toFixed(1)} / 5
      </span>
    </div>

    <p style={{ fontSize: 16, marginBottom: 20 }}>
      Status:{" "}
      <span
        style={{
          color:
            product.status === "available"
              ? "#13b6b9"
              : "#999",
          fontWeight: "700",
          textTransform: "capitalize",
        }}
      >
        {product.status}
      </span>
    </p>

    <div
      style={{
        display: "flex",
        gap: 30,
        flexWrap: "wrap",
        alignItems: "flex-start",
        marginBottom: 30,
      }}
    >
      <img
        src={`data:image/jpeg;base64,${image}`}
        alt="Product"
        style={{
          width: 250,
          borderRadius: 12,
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          objectFit: "cover",
        }}
      />

      <div style={{ flex: 1, minWidth: 280 }}>
        <p style={{ marginBottom: 12 }}>
          <strong>Company:</strong>{" "}
          <span style={{ color: "#555" }}>{product.company.companyName}</span>
        </p>

        <p style={{ marginBottom: 16, color: "#444", fontSize: 15 }}>
          <strong>Description:</strong> {product.description}
        </p>

        <p style={{ marginBottom: 8 }}>
          <strong>Colors:</strong>{" "}
          <span style={{ color: "#555" }}>{availableColors.join(", ")}</span>
        </p>

        <p style={{ marginBottom: 8 }}>
          <strong>Sizes:</strong>{" "}
          <span style={{ color: "#555" }}>
            {[...new Set(Object.values(availableSizes).flat())].join(", ")}
          </span>
        </p>

        <p style={{ marginBottom: 8 }}>
          <strong>Category:</strong>{" "}
          <span style={{ color: "#555" }}>
            {product.productCategory?.MSCategory
              ? Object.entries(product.productCategory.MSCategory)
                  .map(([_, value]) => value)
                  .join(", ")
              : "Loading category..."}
          </span>
        </p>
      </div>
    </div>

    <button
      disabled={product.status !== "available"}
      onClick={() => setShowModal(true)}
      style={{
        backgroundColor:
          product.status === "available" ? "#ffa100" : "#999",
        color: "white",
        padding: "14px 30px",
        border: "none",
        borderRadius: 8,
        cursor: product.status === "available" ? "pointer" : "not-allowed",
        fontWeight: 700,
        fontSize: 16,
        transition: "background-color 0.3s ease",
        boxShadow:
          product.status === "available"
            ? "0 4px 12px rgba(255,161,0,0.5)"
            : "none",
        marginBottom: 40,
        width: "100%",
        maxWidth: 320,
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      Add to Cart
    </button>

    {showModal && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 30,
            borderRadius: 12,
            width: "90%",
            maxWidth: 420,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            textAlign: "center",
            position: "relative",
            fontFamily: "'Poppins', sans-serif",
            color: "#000",
          }}
        >
          <h3
            style={{
              marginBottom: 24,
              color: "#13b6b9",
              fontWeight: "700",
            }}
          >
            Select Options
          </h3>

          <label
            style={{
              display: "block",
              textAlign: "left",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Color:
          </label>
          <select
            value={selectedColor}
            onChange={(e) => {
              const color = e.target.value;
              setSelectedColor(color);
              setSelectedSize("");
              setQuantity(1);
              setTotalPrice(0);
            }}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: 20,
              outline: "none",
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              color: "#000",
            }}
          >
            <option value="">Select</option>
            {availableColors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {selectedColor && (
            <>
              <label
                style={{
                  display: "block",
                  textAlign: "left",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Size:
              </label>
              <select
                value={selectedSize}
                onChange={(e) => {
                  const size = e.target.value;
                  setSelectedSize(size);
                  const price = priceMap[`${selectedColor}-${size}`] || 0;
                  setTotalPrice(price * quantity);
                }}
                style={{
                  width: "100%",
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 20,
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "'Poppins', sans-serif",
                  color: "#000",
                }}
              >
                <option value="">Select</option>
                {availableSizes[selectedColor]?.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </>
          )}

          {selectedColor && selectedSize && (
            <>
              <p style={{ margin: "8px 0", fontWeight: 600 }}>
                Stock:{" "}
                <span style={{ color: "#333" }}>
                  {stockMap[`${selectedColor}-${selectedSize}`]}
                </span>
              </p>
              <p style={{ margin: "8px 0", fontWeight: 600 }}>
                Price:{" "}
                <span style={{ color: "#333" }}>
                  ${(priceMap[`${selectedColor}-${selectedSize}`] || 0).toFixed(2)}
                </span>
              </p>
              <p style={{ margin: "8px 0", fontWeight: 600 }}>
                Total: <span style={{ color: "#333" }}>${totalPrice.toFixed(2)}</span>
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 14,
                  marginTop: 14,
                }}
              >
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  style={{
                    padding: "6px 16px",
                    fontSize: 20,
                    fontWeight: "700",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    cursor: quantity <= 1 ? "not-allowed" : "pointer",
                    backgroundColor: quantity <= 1 ? "#eee" : "#ffa100",
                    color: quantity <= 1 ? "#999" : "#fff",
                    userSelect: "none",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 18,
                    minWidth: 24,
                    textAlign: "center",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  style={{
                    padding: "6px 16px",
                    fontSize: 20,
                    fontWeight: "700",
                    borderRadius: 6,
                    border: "1px solid #ffa100",
                    cursor: "pointer",
                    backgroundColor: "#13b6b9",
                    color: "#fff",
                    userSelect: "none",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  +
                </button>
              </div>
            </>
          )}

          <div
            style={{
              marginTop: 32,
              display: "flex",
              justifyContent: "center",
              gap: 14,
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: "#ccc",
                border: "none",
                padding: "10px 26px",
                borderRadius: 6,
                fontWeight: "600",
                cursor: "pointer",
                color: "#444",
                flex: 1,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!selectedColor || !selectedSize}
              style={{
                backgroundColor:
                  !selectedColor || !selectedSize ? "#999" : "#13b6b9",
                border: "none",
                padding: "10px 26px",
                borderRadius: 6,
                fontWeight: "600",
                cursor: !selectedColor || !selectedSize ? "not-allowed" : "pointer",
                color: "#fff",
                flex: 1,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Reviews Section */}
    <div style={{ marginTop: 48 }}>
      <h3
        style={{
          color: "#13b6b9",
          fontWeight: 700,
          marginBottom: 24,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Write a Review
      </h3>
      <div
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(92,45,145,0.1)",
          maxWidth: 600,
          marginBottom: 50,
          userSelect: "none",
          fontFamily: "'Poppins', sans-serif",
          color: "#000",
        }}
      >
        <label style={{ fontWeight: 600, fontSize: 16 }}>Rating:</label>
        <div
          style={{ display: "flex", gap: 6, margin: "8px 0 18px", cursor: "pointer" }}
        >
          {[...Array(5)].map((_, i) => (
            <span
              key={`input-star-${i}`}
              onClick={() => setUserReview({ ...userReview, rating: i + 1 })}
              role="button"
              aria-label={`${i + 1} star`}
            >
              {i < userReview.rating ? (
                <FaStar color="#ffa100" size={26} />
              ) : (
                <FaRegStar color="#ccc" size={26} />
              )}
            </span>
          ))}
        </div>

        <label style={{ fontWeight: 600, fontSize: 16 }}>Comment:</label>
        <textarea
          value={userReview.comment}
          onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
          rows="3"
          style={{
            width: "100%",
            padding: 12,
            fontSize: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
            resize: "vertical",
            marginBottom: 16,
            fontFamily: "'Poppins', sans-serif",
            color: "#333",
          }}
        />

        <button
          onClick={handleAddReview}
          style={{
            backgroundColor: "#13b6b9",
            color: "#fff",
            padding: "12px 28px",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
            maxWidth: 220,
            userSelect: "none",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            transition: "background-color 0.3s ease",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Submit Review
        </button>
      </div>

      <h4
        style={{
          marginBottom: 20,
          fontWeight: 700,
          fontSize: 22,
          color: "#13b6b9",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        All Reviews
      </h4>
      {reviews.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#555" }}>No reviews yet.</p>
      ) : (
        reviews.map((rev) => (
          <div
            key={rev.reviewId}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "16px 0",
              userSelect: "text",
              fontFamily: "'Poppins', sans-serif",
              color: "#000",
            }}
          >
            <div style={{ marginBottom: 6 }}>
              {[...Array(5)].map((_, j) =>
                j < rev.rating ? (
                  <FaStar key={j} color="#ffa100" size={18} />
                ) : (
                  <FaRegStar key={j} color="#ccc" size={18} />
                )
              )}
            </div>

            <small style={{ color: "#666" }}>
              By:{" "}
              {rev.appUser
                ? `${rev.appUser.firstname} ${rev.appUser.lastname}`
                : "Unknown"}
            </small>

            <p style={{ margin: "8px 0", fontSize: 15, color: "#333" }}>
              <strong>Comment:</strong> {rev.comment || "No comment provided."}
            </p>

            <small style={{ color: "#777" }}>
              <strong>Date:</strong>{" "}
              {rev.date ? new Date(rev.date).toLocaleDateString() : "Unknown"}
            </small>
          </div>
        ))
      )}
    </div>
  </div>
);

};

export default ProductDtls;