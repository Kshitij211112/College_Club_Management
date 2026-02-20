import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getStoredAuth, clearStoredAuth } from '../utils/helpers';
import { ROLES } from '../constants/roles';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => getStoredAuth());

    // Re-sync if localStorage changes from another tab
    useEffect(() => {
        const onStorage = () => setAuth(getStoredAuth());
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const login = useCallback((profile) => {
        localStorage.setItem('profile', JSON.stringify(profile));
        setAuth({
            token: profile.token,
            user: profile.user,
            userId: profile.user?._id || profile._id,
        });
    }, []);

    const logout = useCallback(() => {
        clearStoredAuth();
        setAuth(null);
    }, []);

    const value = {
        user: auth?.user || null,
        token: auth?.token || null,
        userId: auth?.userId || null,
        isLoggedIn: !!auth?.token,
        isAdmin: auth?.user?.role === ROLES.ADMIN || auth?.user?.isAdmin === true,
        isPresident: auth?.user?.role === ROLES.PRESIDENT,
        role: auth?.user?.role || null,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
