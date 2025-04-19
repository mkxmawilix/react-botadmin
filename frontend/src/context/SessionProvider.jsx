import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { SessionContext } from "./SessionContext";

/** Services **/
import { isTokenValid } from "../services/Auth/authToken";

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(() => {
        const storedSession = sessionStorage.getItem("session");
        return storedSession ? JSON.parse(storedSession) : null;
    });

    useEffect(() => {
        if (session) {
            const { token, id } = session.user;
            if (isTokenValid(token, id)) {
                sessionStorage.setItem("session", JSON.stringify(session));
            } else {
                sessionStorage.removeItem("session");
                setSession(null);
            }
        } else {
            sessionStorage.removeItem("session");
        }
    }, [session]);

    return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>;
};
SessionProvider.propTypes = {
    children: PropTypes.node,
};
