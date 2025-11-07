import { Session } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
    user: Session | null;
    setAuth: (authUser: Session | null) => void;
    setUserData: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<Session | null>(null);
    
    // if there's no user, move the user to the welcome page

    // setAuth will set the session of the user and based on this will redirect the user to the home screen
    const setAuth = (authUser: Session | null) => {
        setUser(authUser);
    }

    const setUserData = (userData: any) => {
        // take the user and spread it into the user state
        setUser({...user, ...userData});
    }

    return (
        <AuthContext.Provider value={{user, setAuth, setUserData}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
