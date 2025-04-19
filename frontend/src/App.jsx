import * as React from "react";

import { Toaster } from "react-hot-toast";

import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
// import TuneIcon from '@mui/icons-material/Tune';
import { AppProvider } from "@toolpad/core/react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
import { useSession } from "./hooks/useSession";

const NAVIGATION = [
    {
        kind: "header",
        title: "Main items",
    },
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
    },
    {
        segment: "serverlist",
        title: "Servers",
        icon: <StorageIcon />,
        pattern: "servers{/:serverId}*",
    },
    // {
    //     segment: 'configuration',
    //     title: 'Servers configuration',
    //     icon: <TuneIcon />,
    // },
];

const App = () => {
    const { session, setSession } = useSession();
    const navigate = useNavigate();

    const signIn = React.useCallback(() => {
        navigate("/sign-in");
    }, [navigate]);

    const signOut = React.useCallback(() => {
        setSession(null);
        navigate("/sign-in");
    }, [navigate, setSession]);

    return (
        <>
            <Toaster />
            <AppProvider navigation={NAVIGATION} session={session} authentication={{ signIn, signOut }}>
                <Outlet />
            </AppProvider>
        </>
    );
};

export default App;
