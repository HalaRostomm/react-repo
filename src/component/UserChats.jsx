import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userservice from "../service/userservice";

// Inject Poppins font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// Updated styling constants
const accentColor = "#FFA100";
const primaryText = "#000000";
const background = "#E5E5E5";
const headerColor = "#13B6B9";
const cardColor = "rgba(19, 182, 185, 0.2)";

const UserChats = ({ token }) => {
  const { appuserid } = useParams();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const response = await userservice.getAllChatUsers(appuserid);
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to load chat users", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatUsers();
  }, [appuserid, token]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    return fullName.includes(searchText.toLowerCase());
  });

  const openChatWithUser = (userId, petId) => {
    navigate(`/chat/${userId}/${appuserid}/${petId}`, { state: { token } });
  };

  return (
    <div style={{
      maxWidth: 900,
      margin: "2rem auto",
      fontFamily: "'Poppins', sans-serif",
      background: background,
      padding: "1rem"
    }}>
      <header style={{
        backgroundColor: headerColor,
        color: primaryText,
        padding: "1rem",
        textAlign: "center",
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 24
      }}>
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
            border: "2px solid #ccc",
            backgroundColor: "#FFFFFF",
            fontSize: 16,
            outline: "none",
            fontFamily: "'Poppins', sans-serif"
          }}
        />
      </div>

      {isLoading ? (
        <div style={{
          textAlign: "center",
          marginTop: 40,
          fontSize: 16,
          color: "#666"
        }}>
          Loading chat users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <p style={{
          textAlign: "center",
          color: "#999",
          fontSize: 16,
          marginTop: 40
        }}>
          No users have messaged you yet.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredUsers.map((user) => {
            const avatarSrc =
              user.image?.length > 0
                ? `data:image/jpeg;base64,${user.image}`
                : null;

            return (
              <li
                key={user.appUserId || user.id}
                onClick={() => openChatWithUser(user.appUserId, user.petId)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: cardColor,
                  borderRadius: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  marginBottom: 16,
                  padding: 12,
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(5px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  backgroundColor: "#F0F0F0",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                  flexShrink: 0
                }}>
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={`${user.firstname} ${user.lastname}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={accentColor}
                      viewBox="0 0 24 24"
                      width="40px"
                      height="40px"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>

                <div style={{ flexGrow: 1 }}>
                  <div style={{
                    fontWeight: "600",
                    fontSize: 17,
                    marginBottom: 4,
                    color: primaryText
                  }}>
                    {user.firstname} {user.lastname}
                  </div>
                  <div style={{ fontSize: 15, color: "#666" }}>
                    Tap to view conversation
                  </div>
                </div>

                <div style={{ color: accentColor }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={accentColor}
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

export default UserChats;
