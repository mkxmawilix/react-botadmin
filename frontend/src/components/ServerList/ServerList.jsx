import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { getGuilds } from '../../api/discord/getGuilds';
import OnlineIcon from '@mui/icons-material/CheckCircleOutline';
import OfflineIcon from '@mui/icons-material/HighlightOff';

const ServerList = () => {
    const [guilds, setGuilds] = useState([]);

    useEffect(() => {
        const fetchGuilds = async () => {
            try {
                const response = await getGuilds();
                setGuilds(response.guilds);
            } catch (error) {
                console.error('Error fetching guilds:', error);
            }
        };

        fetchGuilds();
    }, []);

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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export { ServerList };