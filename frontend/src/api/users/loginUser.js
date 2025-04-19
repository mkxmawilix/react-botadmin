import apiClient from "../../services/Api/apiClient";

export const loginUser = async ({ email, password }) => {
    try {
        const response = await apiClient.post("/login", {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Error during logging :", error);
        throw error;
    }
};
