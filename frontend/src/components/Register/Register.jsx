import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import toast from 'react-hot-toast';

/** Hooks **/
import { useSession } from '../../hooks/useSession';

/** Services **/
import { getAuthToken } from "../../services/Auth/authToken";

/** API **/
import { createUser } from "../../api/users/createUser";


const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const { setSession } = useSession();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        try {
            const response = await createUser({ email, password, username });
            if (response) {
                const authToken = response.token;
                if (!authToken) {
                    toast.error("Token not found");
                }
                const { username, id: userId } = response.user;
                const token = getAuthToken(authToken);
                if (token) {
                    const session = {
                        user: {
                            id: userId,
                            name: username,
                            email: email,
                            token: token,
                        },
                    };
                    setSession(session);
                    navigate('/', { replace: true })
                }
            } else {
                toast.error("Failed to register");
            }
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
        navigate('/');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    S&apos;inscrire
                </Typography>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Nom d'utilisateur"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Adresse e-mail"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mot de passe"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleRegister}
                    >
                        S&apos;inscrire
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export { Register };