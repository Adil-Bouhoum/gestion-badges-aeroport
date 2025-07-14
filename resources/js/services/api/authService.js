import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

const authService = {
    async getCsrfToken() {
        return api.get("/sanctum/csrf-cookie");
    },

    async login(credentials) {
        try {
            await this.getCsrfToken();
            const response = await api.post("/api/login", credentials);
            return response.data;
        } catch (error) {
            // Throw meaningful error
            throw new Error(error.response?.data?.message || "Login failed");
        }
    },
    /**
     * Register new user
     * @param {object} userData - { name, email, password, etc. }
     */
    async register(userData) {
        await this.getCsrfToken();
        return api.post("/api/register", userData);
    },

    /**
     * Get authenticated user data
     */
    async me() {
        return api.get("/api/me");
    },

    /**
     * Logout user
     */
    async logout() {
        return api.post("/api/logout");
    },

    /**
     * Password reset request
     * @param {string} email
     */
    async forgotPassword(email) {
        await this.getCsrfToken();
        return api.post("/api/forgot-password", { email });
    },

    /**
     * Reset password
     * @param {object} data - { token, email, password, password_confirmation }
     */
    async resetPassword(data) {
        await this.getCsrfToken();
        return api.post("/api/reset-password", data);
    },
};

export default authService;
