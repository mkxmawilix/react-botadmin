import { useCallback } from 'react';
import { useApiClient } from "../services/Api/apiClient";
import { getGuilds } from "../api/discord/getGuilds";

export const useGetGuilds = () => {
    const apiClient = useApiClient();

    return useCallback(async () => {
        return await getGuilds(apiClient);
    }, [apiClient]);
};
