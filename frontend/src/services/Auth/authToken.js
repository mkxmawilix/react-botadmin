import { jwtDecode } from "jwt-decode";

export const getAuthToken = (authHeader) => {
    if (!authHeader) {
        return null;
    }
    return authHeader.split(" ")[1];
};

export const isTokenValid = (token, userId) => {
    try {
        const decoded = jwtDecode(token);
        if (userId && decoded.id !== userId) {
            return false;
        }
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        return false;
    }
};
