// resources/js/services/badgeApi.js
const API_BASE_URL = "/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
    };
};

export const badgeApi = {
    // Get all badge requests for the current user
    getBadgeRequests: async () => {
        const response = await fetch(`${API_BASE_URL}/badge-requests`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch badge requests");
        }

        return response.json();
    },

    // Create a new badge from an approved request (Admin only)
    createBadge: async ({ badge_request_id, badge_number }) => {
        const response = await fetch(`${API_BASE_URL}/badges`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ badge_request_id, badge_number }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create badge");
        }

        return response.json();
    },

    // Download a badge PDF
    downloadBadge: async (badgeId) => {
        const response = await fetch(
            `${API_BASE_URL}/badges/${badgeId}/download`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to download badge");
        }

        return response.blob();
    },

    // Get approved requests ready for badge creation (Admin only)
    getApprovedRequests: async () => {
        const response = await fetch(`${API_BASE_URL}/badge-requests`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch approved requests");
        }

        const data = await response.json();
        // Filter only approved requests that don't have badges yet
        return data.filter(
            (request) => request.status === "approved" && !request.badge
        );
    },

    // Get user's created badges
    getUserBadges: async () => {
        const response = await fetch(`${API_BASE_URL}/badge-requests`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user badges");
        }

        const data = await response.json();
        // Filter only approved requests that have badges created
        return data.filter(
            (request) => request.status === "approved" && request.badge
        );
    },
};

// Utility functions for badge data formatting
export const badgeUtils = {
    formatZones: (zones) => {
        if (!zones) return "";
        return zones
            .split(",")
            .map((zone) => zone.charAt(0).toUpperCase() + zone.slice(1))
            .join(", ");
    },

    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    },

    isExpired: (validUntil) => {
        return new Date(validUntil) < new Date();
    },

    getDaysRemaining: (validUntil) => {
        const today = new Date();
        const expiry = new Date(validUntil);
        const timeDiff = expiry.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    },

    getBadgeStatus: (validUntil) => {
        if (badgeUtils.isExpired(validUntil)) {
            return {
                status: "expired",
                className: "bg-danger",
                text: "Expired",
            };
        } else if (badgeUtils.getDaysRemaining(validUntil) <= 7) {
            return {
                status: "expiring",
                className: "bg-warning",
                text: "Expires Soon",
            };
        } else {
            return {
                status: "active",
                className: "bg-success",
                text: "Active",
            };
        }
    },

    downloadBadgeFile: async (badgeId, filename = null) => {
        try {
            const blob = await badgeApi.downloadBadge(badgeId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename || `badge_${badgeId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading badge:", error);
            throw error;
        }
    },
};
