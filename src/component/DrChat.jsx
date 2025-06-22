import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import doctorservice from "../service/doctorservice";

const colors = {
  background: "#ffffff",
  container: "#f5faff",
  card: "#64B5F6", // primary blue
  accent: "#2196f3",
  text: "#000000",
};

const DrChat = ({ token }) => {
  const { doctorId } = useParams();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = colors.background;
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const response = await doctorservice.getAllChatUsers(doctorId);
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to load chat users", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatUsers();
  }, [doctorId, token]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    return fullName.includes(searchText.toLowerCase());
  });

  const openChatWithUser = (userId, petId) => {
    navigate(`/chat/${userId}/${doctorId}/${petId}`, {
      state: { token },
    });
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: colors.container,
        padding: "2rem",
        borderRadius: "12px",
        color: colors.text,
        minHeight: "90vh",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <header
        style={{
          backgroundColor: colors.card,
          color: colors.text,
          padding: "1rem",
          textAlign: "center",
          borderRadius: 6,
          fontWeight: "bold",
          fontSize: 22,
        }}
      >
        Messages
      </header>

      <div style={{ margin: "1.5rem 0" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: 15,
            border: `2px solid ${colors.card}`,
            backgroundColor: "#fff",
            color: colors.text,
            fontSize: 16,
            fontFamily: "'Poppins', sans-serif",
            outline: "none",
          }}
        />
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: 40, fontSize: 16, color: colors.accent }}>
          Loading chat users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <p style={{ textAlign: "center", color: colors.accent, fontSize: 16, marginTop: 40 }}>
          No users have messaged you yet.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredUsers.map((user) => {
            let avatarSrc = user.image ? `data:image/jpeg;base64,${user.image}` : null;

            return (
              <li
                key={user.appUserId || user.id}
                onClick={() => openChatWithUser(user.appUserId)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  marginBottom: 16,
                  padding: 12,
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  fontFamily: "'Poppins', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(5px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                    flexShrink: 0,
                    border: `2px solid ${colors.accent}`,
                  }}
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={`${user.firstname} ${user.lastname}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={colors.accent}
                      viewBox="0 0 24 24"
                      width="40px"
                      height="40px"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>

                <div style={{ flexGrow: 1 }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 4,
                      color: colors.text,
                    }}
                  >
                    {user.firstname} {user.lastname}
                  </div>
                  <div style={{ fontSize: 14, color: "#333" }}>
                    Tap to view conversation
                  </div>
                </div>

                <div style={{ color: "#333" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={colors.text}
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v14l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DrChat;
