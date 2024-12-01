import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button } from '@mui/material';
import OnlineIcon from '@mui/icons-material/CheckCircleOutline';
import OfflineIcon from '@mui/icons-material/HighlightOff';

import { useNavigate } from 'react-router-dom';

import { getGuilds } from '../../api/discord/getGuilds';

const ServerList = ({ mode='list' }) => {
    const [guilds, setGuilds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGuilds = async () => {
            try {
                const response = await getGuilds(mode);
                setGuilds(response.guilds);
            } catch (error) {
                console.error('Error fetching guilds:', error);
            }
        };

        fetchGuilds();
    }, [mode]);

    const handleView = (id) => {
        navigate(`/dashboard/configuration/${id}`);
    };

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            { mode === 'list' ? 
                                <>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>Owner</TableCell>
                                    <TableCell>Shard ID</TableCell>
                                    <TableCell>Status</TableCell>
                                </>
                                : 
                                <>
                                    <TableCell></TableCell>
                                </>
                            }
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {guilds.map((guild) => (
                            <TableRow key={guild.id}>
                                <TableCell>{guild.id}</TableCell>
                                <TableCell>{guild.name}</TableCell>
                                { mode === 'list' ?
                                <>
                                    <TableCell>{new Date(guild.creationDate).toLocaleString()}</TableCell>
                                    <TableCell>{guild.owner}</TableCell>
                                    <TableCell>{guild.shardId}</TableCell>
                                    <TableCell>
                                        {guild.isActive ? <OnlineIcon color="success" /> : <OfflineIcon color="error" />}
                                    </TableCell>
                                </>
                                : 
                                <>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleView(guild.id)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </>
                                }
                            </TableRow>
                        ))}
                        {guilds.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No servers found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export { ServerList };