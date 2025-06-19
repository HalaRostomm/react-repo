import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import doctorservice from "../service/doctorservice";

const DrNotf = () => {
  const { doctorId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const [notifRes, unreadRes] = await Promise.all([
        doctorservice.getNotifications(doctorId),
        doctorservice.getUnreadCount(doctorId),
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
    if (doctorId) {
      setLoading(true);
      fetchNotifications();
    }
  }, [doctorId]);
  useEffect(() => {
  document.body.style.backgroundColor = "#0D1B2A";
  return () => {
    document.body.style.backgroundColor = null; // Reset on unmount
  };
}, []);


  const handleMarkRead = async (id) => {
    setActionLoading(true);
    try {
      await doctorservice.markAsRead(id);
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
      await doctorservice.deleteNotification(id);
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

  if (loading) return <div style={styles.loading}>Loading notifications...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        Notifications{" "}
        <span style={styles.unread}>({unreadCount} unread)</span>
      </h2>

      {notifications.length === 0 ? (
        <p style={styles.noNotifications}>No notifications.</p>
      ) : (
        <ul style={styles.list}>
          {notifications.map(({ id, title, read, createdAt }) => (
            <li
              key={id}
              style={{
                ...styles.notification,
                backgroundColor: read ? "#E0E1DD" : "#415A77",
                color: read ? "#1B263B" : "#E0E1DD",
              }}
              title={`Received at ${new Date(createdAt).toLocaleString()}`}
            >
              <span style={styles.title}>{title}</span>
              <div style={styles.actions}>
                {!read && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleMarkRead(id)}
                    style={{ ...styles.button, backgroundColor: "#778DA9" }}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  disabled={actionLoading}
                  onClick={() => handleDelete(id)}
                  style={{ ...styles.button, backgroundColor: "#B00020" }}
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

// Font injection (just once)
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Crimson Pro', serif",
    color: "#E0E1DD",
    backgroundColor: "#0D1B2A", // DARK BACKGROUND FOR WHOLE PAGE
    minHeight: "100vh",         // ENSURE FULL VIEW HEIGHT
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    color: "#E0E1DD",
    fontWeight: "700",
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  unread: {
    fontSize: "1rem",
    color: "#778DA9",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  notification: {
    borderRadius: "10px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "0.3s ease",
  },
  title: {
    fontWeight: "600",
    fontSize: "1rem",
    flex: 1,
    marginRight: "1rem",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  button: {
    color: "#fff",
    border: "none",
    padding: "0.5rem 0.9rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    marginTop: "2rem",
    fontFamily: "'Crimson Pro', serif",
    color: "#778DA9",
  },
  noNotifications: {
    textAlign: "center",
    color: "#ccc",
    fontStyle: "italic",
  },
};

export default DrNotf;
