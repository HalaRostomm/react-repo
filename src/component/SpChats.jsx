import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import spservice from "../service/spservice";

const SpChats = ({ token }) => {
  const { spId } = useParams();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const primary = "#274C77";
  const accent = "#6096BA";
  const light = "#A3CEF1";
  const bg = "#E7ECEF";
  const neutral = "#8B8C89";

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const response = await spservice.getAllChatUsers(spId);
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to load chat users", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatUsers();
  }, [spId, token]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    return (
      user.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
      fullName.includes(searchText.toLowerCase())
    );
  });

  const openChatWithUser = (userId, petId) => {
    navigate(`/chat/${userId}/${spId}/${petId}`, {
      state: { token },
    });
  };

  return (
    <div
      style={{
        backgroundColor: bg,
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
        <header
          style={{
            backgroundColor: primary,
            color: "white",
            padding: "1rem",
            textAlign: "center",
            borderRadius: "1rem",
            fontSize: 24,
            fontWeight: 700,
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
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
              borderRadius: "10px",
              border: `1.5px solid ${light}`,
              fontSize: 16,
              backgroundColor: "#F5FAFF",
              color: primary,
              outlineColor: accent,
            }}
          />
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", fontSize: 16, color: neutral, marginTop: 60 }}>
            Loading chat users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: "center", color: neutral, fontSize: 16, marginTop: 60 }}>
            No users have messaged you yet.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredUsers.map((user) => {
              const avatarSrc =
                user.image && user.image.length > 0
                  ? `data:image/jpeg;base64,${user.image}`
                  : null;
              return (
                <li
                  key={user.appUserId}
                  onClick={() => openChatWithUser(user.appUserId, user.petId)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: "1rem",
                    padding: "1rem",
                    marginBottom: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.07)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.07)";
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      overflow: "hidden",
                      marginRight: "1rem",
                      backgroundColor: light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={`${user.firstname} ${user.lastname}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={accent}
                        viewBox="0 0 24 24"
                        width="36px"
                        height="36px"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, color: primary }}>
                      {user.firstname} {user.lastname}
                    </div>
                    <div style={{ fontSize: 14, color: "#777" }}>
                      Tap to view conversation
                    </div>
                  </div>
                  <div style={{ marginLeft: "0.5rem", color: accent }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={accent}
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
    </div>
  );
};

export default SpChats;
