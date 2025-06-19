import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ppservice from "../service/ppservice";

const Ppnotf = () => {
  const { ppId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const ORANGE = "#FF9800";
  const BLACK = "#000000";
  const POPPINS = "'Poppins', sans-serif";

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [notifRes, unreadRes] = await Promise.all([
        ppservice.getNotifications(ppId),
        ppservice.getUnreadCount(ppId),
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
    if (ppId) {
      setLoading(true);
      fetchNotifications();
    }
  }, [ppId]);

  const handleMarkRead = async (id) => {
    setActionLoading(true);
    try {
      await ppservice.markAsRead(id);
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
      await ppservice.deleteNotification(id);
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

  if (loading) return <div style={{ fontFamily: POPPINS }}>Loading notifications...</div>;

  return (
    <div
      style={{
        fontFamily: POPPINS,
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: "#fff8f0",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        color: BLACK,
      }}
    >
      <h2 style={{ fontWeight: 600, fontSize: "1.8rem", color: ORANGE }}>
        🔔 Notifications <span style={{ color: BLACK }}>(Unread: {unreadCount})</span>
      </h2>

      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none", marginTop: "20px" }}>
          {notifications.map(({ id, title, read, createdAt }) => (
            <li
              key={id}
              style={{
                backgroundColor: read ? "#f6f6f6" : "#fff3e0",
                borderLeft: `6px solid ${read ? "#ccc" : ORANGE}`,
                padding: "15px 20px",
                marginBottom: "12px",
                borderRadius: "8px",
                transition: "background 0.3s",
              }}
              title={`Received at ${new Date(createdAt).toLocaleString()}`}
            >
              <div style={{ fontWeight: read ? 400 : 600, fontSize: "1.1rem" }}>
                🔔 {title}
              </div>
              <div style={{ marginTop: 10 }}>
                {!read && (
                  <button
                    onClick={() => handleMarkRead(id)}
                    disabled={actionLoading}
                    style={{
                      backgroundColor: ORANGE,
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      marginRight: "10px",
                      cursor: actionLoading ? "not-allowed" : "pointer",
                      fontFamily: POPPINS,
                    }}
                  >
                    ✅ Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(id)}
                  disabled={actionLoading}
                  style={{
                    backgroundColor: "#d32f2f",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    fontFamily: POPPINS,
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ppnotf;
