import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    user: { id: number; name: string } | null;
    login: (name: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Mock User ID for simplicity, in real app would come from DB
const MOCK_USER_ID = 1;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ id: number; name: string } | null>(
        { id: 1, name: 'Demo User' } // Default logged in for ease
    );

    const login = (name: string) => {
        setUser({ id: Math.floor(Math.random() * 1000), name });
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
