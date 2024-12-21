import apiClient from '../../services/Api/apiClient';

export const getGuilds = async () => {
    try {
        const response = await apiClient.get("/guilds");
        return response.data;
    } catch (error) {
        console.error('Error fetching guild:', error);
        throw error;
    }
};
