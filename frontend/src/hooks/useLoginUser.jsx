import { useApiClient } from "../services/Api/apiClient";
import { loginUser } from '../api/users/loginUser';

export const useLoginUser = () => {
    const apiClient = useApiClient();
    return ({ email, password }) => loginUser(apiClient, { email, password });
};
