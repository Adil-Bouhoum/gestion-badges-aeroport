import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth service
export const authService = {
    login: (credentials) => api.post("/login", credentials),
    register: (userData) => api.post("/register", userData),
    logout: () => api.post("/logout"),
    me: () => api.get("/user"),
};

// Badge service
export const badgeService = {
    getAll: () => api.get("/badges"),
    create: (data) => api.post("/badges", data),
    update: (id, data) => api.put(`/badges/${id}`, data),
    delete: (id) => api.delete(`/badges/${id}`),
};

// Zone service
export const zoneService = {
    getAll: () => api.get("/zones"),
    create: (data) => api.post("/zones", data),
    update: (id, data) => api.put(`/zones/${id}`, data),
    delete: (id) => api.delete(`/zones/${id}`),
};

export default api;
