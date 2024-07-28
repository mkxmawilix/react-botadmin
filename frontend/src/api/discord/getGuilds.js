import apiClient from '../../services/Api/apiClient';

export const getGuilds = async (mode) => {
    try {
        const response = await apiClient.get('/discord/guilds/', { params: { mode } });
        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 400) {
                throw new Error(data.message || "Invalid request.");
            } else {
                throw new Error(`An error has occurred: ${status}`);
            }
        } else if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            throw new Error(error.message || "An unexpected error occurred.");
        }
    }
};
