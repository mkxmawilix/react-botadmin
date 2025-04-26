import { Box, Button, Paper } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useActivePage } from "@toolpad/core/useActivePage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/** API **/
import { getGuild } from "../api/guilds/getGuild";
/**  Component **/
import { ServerConfig } from "../components/ServerConfig/ServerConfig";

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
                console.error("Error fetching guild:", err);
                setError("Failed to load guild data.");
            } finally {
                setLoading(false);
            }
        };

        fetchGuild();
    }, [serverId]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: "center", marginTop: 4 }}>
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
        <Paper sx={{ width: "100%" }}>
            <PageContainer maxWidth={false} title={`Configuration - ${guild.name}`} breadcrumbs={breadcrumbs}>
                <ServerConfig guild={guild} />
            </PageContainer>
        </Paper>
    );
};

export default ServerConfigurationPage;
