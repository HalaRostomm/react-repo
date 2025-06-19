import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import spservice from "../service/spservice";

const SpNotif = () => {
  const { spId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Theme Colors
  const background = "#E7ECEF";
  const text = "#274C77";
  const primary = "#6096BA";
  const border = "#A3CEF1";
  const muted = "#8B8C89";
  const danger = "#D9534F";

  const poppinsFont = { fontFamily: "'Poppins', sans-serif" };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const [notifRes, unreadRes] = await Promise.all([
        spservice.getNotifications(spId),
        spservice.getUnreadCount(spId),
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
    if (spId) {
      setLoading(true);
      fetchNotifications();
    }
  }, [spId]);

  const handleMarkRead = async (id) => {
    setActionLoading(true);
    try {
      await spservice.markAsRead(id);
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
      await spservice.deleteNotification(id);
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
  useEffect(() => {
  document.body.style.backgroundColor = background;
  return () => {
    document.body.style.backgroundColor = null; // Reset on unmount
  };
}, []);
  if (loading)
    return (
      <div style={{ padding: "2rem", color: text, ...poppinsFont }}>
        Loading notifications...
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "2rem auto",
        backgroundColor: background,
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        ...poppinsFont,
      }}
    >
      <h2
        style={{
          color: text,
          fontWeight: 700,
          marginBottom: "1.5rem",
        }}
      >
        Notifications{" "}
        <span style={{ color: primary }}>
          ({unreadCount} Unread)
        </span>
      </h2>

      {notifications.length === 0 ? (
        <p style={{ fontSize: "16px", color: muted }}>
          You have no notifications.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map(({ id, title, read, createdAt }) => (
            <li
              key={id}
              style={{
                backgroundColor: read ? "#f5f9fc" : "#dceeff",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "10px",
                border: `1px solid ${read ? border : primary}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: read ? 0.7 : 1,
                cursor: "default",
                transition: "all 0.3s ease",
              }}
              title={`Received: ${new Date(createdAt).toLocaleString()}`}
            >
              <div>
                <p
                  style={{
                    fontWeight: read ? 500 : 700,
                    margin: 0,
                    fontSize: "16px",
                    color: text,
                  }}
                >
                  {title}
                </p>
                <small style={{ color: muted }}>
                  {new Date(createdAt).toLocaleString()}
                </small>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                {!read && (
                  <button
                    onClick={() => handleMarkRead(id)}
                    disabled={actionLoading}
                    style={{
                      backgroundColor: primary,
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      fontWeight: 600,
                      cursor: actionLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(id)}
                  disabled={actionLoading}
                  style={{
                    backgroundColor: danger,
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    fontWeight: 600,
                    cursor: actionLoading ? "not-allowed" : "pointer",
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

export default SpNotif;
