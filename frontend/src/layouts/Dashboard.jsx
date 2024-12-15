import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../context/SessionContext';
import { isTokenValid } from "../services/Auth/authToken";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SmartToyIcon from '@mui/icons-material/SmartToy';



const CustomAppTitle = () => {
    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <SmartToyIcon fontSize="large" color="primary" />
            <Typography variant="h6">Adminbot App</Typography>
        </Stack>
    );
}

const AppDashboardLayout = () => {
    const { session } = useSession();
    const location = useLocation();

    if (!session || session?.user?.token == undefined || session?.user?.token && !isTokenValid(session.user.token)) {
        const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;

        return <Navigate to={redirectTo} replace />;
    }

    return (
        <DashboardLayout slots={{
            appTitle: CustomAppTitle,
        }}>
            <PageContainer>
                <Outlet />
            </PageContainer>
        </DashboardLayout>
    );
}

export default AppDashboardLayout