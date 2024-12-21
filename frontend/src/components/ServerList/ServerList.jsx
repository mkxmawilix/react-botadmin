import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button } from '@mui/material';
import OnlineIcon from '@mui/icons-material/CheckCircleOutline';
import OfflineIcon from '@mui/icons-material/HighlightOff';

import { useNavigate } from 'react-router-dom';

/** API **/
import { getGuilds } from '../../api/guilds/getGuilds';

const ServerList = () => {
    const [guilds, setGuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGuilds = async () => {
            try {
                const data = await getGuilds();
                setGuilds(data.guilds);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGuilds();
    }, []);


    const handleView = (id) => {
        navigate(`/servers/${id}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Shard ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {guilds.map((guild) => (
                            <TableRow key={guild.id}>
                                <TableCell>{guild.id}</TableCell>
                                <TableCell>{guild.name}</TableCell>
                                <TableCell>{new Date(guild.creationDate).toLocaleString()}</TableCell>
                                <TableCell>{guild.owner}</TableCell>
                                <TableCell>{guild.shardId}</TableCell>
                                <TableCell>
                                    {guild.isActive ? <OnlineIcon color="success" /> : <OfflineIcon color="error" />}
                                </TableCell>
                                <TableCell>
                                    {guild.canConfigure && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleView(guild.id)}
                                        >
                                            View
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {guilds.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No servers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export { ServerList };
