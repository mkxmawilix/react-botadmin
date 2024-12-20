import apiClient from '../../services/Api/apiClient';

export const getGuild = async (guildId) => {
    try {
        const response = await apiClient.get(`/discord/guilds/${guildId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching guild:', error);
        throw new Error('Failed to fetch guild.');
    }
};
