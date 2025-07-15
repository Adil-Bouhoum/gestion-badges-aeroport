import axios from "axios";

const API_URL = "/api";

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Required for Sanctum cookies
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Add request interceptor to include Sanctum token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("sanctum_token"); // or your token storage key
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const userService = {
    getUsers: () => api.get("/users"),
    getUser: (id) => api.get(`/users/${id}`),
    createUser: (userData) => api.post("/users", userData),
    updateUser: (id, userData) => api.put(`/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/users/${id}`),
};
