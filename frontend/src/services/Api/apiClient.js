import axios from "axios";
import { useSession } from "../../context/SessionContext";
import { useMemo } from 'react';

const createApiClient = (session) => {
    const apiClient = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
        headers: {
            "Content-Type": "application/json",
        },
    });

    apiClient.interceptors.request.use((config) => {
        if (session?.user?.token) {
            config.headers["Authorization"] = `Bearer ${session.user.token}`;
        }
        return config;
    });

    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                console.error('Token expired or unauthorized, redirecting to sign-in...');
                window.location.href = '/sign-in';
            }
            return Promise.reject(error);
        }
    );


    return apiClient;
};

export const useApiClient = () => {
    const { session } = useSession();
    return useMemo(() => {
        return createApiClient(session);
    }, [session]);
};
