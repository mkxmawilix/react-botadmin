import apiClient from '../../services/Api/apiClient';

export const getGuilds = async () => {
    try {
        const response = await apiClient.get("/discord/guilds");
        return response.data;
    } catch (error) {
        console.error('Error fetching guild:', error);
        throw new Error('Failed to fetch guilds.');
    }
};
