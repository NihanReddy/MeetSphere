import React, { createContext, useContext, useEffect, useState } from 'react';

const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Setup WebSocket connection to backend signaling server
    const serverUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
    console.log(`[Socket] Initializing connection to ${serverUrl}...`);

    // Placeholder Socket interface matching standard browser WebSocket
    const mockSocket = {
      send: (data) => {
        console.log('[Socket] Sending message:', data);
      },
      close: () => {
        console.log('[Socket] Connection closed');
      },
      addEventListener: (event, handler) => {
        console.log(`[Socket] Registered event listener for: ${event}`);
      },
      removeEventListener: (event, handler) => {
        console.log(`[Socket] Removed event listener for: ${event}`);
      }
    };

    setSocket(mockSocket);
    setIsConnected(true);

    return () => {
      console.log('[Socket] Cleaning up socket connection...');
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
