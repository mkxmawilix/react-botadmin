import apiClient from "../../services/Api/apiClient";

export const getUser = async (userId) => {
    try {
        const response = await apiClient.post("/user", { userId });
        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            const message = data.message || `An error has occurred: ${status}`;
            throw new Error(message);
        } else if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            throw new Error(error.message || "An unexpected error occurred.");
        }
    }
};