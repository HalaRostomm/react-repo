import React, { useState, useEffect } from "react";
import userService from "../service/userservice";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import authService from '../service/authService';

// Dynamically add Poppins font to <head>
const poppinsFontLink = document.createElement("link");
poppinsFontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
poppinsFontLink.rel = "stylesheet";
document.head.appendChild(poppinsFontLink);

const COLORS = {
  PRIMARY: "#13b6b9",
  ACCENT: "#ffa100",
  TEXT: "#000000",
  CARD_BG_OPACITY: "33", // 20% opacity hex
  WHITE: "#FFFFFF",
};

const RateDoctor = () => {
  const { doctorId } = useParams();
  const [userId, setUserId] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await authService.getToken();
        const user = authService.decodeToken(token);
        setUserId(user.appUserId);
      } catch (error) {
        console.error("❌ Failed to fetch user from token", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchReviews();
    fetchAverageRating();
  }, [doctorId]);

  const fetchReviews = async () => {
    try {
      const res = await userService.getDoctorReviews(doctorId);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch reviews");
    }
  };

  const fetchAverageRating = async () => {
    try {
      const res = await userService.doctorOverallRatings(doctorId);
      setAverageRating(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReview = async () => {
    if (!userId) {
      setMessage("You must be logged in to submit a review.");
      return;
    }
    if (userReview.rating === 0) {
      setMessage("Please select a rating.");
      return;
    }
    try {
      await userService.rateDoctor(userId, doctorId, userReview);
      await fetchReviews();
      await fetchAverageRating();
      setUserReview({ rating: 0, comment: '' });
      setMessage("Review submitted successfully.");
    } catch (err) {
      console.error("Failed to submit review", err);
      setMessage("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await userService.deleteReview(reviewId);
      setMessage("Review deleted successfully");
      fetchReviews();
      fetchAverageRating();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete review");
    }
  };

  return (
    <div
      className="container"
      style={{
        fontFamily: "'Poppins', sans-serif",
        maxWidth: 900,
        margin: "2rem auto",
        padding: "1rem 2rem",
        backgroundColor: `${COLORS.PRIMARY}${COLORS.CARD_BG_OPACITY}`, // card bg with 20% opacity
        borderRadius: 12,
        boxShadow: `0 0 15px ${COLORS.PRIMARY}${COLORS.CARD_BG_OPACITY}`,
        color: COLORS.TEXT,
      }}
    >
      <h2
        style={{
          textAlign: "center",
          backgroundColor: COLORS.PRIMARY,
          color: COLORS.TEXT,
          marginBottom: "1.5rem",
          fontWeight: "700",
          letterSpacing: "2px",
          borderRadius: 8,
          padding: "0.6rem 0",
        }}
      >
        Doctor Reviews
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: "600",
          marginBottom: 24,
          fontSize: "1.3rem",
          color: COLORS.ACCENT,
        }}
      >
        <div>
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            return (
              <FaStar
                key={`avg-star-${i}`}
                color={starValue <= Math.floor(averageRating) ? COLORS.ACCENT : "#ccc"}
              />
            );
          })}
        </div>
        <span style={{ fontWeight: "700", color: COLORS.TEXT }}>
          ({averageRating.toFixed(1)})
        </span>
      </div>

      {/* Submit Review */}
      <section
        style={{
          borderTop: `2px solid ${COLORS.PRIMARY}`,
          paddingTop: 20,
          marginBottom: 40,
          backgroundColor: COLORS.WHITE,
          borderRadius: 8,
          padding: "20px",
          boxShadow: `0 0 10px ${COLORS.PRIMARY}${COLORS.CARD_BG_OPACITY}`,
          color: COLORS.TEXT,
        }}
      >
        <h3 style={{ color: COLORS.ACCENT, marginBottom: 12 }}>Write a Review</h3>

        <label
          htmlFor="rating"
          style={{ fontWeight: "600", display: "block", marginBottom: 6 }}
        >
          Rating:
        </label>
        <div style={{ marginBottom: 20 }}>
          {[...Array(5)].map((_, i) => (
            <span
              key={`input-star-${i}`}
              onClick={() => setUserReview({ ...userReview, rating: i + 1 })}
              style={{
                cursor: "pointer",
                fontSize: 28,
                color: i < userReview.rating ? COLORS.ACCENT : "#ccc",
                marginRight: 6,
                transition: "color 0.2s",
              }}
              title={`${i + 1} star${i === 0 ? "" : "s"}`}
            >
              <FaStar />
            </span>
          ))}
        </div>

        <label
          htmlFor="comment"
          style={{ fontWeight: "600", display: "block", marginBottom: 6 }}
        >
          Comment:
        </label>
        <textarea
          id="comment"
          value={userReview.comment}
          onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
          rows={4}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            border: `1.5px solid ${COLORS.PRIMARY}`,
            fontFamily: "'Poppins', sans-serif",
            resize: "vertical",
            marginBottom: 12,
            color: COLORS.TEXT,
          }}
          placeholder="Write your review here..."
        />

        <button
          onClick={handleAddReview}
          style={{
            backgroundColor: COLORS.ACCENT,
            color: COLORS.TEXT,
            fontWeight: "700",
            padding: "10px 22px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#cc8500")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.ACCENT)}
        >
          Submit Review
        </button>
      </section>

      {/* All Reviews */}
      <section
        style={{
          color: COLORS.TEXT,
        }}
      >
        <h3 style={{ color: COLORS.PRIMARY, marginBottom: 20 }}>All Reviews</h3>
        {reviews.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#555" }}>No reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.reviewId}
              style={{
                borderBottom: `1.5px solid ${COLORS.PRIMARY}${COLORS.CARD_BG_OPACITY}`,
                paddingBottom: 16,
                marginBottom: 16,
              }}
            >
              <div style={{ marginBottom: 6 }}>
                {[...Array(5)].map((_, j) =>
                  j < rev.rating ? (
                    <FaStar key={`gold-star-${j}`} color={COLORS.ACCENT} />
                  ) : (
                    <FaRegStar key={`grey-star-${j}`} color="#ccc" />
                  )
                )}
              </div>

              <p style={{ fontSize: 16, marginBottom: 6 }}>
                <strong>Comment:</strong> {rev.comment || "No comment provided."}
              </p>

              <small style={{ color: "#666" }}>
                <strong>Date:</strong>{" "}
                {rev.date ? new Date(rev.date).toLocaleDateString() : "Unknown"}
              </small>
              <br />

              {rev.product && (
                <>
                  <small style={{ color: "#666" }}>
                    <strong>Product:</strong> {rev.product.name || rev.product}
                  </small>
                  <br />
                </>
              )}

              <small style={{ color: "#666" }}>
                By: {rev.appUser
                  ? `${rev.appUser.firstname} ${rev.appUser.lastname}`
                  : "Unknown"}
              </small>

              {rev.appUser && rev.appUser.appUserId === userId && (
                <div style={{ marginTop: 8 }}>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteReview(rev.reviewId)}
                    style={{
                      backgroundColor: COLORS.ACCENT,
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      color: COLORS.TEXT,
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = COLORS.PRIMARY)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = COLORS.ACCENT)
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {message && (
        <div
          className="alert alert-info mt-3"
          style={{
            backgroundColor: COLORS.PRIMARY + "22",
            border: `1px solid ${COLORS.PRIMARY}`,
            color: COLORS.PRIMARY,
            fontWeight: "600",
            padding: "10px 14px",
            borderRadius: 8,
            marginTop: 20,
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default RateDoctor;
