import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

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
    const [error, setError] = useState(null);  // ✅ Error state for auth

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            authService
                .me()
                .then((response) => setUser(response.data.user))
                .catch(() => localStorage.removeItem("token"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
    setLoading(true);
    setError(null); // ✅ clear old errors before login attempt
    try {
        await authService.getCsrfToken();
        const response = await authService.login(credentials);
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        setUser(user);
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Login failed";
        setError(errorMessage);  // ✅ this shows the message in the UI
        throw new Error(errorMessage); // Login.jsx will catch this
    } finally {
        setLoading(false);
    }
};


    const register = async (userData) => {
        const response = await authService.register(userData);
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        setUser(user);
        return response;
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
    login,
    register,
    logout,
    loading,
    error,         // ✅ Expose error
    setError,      // ✅ Expose setError so components can clear it
};


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};