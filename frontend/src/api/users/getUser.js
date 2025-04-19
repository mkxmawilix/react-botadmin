import apiClient from "../../services/Api/apiClient";

export const getUser = async (userId) => {
    try {
        const response = await apiClient.post("/user", { userId });
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
