import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';

/** API **/
import { getGuild } from '../../api/discord/getGuild';



const ServerConfig = () => {
    const { serverId } = useParams();
    const navigate = useNavigate();
    const [guild, setGuild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGuild = async () => {
            try {
                const response = await getGuild(serverId);
                setGuild(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching guild:', error);
                setError(error);
            }
        };
        fetchGuild();
    }, [serverId]);

    const handleSave = () => {
        console.log('Saving configuration for:', serverId);
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Configuration for {guild.name}
            </Typography>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Guild Name"
                    value={guild.name}
                    fullWidth
                    disabled
                />
            </Box>
            <Button variant="contained" color="primary" onClick={handleSave}>
                Save
            </Button>
            <Button variant="text" sx={{ ml: 2 }} onClick={() => navigate('/dashboard')}>
                Back to Dashboard
            </Button>
        </Box>
    );
};

export { ServerConfig };
