// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const initializeAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await authService.me();
        // Add validation for complete user data
        if (response.data && response.data.id) {
          setUser(response.data);
        } else {
          throw new Error("Incomplete user data");
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  };

  initializeAuth();
}, []);

  const login = async (credentials) => {
  setLoading(true);
  setError(null);
  try {
    await authService.getCsrfToken();
    const response = await authService.login(credentials);
    localStorage.setItem("token", response.data.token);

    // Force axios to include token after login
    api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

    setUser(response.data.user);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    setError(message);
    throw new Error(message);
  } finally {
    setLoading(false);
  }
};

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await authService.getCsrfToken();
      const response = await authService.register(userData);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};