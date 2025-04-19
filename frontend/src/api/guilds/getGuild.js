import apiClient from "../../services/Api/apiClient";

export const getGuild = async (guildId) => {
    try {
        const response = await apiClient.get(`/guilds/${guildId}`);
        return response.data.guild;
    } catch (error) {
        console.error("Error fetching guild:", error);
        throw error;
    }
};
