export const loginUser = async (apiClient, { email, password }) => {
    try {
        const response = await apiClient.post('/login', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error during logging :', error);
        throw new Error('Failed to log user.');
    }
};
