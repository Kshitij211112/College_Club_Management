import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <AuthProvider>
                <ThemeProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </ThemeProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App;