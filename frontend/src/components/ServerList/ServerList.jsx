import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import AddServerModal from '../AddServerModal';

const servers = [
    { id: 1, name: 'Server 1', dateAdded: '2024-07-01' },
    { id: 2, name: 'Server 2', dateAdded: '2024-07-02' },
];

const ServerList = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Server
            </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Date Added</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {servers.map((server) => (
                            <TableRow key={server.id}>
                                <TableCell>{server.id}</TableCell>
                                <TableCell>{server.name}</TableCell>
                                <TableCell>{server.dateAdded}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddServerModal open={open} handleClose={handleClose} />
        </Box>
    );
};

export { ServerList };