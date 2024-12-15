import * as React from 'react';

import { Toaster } from 'react-hot-toast';

import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
// import TuneIcon from '@mui/icons-material/Tune';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet, useNavigate } from 'react-router-dom';
import { SessionContext } from './context/SessionContext';


const NAVIGATION = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'serverlist',
        title: 'Servers',
        icon: <StorageIcon />,
        pattern: 'servers{/:serverId}*',
    },
    // {
    //     segment: 'configuration',
    //     title: 'Servers configuration',
    //     icon: <TuneIcon />,
    // },
];

const App = () => {

    const [session, setSession] = React.useState(null);
    const navigate = useNavigate();

    const signIn = React.useCallback(() => {
        navigate('/sign-in');
    }, [navigate]);

    const signOut = React.useCallback(() => {
        setSession(null);
        navigate('/sign-in');
    }, [navigate]);

    const sessionContextValue = React.useMemo(() => ({ session, setSession }), [session, setSession]);
    return (
        <SessionContext.Provider value={sessionContextValue}>
            <Toaster />
            <AppProvider
                navigation={NAVIGATION}
                session={session}
                authentication={{ signIn, signOut }}
            >
                <Outlet />
            </AppProvider>
        </SessionContext.Provider>
    );
}

export default App;
