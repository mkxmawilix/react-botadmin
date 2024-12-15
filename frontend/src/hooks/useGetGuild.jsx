import { useApiClient } from "../services/Api/apiClient";
import { useCallback } from 'react';
import { getGuild } from "../api/discord/getGuild";

export const useGetGuild = () => {
    const apiClient = useApiClient();

    return useCallback(async (guildId) => {
        return await getGuild(apiClient, guildId);
    }, [apiClient]);
};
