import { useApiClient } from "../services/Api/apiClient";
import { createUser } from '../api/users/createUser';

export const useCreateUser = () => {
    const apiClient = useApiClient();
    return ({ email, password, username}) => createUser(apiClient, { email, password, username});
};
