import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';

/**  Hooks **/
import { useLocalStorage } from '../hooks/useLocalStorage';

/** API **/
import { createUser } from "../api/users/createUser";
import { getUser } from "../api/users/getUser";
import { loginUser } from "../api/users/loginUser";

/** Services **/
import { getAuthToken, isTokenValid } from '../services/Auth/authToken';

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authData, setAuthData] = useState({
        token: null,
        userId: null,
        user: null,
    });  // eslint-disable-line
    const { getItem, setItem, removeItem } = useLocalStorage();  // eslint-disable-line

    const navigate = useNavigate();

    const handleError = (error) => {
        toast.error(error.message);
        throw error;
    };

    const handleSuccess = (message) => {
        toast.success(message);
    };

    const handleFailure = (message) => {
        toast.error(message);
    };

    const login = async ({ email, password }) => {
        try {
            const response = await loginUser({ email, password });
            if (response) {
                const authToken = response.token;
                if (!authToken) {
                    handleFailure("Sign in failed");
                }
                const { username, id: userId } = response.user;
                const token = getAuthToken(authToken);
                const userObj = { userId: userId, token: token };
                setItem('user', JSON.stringify(userObj));
                setAuthData({ token, userId, user: username });
                setIsAuthenticated(true);
                handleSuccess("Successfully logged in");
                navigate('/dashboard', { replace: true });
            } else {
                handleFailure("Failed to login");
            }
        } catch (error) {
            handleError(error);
        }
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            const userObj = JSON.parse(getItem('user'));
            if (!userObj) {
                return;
            }
            removeItem('user');
            setAuthData({
                token: null,
                userId: null,
                user: null
            });
            handleSuccess("Successfully logged out");
            setIsAuthenticated(false);
            navigate('/', { replace: true });
        } catch (error) {
            handleError(error);
        }
    };

    const register = async ({ email, password, username }) => {
        try {
            const response = await createUser({ email, password, username });
            if (response) {
                const authToken = response.token;
                if (!authToken) {
                    handleFailure("Token not found");
                }
                const { username, id: userId } = response.user;
                const token = getAuthToken(authToken);
                const userObj = { userId: userId, token: token };
                setItem('user', JSON.stringify(userObj));
                setAuthData({ token, userId, user: username });
                setIsAuthenticated(true);
                handleSuccess("Successfully registered");
                navigate('/dashboard', { replace: true });

            } else {
                handleFailure("Failed to register");
            }
        } catch (error) {
            handleError(error);
        }
        setIsAuthenticated(true);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const userObj = getItem('user');
            if (userObj?.token) {
                try {
                    if (isTokenValid(userObj.token, userObj.userId)) {
                        const response = await getUser(userObj.userId);
                        const { user: { username, id: userId } } = response;
                        setAuthData({ token: userObj.token, userId, user: username });
                        setIsAuthenticated(true);
                    } else {
                        removeItem('user');
                        setAuthData({
                            token: null,
                            userId: null,
                            user: null
                        });
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    removeItem('user');
                    setAuthData({
                        token: null,
                        userId: null,
                        user: null
                    });
                    setIsAuthenticated(false);
                }
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, authData, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};