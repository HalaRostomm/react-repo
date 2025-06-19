import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onMessageReceived, onConnect, onDisconnect) => {
  const socketUrl = "http://localhost:8080/ws-chat";

  stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    debug: (str) => {
      // Enable this for debugging or comment out to silence logs
      console.log("[STOMP]", str);
    },
    reconnectDelay: 5000,
    onConnect: (frame) => {
     console.log("Connected to WebSocket");
if (frame && frame.headers) {
  console.log("STOMP headers:", frame.headers);
}

      if (onConnect) onConnect();

      stompClient.subscribe("/topic/messages", (message) => {
        try {
          const body = JSON.parse(message.body);
          onMessageReceived(body);
        } catch (err) {
          console.error("Failed to parse message", err);
        }
      });
    },
    onStompError: (frame) => {
      console.error("Broker reported error:", frame.headers["message"]);
      console.error("Details:", frame.body);
    },
    onWebSocketClose: (event) => {
      console.log("WebSocket closed:", event);
      if (onDisconnect) onDisconnect();
    },
    onWebSocketError: (event) => {
      console.error("WebSocket error:", event);
    }
  });

  stompClient.activate();
};

export const sendMessageWS = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(message),
    });
  } else {
    console.error("WebSocket is not connected. Cannot send message.");
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log("Disconnected from WebSocket");
    stompClient = null;
  }
};
