import React, { useEffect } from 'react'
import { io } from "socket.io-client";
const NoticationAlert = () => {
    useEffect(() => {
        const socket = io("http://localhost:5000", {
            auth: {
              token: localStorage.getItem("token"), // Replace with your token retrieval logic
            },
          });
          
          // Handle connection errors
          socket.on("connect_error", (err) => {
            console.error("Connection error:", err.message);
          });
      }, [])
  return (
    <div>NoticationAlert</div>
  )
}

export default NoticationAlert