import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const session = JSON.parse(sessionStorage.getItem("session"));
        if (session && session?.user?.token) {
            config.headers["Authorization"] = `Bearer ${session.user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.error("Token expired or unauthorized, redirecting to sign-in...");
            window.location.href = "/sign-in";
        }
        return Promise.reject(error);
    }
);

export default apiClient;
