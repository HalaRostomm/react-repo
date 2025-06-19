import React, { useEffect, useState, useRef } from "react";
import { connectWebSocket, sendMessageWS, disconnectWebSocket } from "../service/stompService";
import messageService from "../service/MessageService";
import { jwtDecode } from "jwt-decode";
import { useParams, useLocation } from "react-router-dom";
import userService from "../service/userservice";
import authService from "../service/authService";


import { styled } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  Paper, 
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Badge
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LocationOn from '@mui/icons-material/LocationOn';
import Delete from '@mui/icons-material/Delete';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
const darkPurple = '#6A0DAD';  // Dark purple for message bubbles
const lightPurple = '#B399D4'; // Light purple for header
const veryLightPurple = '#F0E6FF'; // Very light purple for background

// Create a style object for Economica font
const economicaFont = {
  fontFamily: '"Economica", sans-serif',
  fontWeight: 'bold',
  letterSpacing: '0.5px'
};


const ChatContainer = styled(Paper)(({ theme }) => ({
  fontFamily: '"Economica", sans-serif',
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f5f5f5',
}));

const MessageBubble = styled(Box)(({ theme, isCurrentUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1),
  borderRadius: isCurrentUser 
    ? '18px 18px 4px 18px' 
    : '18px 18px 18px 4px',
  backgroundColor: isCurrentUser ? '#FF8C00' : '#00B4D8', // Darker orange and teal
  color: 'white',
  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
  wordBreak: 'break-word',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));


const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#3FEDF1',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  background: 'linear-gradient(to bottom, #FFFFFF, #F3FDFF)',
}));



const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  backgroundColor: 'white',
  borderTop: '1px solid #e0e0e0',
  gap: theme.spacing(1),
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: '#3FEDF1',
  '&:hover': {
    backgroundColor: 'rgba(63, 237, 241, 0.1)',
  },
}));

const AdoptionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  textTransform: 'none',
  fontWeight: 'bold',
}));




const ChatRoom = () => {
  const { receiverId, senderId, petId } = useParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { initialMessage, type, petId: petIdFromState } = location.state || {};
  const [receiverName, setReceiverName] = useState('');


useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await authService.getToken();
        if (!token) throw new Error("Token not found");

        const decoded = jwtDecode(token);
        if (!decoded.appUserId) throw new Error("User ID not found in token");

        setUserId(decoded.appUserId);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

 useEffect(() => {
    const fetchReceiverName = async () => {
      try {
        const response = await userService.getUserById(receiverId);
        setReceiverName(response.data.firstname);
      } catch (err) {
        console.error("Failed to fetch receiver name:", err);
        setReceiverName('User');
      }
    };

    if (receiverId) fetchReceiverName();
  }, [receiverId]);



  useEffect(() => {
  if (initialMessage && connected) {
    const message = {
      senderId,
      receiverId,
      content: initialMessage,
      petId: petIdFromState,
      type: type || "text", // <---- ⚠️ This might fallback to "text"
    };
console.log("Sending initial message:", { initialMessage, type });

    sendMessageWS(message);
  }
}, [initialMessage, connected, type, petIdFromState]);

  useEffect(() => {
    if (initialMessage) setInput("");
  }, [initialMessage]);

  

  const loadHistory = async () => {
    try {
      if (senderId && receiverId) {
        const response = await messageService.getHistory(senderId, receiverId);
        setMessages(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

  useEffect(() => {
    setMessages([]);
    loadHistory();

    const onMessageReceived = (newMessage) => {
      if (
        (newMessage.senderId === senderId && newMessage.receiverId === receiverId) ||
        (newMessage.senderId === receiverId && newMessage.receiverId === senderId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    connectWebSocket(onMessageReceived, () => setConnected(true), () => setConnected(false));

    return () => {
      disconnectWebSocket();
      setConnected(false);
    };
  }, [senderId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !connected) return;

    const message = {
  senderId,
  receiverId,
content: input.trim(),
  petId: petIdFromState,
  type: type || "text",
};


    setMessages((prev) => [
      ...prev,
      { ...message, id: Math.random(), sender: { firstname: "You" } },
    ]);

    sendMessageWS(message);
    setInput("");
  };

  const handleDelete = async (id) => {
    try {
      await messageService.deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !connected) return;

    try {
      const res = await messageService.uploadImage(file);
      const imageUrl = res.data.imageUrl;

      const message = {
        senderId,
        receiverId,
        content: imageUrl,
        petId,
        type: "Image",
      };

      setMessages((prev) => [
        ...prev,
        { ...message, id: Math.random(), sender: { firstname: "You" } },
      ]);

      sendMessageWS(message);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleSendLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const message = {
          senderId,
          receiverId,
          content: `${position.coords.latitude},${position.coords.longitude}`,
          petId,
          type: "LOCATION",
        };

        setMessages((prev) => [
          ...prev,
          { ...message, id: Math.random(), sender: { firstname: "You" } },
        ]);

        sendMessageWS(message);
      },
      (error) => {
        console.error("Location error:", error);
      }
    );
  };

  const handleConfirmAdoption = async (adopterId, petId) => {
  const confirm = window.confirm(
    "URGENT: You will lose your pet file if you proceed. Are you sure?"
  );

  if (!confirm) return; // User canceled

  try {
    await userService.confirmAdoption(adopterId, petId);
    alert("Adoption confirmed!");
  } catch (err) {
    console.error("Failed to confirm adoption:", err);
    alert("Error confirming adoption.");
  }
};

  const handleCancelAdoption = async (petId) => {
    try {
      await userService.cancelForAdoption(petId);
      alert("Adoption cancelled.");
    } catch (err) {
      console.error("Failed to cancel adoption:", err);
      alert("Error cancelling adoption.");
    }
  };

  
  const renderMessageContent = (msg) => {
    if (msg.type === "Image") {
      return (
        <img 
          src={msg.content} 
          alt="Sent" 
          
          style={{ 
            maxWidth: '200px', 
            maxHeight: '200px',
            borderRadius: '8px',
            border: '2px solid white'
          }} 
        />
      );
    }
    if (msg.type === "LOCATION") {
      const [lat, lng] = msg.content.split(",");
      return (
        <Button
          startIcon={<LocationOn />}
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'white',
            textDecoration: 'underline',
          }}
        >
          View Location
        </Button>
      );
    }
    return (
      <Typography variant="body1" sx={{ fontFamily: '"Economica", sans-serif' }}>
        {msg.content}
      </Typography>
    );
  };

 return (
    <ChatContainer elevation={3}>
      <ChatHeader>
        <Avatar sx={{ bgcolor: '#FF8C00' }}>
          {receiverName?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h6" sx={{ fontFamily: '"Economica", sans-serif', fontWeight: 'bold' }}>
          Chat with {receiverName}
        </Typography>
      </ChatHeader>

      <MessagesContainer>
        {messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#888'
          }}>
            <Typography variant="body1">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.senderId == senderId;
            const isAdoptionRequest = 
              msg.type === "adoption message" && 
              String(userId) === String(msg.receiverId);

            return (
              <Box 
                key={msg.id || Math.random()} 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  {!isCurrentUser && (
                    <Avatar sx={{ 
                      width: 24, 
                      height: 24, 
                      mr: 1,
                      bgcolor: '#00B4D8',
                      fontSize: '0.75rem'
                    }}>
                      {msg.sender?.firstname?.charAt(0) || 'U'}
                    </Avatar>
                  )}
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {isCurrentUser ? 'You' : msg.sender?.firstname || 'Unknown'}
                  </Typography>
                </Box>

                <MessageBubble isCurrentUser={isCurrentUser}>
                  {renderMessageContent(msg)}
                </MessageBubble>

                {isAdoptionRequest && (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1,
                    mt: 1,
                    alignSelf: 'flex-start'
                  }}>
                    <AdoptionButton
                      variant="contained"
                      startIcon={<CheckCircle />}
                      onClick={() => handleConfirmAdoption(msg.senderId, msg.petId)}
                      sx={{
                        bgcolor: '#4CAF50',
                        '&:hover': { bgcolor: '#388E3C' }
                      }}
                    >
                      Confirm Adoption
                    </AdoptionButton>
                    <AdoptionButton
                      variant="contained"
                      startIcon={<Cancel />}
                      onClick={() => handleCancelAdoption(msg.petId)}
                      sx={{
                        bgcolor: '#F44336',
                        '&:hover': { bgcolor: '#D32F2F' }
                      }}
                    >
                      Cancel
                    </AdoptionButton>
                  </Box>
                )}

                {isCurrentUser && (
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(msg.id)}
                    sx={{ 
                      alignSelf: 'flex-end',
                      color: '#F44336',
                      mt: 0.5
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={connected ? "Type your message..." : "Connecting..."}
          disabled={!connected}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              backgroundColor: 'white',
              fontFamily: '"Economica", sans-serif',
            }
          }}
        />
        
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        
        <ActionButton 
          onClick={() => fileInputRef.current.click()} 
          disabled={!connected}
        >
          <PhotoCamera />
        </ActionButton>
        
        <ActionButton 
          onClick={handleSendLocation} 
          disabled={!connected}
        >
          <LocationOn />
        </ActionButton>
        
        <ActionButton 
          onClick={handleSend} 
          disabled={!connected || !input.trim()}
          sx={{ 
            backgroundColor: '#FEA70F',
            color: 'white',
            '&:hover': {
              backgroundColor: '#E69500',
            },
            '&:disabled': {
              backgroundColor: '#E0E0E0',
            }
          }}
        >
          <SendIcon />
        </ActionButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatRoom;