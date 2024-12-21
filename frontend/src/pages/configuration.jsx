import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button } from '@mui/material';
import { useActivePage } from '@toolpad/core/useActivePage';
import { PageContainer } from '@toolpad/core/PageContainer';

/**  Component **/
import { ServerConfig } from '../components/ServerConfig/ServerConfig';

/** API **/
import { getGuild } from '../api/guilds/getGuild';

const ServerConfigurationPage = () => {
    const { serverId } = useParams();
    const activePage = useActivePage();
    const [guild, setGuild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGuild = async () => {
            try {
                const guildData = await getGuild(serverId);
                setGuild(guildData);
            } catch (err) {
                console.error('Error fetching guild:', err);
                setError('Failed to load guild data.');
            } finally {
                setLoading(false);
            }
        };

        fetchGuild();
    }, [serverId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }


    if (error) {
        return (
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                <p>{error}</p>
                <Button variant="contained" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </Box>
        );
    }

    const title = `Guild ${guild.name}`;
    const path = `${activePage.path}/${serverId}`;
    const breadcrumbs = [...activePage.breadcrumbs, { title, path }];
    return (
        <PageContainer maxWidth={false} title={`Configuration - ${guild.name}`} breadcrumbs={breadcrumbs}>
            <ServerConfig guild={guild} />
        </PageContainer>
    );
};

export default ServerConfigurationPage;
