import * as React from 'react';

export const SessionContext = React.createContext({
    session: {},
    setSession: () => { },
});

export function useSession() {
    return React.useContext(SessionContext);
}
