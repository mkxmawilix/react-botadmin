export const getGuilds = async (apiClient) => {
    try {
        const response = await apiClient.get("/discord/guilds");
        return response.data;
    } catch (error) {
        console.error('Error fetching guild:', error);
        throw new Error('Failed to fetch guilds.');
    }
};
