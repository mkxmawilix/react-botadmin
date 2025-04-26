import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
/** Components */
import Register from "./components/Register";
import { SessionProvider } from "./context/SessionProvider";
/** Layouts */
import AppDashboardLayout from "./layouts/Dashboard";
import ServerConfigurationPage from "./pages/configuration";
/** Pages */
import DashboardPage from "./pages/index";
import ServerListPage from "./pages/serverList";
import SignIn from "./pages/signIn";

const router = createBrowserRouter([
    {
        Component: App,
        children: [
            {
                path: "/",
                Component: AppDashboardLayout,
                children: [
                    {
                        path: "",
                        Component: DashboardPage,
                    },
                    {
                        path: "/serverlist",
                        Component: ServerListPage,
                    },
                    {
                        path: "/servers/:serverId",
                        Component: ServerConfigurationPage,
                    },
                    {
                        path: "/configuration/:serverId",
                        Component: ServerConfigurationPage,
                    },
                ],
            },
            {
                path: "/sign-in",
                Component: SignIn,
            },
            {
                path: "/register",
                Component: Register,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <SessionProvider>
            <RouterProvider router={router} />
        </SessionProvider>
    </React.StrictMode>
);
