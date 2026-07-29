import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { register as registerApi, login as loginApi } from '../services/authService';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Decode a JWT token payload (base64) without verifying signature.
 * Used client-side to extract user info from stored token.
 */
function decodeTokenPayload(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check localStorage for existing token and restore user session
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = decodeTokenPayload(storedToken);
      if (decoded && decoded.id) {
        // We have a valid token shape — restore minimal user context.
        // For full user data, you would call GET /api/auth/me with the token.
        setUser({ _id: decoded.id });
      } else {
        // Invalid token, clean up
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Register a new user.
   * Stores the JWT token in localStorage and sets the user state.
   */
  const register = useCallback(async (userData) => {
    const data = await registerApi(userData);
    localStorage.setItem('token', data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      role: data.role,
      status: data.status
    });
    return data;
  }, []);

  /**
   * Login with email and password.
   * Stores the JWT token in localStorage and sets the user state.
   */
  const login = useCallback(async (credentials) => {
    const data = await loginApi(credentials);
    localStorage.setItem('token', data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      role: data.role,
      status: data.status
    });
    return data;
  }, []);

  /**
   * Logout: remove token from localStorage and clear user state.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

