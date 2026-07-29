import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

// Simple hook to import socket context easily
export function useSocketHook() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketHook must be used within a SocketProvider');
  }
  return context;
}
