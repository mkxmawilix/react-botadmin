import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

/** Components **/
import DynamicConfigForm from "../DynamicConfigForm"

const ServerConfig = ({ guild }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [isDirty, setIsDirty] = useState(() =>
        guild.cogsSettings.map(() => false)
    );
    const [showDialog, setShowDialog] = useState(false);
    const [pendingTab, setPendingTab] = useState(null);

    const handleTabChange = (event, newValue) => {
        if (isDirty[activeTab]) {
            setShowDialog(true);
            setPendingTab(newValue);
        } else {
            setActiveTab(newValue);
        }
    };

    const confirmTabChange = () => {
        setShowDialog(false);
        setActiveTab(pendingTab);
        setPendingTab(null);
    };

    const cancelTabChange = () => {
        setShowDialog(false);
        setPendingTab(null);
    };

    const handleDirtyChange = (index, dirty) => {

        // Form has changed set current tab as dirty
        setIsDirty((prev) => {
            const newState = [...prev];
            newState[index] = dirty;
            return newState;
        });
    };

    const handleSave = (index, data) => {
        // TODO: Apply config changes here
        // Remove dirty state
        setIsDirty((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    return (
        <Box sx={{ display: 'flex', flexGrow: 1, bgcolor: 'background.paper', height: '100%' }}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={activeTab}
                onChange={handleTabChange}
                aria-label="Cogs configurations tabs"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                {guild.cogsSettings.map((settings, index) => (
                    <Tab key={index} label={settings.name || `Cog ${index + 1}`} />
                ))}
            </Tabs>
            {/* TODO map on transformed object usable by the form */}
            {guild.cogsSettings.map((settings, index) => (
                <Box
                    key={index}
                    role="tabpanel"
                    hidden={activeTab !== index}
                    id={`vertical-tabpanel-${index}`}
                    aria-labelledby={`vertical-tab-${index}`}
                    sx={{ p: 3 }}
                >
                    {activeTab === index && (
                        /* TODO Use new transformed object to send fields to the form */
                        <DynamicConfigForm
                            fields={[{
                                name: 'activeCog',
                                label: 'Active',
                                type: 'checkbox',
                                defaultValue: false,
                                validation: {
                                    required: true,
                                },
                            }]}
                            onSave={(data) => handleSave(index, data)}
                            onDirtyChange={(dirty) => handleDirtyChange(index, dirty)}
                        />
                    )}
                </Box>
            ))}
            <Dialog open={showDialog} onClose={cancelTabChange}>
                <DialogTitle>Unsaved Changes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have unsaved changes in the current tab. Are you sure you want to switch tabs without saving?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelTabChange} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={confirmTabChange} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

ServerConfig.propTypes = {
    guild: PropTypes.object.isRequired,
};

export { ServerConfig };
