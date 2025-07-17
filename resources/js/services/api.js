// src/services/api.js
import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// CSRF Token fetcher
export const getCsrfToken = () =>
    axios.get("/sanctum/csrf-cookie", { baseURL: "/", withCredentials: true });

// Auth Service
export const authService = {
    getCsrfToken,
    login: (credentials) => api.post("/login", credentials),
    register: (userData) => api.post("/register", userData),
    logout: () => api.post("/logout"),
    me: () => api.get("/me"),
    forgotPassword: (email) => api.post("/forgot-password", { email }),
    resetPassword: (data) => api.post("/reset-password", data),
};

// User Service
export const userService = {
    getAll: () => api.get("/users"),
    get: (id) => api.get(`/users/${id}`),
    create: (data) => api.post("/users", data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Badge Service
export const badgeService = {
    getAll: () => api.get("/badges"),
    create: (data) => api.post("/badges", data),
    update: (id, data) => api.put(`/badges/${id}`, data),
    delete: (id) => api.delete(`/badges/${id}`),
};

// Badge Request Service (NEW - this was missing!)
export const badgeRequestService = {
    getAll: () => api.get("/badge-requests"),
    create: (data) => api.post("/badge-requests", data),
    updateStatus: (id, data) => api.put(`/badge-requests/${id}/status`, data),
};

// Zone Service
export const zoneService = {
    getAll: () => api.get("/zones"),
    create: (data) => api.post("/zones", data),
    update: (id, data) => api.put(`/zones/${id}`, data),
    delete: (id) => api.delete(`/zones/${id}`),
};

export default api;
