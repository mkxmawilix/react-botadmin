import apiClient from '../../services/Api/apiClient';

export const createUser = async ({ email, password, username}) => {
    try {
        const data = { email, password, username};
        const response = await apiClient.get('/register', data);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user.');
    }
};
