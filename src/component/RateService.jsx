import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";
import { FaStar, FaRegStar } from "react-icons/fa";

// Dynamically add Poppins font
const poppinsFontLink = document.createElement("link");
poppinsFontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
poppinsFontLink.rel = "stylesheet";
document.head.appendChild(poppinsFontLink);

// Colors
const PRIMARY_COLOR = "#13B6B9"; // header & card bg base
const ACCENT_COLOR = "#FFA100"; // buttons & icons orange
const CARD_BG_OPACITY = "33"; // hex for 20% opacity (33 in hex = 20% opacity)
const CARD_BG_COLOR = `${PRIMARY_COLOR}${CARD_BG_OPACITY}`; // 20% opacity background
const TEXT_COLOR = "#000000"; // black text

const RateService = () => {
  const { serviceId } = useParams();
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
  }, [serviceId]);

  const fetchReviews = async () => {
    try {
      const res = await userService.getServiceReviews(serviceId);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch reviews");
    }
  };

  const fetchAverageRating = async () => {
    try {
      const res = await userService.serviceOverallRatings(serviceId);
      setAverageRating(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReview = async () => {
    if (!userId) return setMessage("Please login to submit review.");
    if (userReview.rating === 0) return setMessage("Please select a rating.");
    try {
      await userService.rateService(userId, serviceId, userReview);
      await fetchReviews();
      await fetchAverageRating();
      setUserReview({ rating: 0, comment: '' });
      setMessage("Review submitted successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await userService.deleteReview(reviewId);
      fetchReviews();
      fetchAverageRating();
      setMessage("Review deleted.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete review.");
    }
  };

  return (
    <div
      className="container"
      style={{
        fontFamily: "'Poppins', sans-serif",
        maxWidth: 880,
        margin: "2rem auto",
        padding: "1.5rem 2rem",
        backgroundColor: CARD_BG_COLOR,
        borderRadius: 12,
        boxShadow: `0 0 18px rgba(0,0,0,0.08)`,
        color: TEXT_COLOR,
      }}
    >
      <h2 style={{
        backgroundColor: PRIMARY_COLOR,
        color: TEXT_COLOR,
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
        letterSpacing: 1,
        padding: "0.5rem 0",
        borderRadius: 8
      }}>
        Service Reviews
      </h2>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: "1.3rem",
        fontWeight: "600",
        marginBottom: 24
      }}>
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            color={i < Math.floor(averageRating) ? ACCENT_COLOR : "#E5E5E5"}
          />
        ))}
        <span style={{ fontWeight: 700 }}>({averageRating.toFixed(1)})</span>
      </div>

      <section style={{ borderTop: `2px solid #E5E5E5`, paddingTop: 20, marginBottom: 40 }}>
        <h3 style={{ color: ACCENT_COLOR, marginBottom: 12 }}>Write a Review</h3>

        <label style={{ fontWeight: "600", display: "block", marginBottom: 6 }}>
          Rating:
        </label>
        <div style={{ marginBottom: 20 }}>
          {[...Array(5)].map((_, i) => (
            <span
              key={`star-${i}`}
              onClick={() => setUserReview({ ...userReview, rating: i + 1 })}
              style={{
                cursor: "pointer",
                fontSize: 28,
                color: i < userReview.rating ? ACCENT_COLOR : "#ccc",
                marginRight: 6
              }}
            >
              <FaStar />
            </span>
          ))}
        </div>

        <label style={{ fontWeight: "600", display: "block", marginBottom: 6 }}>
          Comment:
        </label>
        <textarea
          value={userReview.comment}
          onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
          rows={4}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            fontFamily: "'Poppins', sans-serif",
            borderRadius: 8,
            border: `1.5px solid #E5E5E5`,
            resize: "vertical",
            marginBottom: 12
          }}
          placeholder="Write your review..."
        />

        <button
          onClick={handleAddReview}
          style={{
            backgroundColor: ACCENT_COLOR,
            color: TEXT_COLOR,
            fontWeight: "700",
            padding: "10px 22px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = ACCENT_COLOR}
        >
          Submit Review
        </button>
      </section>

      <section>
        <h3 style={{ color: PRIMARY_COLOR, marginBottom: 20 }}>All Reviews</h3>
        {reviews.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#777" }}>No reviews yet.</p>
        ) : (
          reviews.map(rev => (
            <div key={rev.reviewId} style={{
              backgroundColor: CARD_BG_COLOR,
              borderRadius: 8,
              padding: 16,
              marginBottom: 18,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{ marginBottom: 6 }}>
                {[...Array(5)].map((_, j) =>
                  j < rev.rating
                    ? <FaStar key={j} color={ACCENT_COLOR} />
                    : <FaRegStar key={j} color="#ccc" />
                )}
              </div>
              <p style={{ fontSize: 16 }}>
                <strong>Comment:</strong> {rev.comment || "No comment provided."}
              </p>
              <small style={{ color: "#666" }}>
                Date: {rev.date ? new Date(rev.date).toLocaleDateString() : "Unknown"}
              </small>
              <br />
              <small style={{ color: "#666" }}>
                By: {rev.appUser ? `${rev.appUser.firstname} ${rev.appUser.lastname}` : "Unknown"}
              </small>

              {rev.appUser && rev.appUser.appUserId === userId && (
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => handleDeleteReview(rev.reviewId)}
                    style={{
                      backgroundColor: PRIMARY_COLOR,
                      color: TEXT_COLOR,
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontWeight: 600,
                      cursor: "pointer",
                      marginTop: 6,
                    }}
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
        <div style={{
          backgroundColor: "#fef4e7",
          color: ACCENT_COLOR,
          border: `1px solid ${ACCENT_COLOR}`,
          padding: "10px 16px",
          borderRadius: 8,
          fontWeight: 600,
          marginTop: 24,
          textAlign: "center",
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default RateService;
