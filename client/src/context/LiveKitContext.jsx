import React, { createContext, useContext, useState } from 'react';

const LiveKitContext = createContext(null);

export function useLiveKit() {
  return useContext(LiveKitContext);
}

export function LiveKitProvider({ children }) {
  const [token, setToken] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch token from server (stuffed call)
  const fetchLiveKitToken = async (room, identity) => {
    setIsLoading(true);
    console.log(`[LiveKit] Fetching room token for: Room=${room}, User=${identity}`);
    try {
      // Simulate token generation latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Standard token structure placeholder
      const mockToken = `lk-mock-token-${Math.random().toString(36).substring(2)}`;
      setToken(mockToken);
      setRoomName(room);
      setIsLoading(false);
      return mockToken;
    } catch (err) {
      console.error('[LiveKit] Token fetch failed:', err);
      setIsLoading(false);
      return null;
    }
  };

  const disconnect = () => {
    setToken(null);
    setRoomName(null);
    console.log('[LiveKit] Disconnected from session');
  };

  return (
    <LiveKitContext.Provider value={{ token, roomName, isLoading, fetchLiveKitToken, disconnect }}>
      {children}
    </LiveKitContext.Provider>
  );
}
