import { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AddServerModal = ({ open, handleClose }) => {
    const [serverName, setServerName] = useState('');

    const handleSubmit = () => {
        console.log('Server Name:', serverName);
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-server-modal-title"
            aria-describedby="add-server-modal-description"
        >
            <Box sx={style}>
                <Typography id="add-server-modal-title" variant="h6" component="h2">
                    Add Server
                </Typography>
                <TextField
                    fullWidth
                    label="Server Name"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                    Add
                </Button>
            </Box>
        </Modal>
    );
};

AddServerModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export { AddServerModal };