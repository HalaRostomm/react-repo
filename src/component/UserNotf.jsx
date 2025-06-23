import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userservice from "../service/userservice";

// Inject Poppins font
const poppinsFontLink = document.createElement("link");
poppinsFontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
poppinsFontLink.rel = "stylesheet";
document.head.appendChild(poppinsFontLink);

const PRIMARY = "#14213D";
const ACCENT = "#FCA311";
const GRAY_BG = "#E5E5E5";

const UserNotf = () => {
  const { userId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const [notifRes, unreadRes] = await Promise.all([
        userservice.getNotifications(userId),
        userservice.getUnreadCount(userId),
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(unreadRes.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchNotifications();
    }
  }, [userId]);

  const handleMarkRead = async (id) => {
    setActionLoading(true);
    try {
      await userservice.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((count) => (count > 0 ? count - 1 : 0));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await userservice.deleteNotification(id);
      setNotifications((prev) => {
        const deleted = prev.find((n) => n.id === id);
        if (deleted && !deleted.read) {
          setUnreadCount((count) => (count > 0 ? count - 1 : 0));
        }
        return prev.filter((n) => n.id !== id);
      });
    } catch (err) {
      console.error("Failed to delete notification:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        color: PRIMARY,
        fontSize: 18,
        textAlign: "center",
        marginTop: 50,
      }}>
        Loading notifications...
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      maxWidth: 700,
      margin: "2rem auto",
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      boxShadow: `0 0 15px ${ACCENT}33`,
      padding: "2rem 2.5rem",
      color: PRIMARY,
    }}>
      <h2 style={{
        color: PRIMARY,
        textAlign: "center",
        marginBottom: 30,
        fontWeight: "bold",
        fontSize: "26px"
      }}>
        Notifications <span style={{ color: ACCENT }}>({unreadCount})</span>
      </h2>

      {notifications.length === 0 ? (
        <p style={{
          fontSize: 16,
          color: "#666",
          fontStyle: "italic",
          textAlign: "center",
          marginTop: 20,
        }}>
          No notifications.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {notifications.map(({ id, title, read, createdAt }) => (
            <li
              key={id}
              title={`Received at ${new Date(createdAt).toLocaleString()}`}
              style={{
                backgroundColor: read ? GRAY_BG : "#FFF6E5",
                borderLeft: `5px solid ${read ? "#cccccc" : ACCENT}`,
                padding: "15px 20px",
                marginBottom: 14,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: read ? "none" : `0 0 8px ${ACCENT}66`,
                opacity: read ? 0.75 : 1,
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{
                  fontWeight: read ? "400" : "700",
                  fontSize: 16,
                  color: read ? "#444" : PRIMARY,
                }}>
                  {title}
                </span>
                <div style={{
                  fontSize: 12,
                  color: "#777",
                  marginTop: 4,
                  fontStyle: "italic",
                }}>
                  {new Date(createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ marginLeft: 15, whiteSpace: "nowrap" }}>
                {!read && (
                  <button
                    onClick={() => handleMarkRead(id)}
                    disabled={actionLoading}
                    style={{
                      cursor: actionLoading ? "not-allowed" : "pointer",
                      backgroundColor: ACCENT,
                      border: "none",
                      color: "#FFFFFF",
                      fontWeight: "600",
                      padding: "6px 12px",
                      borderRadius: 20,
                      marginRight: 8,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(id)}
                  disabled={actionLoading}
                  style={{
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    backgroundColor: "transparent",
                    border: `2px solid ${ACCENT}`,
                    color: ACCENT,
                    fontWeight: "600",
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (!actionLoading) {
                      e.currentTarget.style.backgroundColor = ACCENT;
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.borderColor = PRIMARY;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!actionLoading) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = ACCENT;
                      e.currentTarget.style.borderColor = ACCENT;
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserNotf;
