// src/service/MessageService.js
import axios from "axios";

const API_URL = "http://localhost:8080/messages";

class MessageService {
  
  constructor() {
    this.authAxios = axios.create({
      baseURL: API_URL,
    });

    this.authAxios.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }


  // Send a new message
  sendMessage(chatMessage) {
    return this.authAxios.post("/send", chatMessage);
  }

  // Get message history between two users
  getHistory(senderId, receiverId) {
    return this.authAxios.get("/history", {
      params: { senderId, receiverId },
    });
  }

  // Delete a message by ID
  deleteMessage(messageId) {
    return this.authAxios.delete(`/deletemessage/${messageId}`);
  }

  // Upload an image for a message
  uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    return this.authAxios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Fetch receiver info (AppUser)
  getReceiverInfo(id) {
    return this.authAxios.get(`/getreceiverinfo/${id}`);
  }
}

export default new MessageService();
