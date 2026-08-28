"use client";

import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
      {
        autoConnect: false,
        transports: ["websocket"],
      }
    );
  }

  return socket;
}

export function connectSocket() {
  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}