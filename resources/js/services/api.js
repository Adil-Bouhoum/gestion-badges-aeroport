import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: "/api",
    withCredentials: true, // Important for Sanctum cookies!
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add Authorization token if exists
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

// CSRF Token fetcher (required before login/register)
const getCsrfToken = () =>
    axios.get("/sanctum/csrf-cookie", { withCredentials: true });

// Auth Service
export const authService = {
    getCsrfToken,
    login: (credentials) => api.post("/login", credentials),
    register: (userData) => api.post("/register", userData),
    logout: () => api.post("/logout"),
    me: () => api.get("/me"),
};

// Badge Service
export const badgeService = {
    getAll: () => api.get("/badges"),
    create: (data) => api.post("/badges", data),
    update: (id, data) => api.put(`/badges/${id}`, data),
    delete: (id) => api.delete(`/badges/${id}`),
};

// Zone Service
export const zoneService = {
    getAll: () => api.get("/zones"),
    create: (data) => api.post("/zones", data),
    update: (id, data) => api.put(`/zones/${id}`, data),
    delete: (id) => api.delete(`/zones/${id}`),
};

export default api;
