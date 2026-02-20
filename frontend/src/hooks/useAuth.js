import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook for accessing auth state.
 * Replaces all manual localStorage parsing throughout the app.
 * 
 * Usage:
 *   const { user, isAdmin, isPresident, userId, login, logout } = useAuth();
 */
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;
