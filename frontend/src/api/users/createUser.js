export const createUser = async (apiClient, { email, password, username}) => {
    try {
        const data = { email, password, username};
        const response = await apiClient.post('/register', data);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user.');
    }
};
