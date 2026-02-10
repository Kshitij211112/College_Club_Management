import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import StudentDashboard from './pages/studentDashboard';
import EventsPage from './pages/EventsPage'; 
import Clubs from './pages/Clubs'; 
import ClubDetail from './pages/ClubDetail';
import ClubTeams from './pages/ClubTeams'; // New import for Teams Management

function App() {
    const googleClientId = "636185777983-7bth2cf80b8qocga8pu7f28aobkeiauo.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <BrowserRouter>
                <Navbar /> 
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    
                    <Route path="/home" element={
                        <ProtectedRoute isAdminRequired={false}>
                            <Home />
                        </ProtectedRoute>
                    } />

                    {/* Clubs Directory Route */}
                    <Route path="/clubs" element={
                        <ProtectedRoute isAdminRequired={false}>
                            <Clubs />
                        </ProtectedRoute>
                    } />

                    {/* Dynamic Club Detail Route */}
                    <Route path="/clubs/:id" element={
                        <ProtectedRoute isAdminRequired={false}>
                            <ClubDetail />
                        </ProtectedRoute>
                    } />

                    {/* Club Teams Management Route */}
                    <Route path="/clubs/:id/teams" element={
                        <ProtectedRoute isAdminRequired={false}>
                            <ClubTeams />
                        </ProtectedRoute>
                    } />

                    <Route path="/events" element={
                        <ProtectedRoute isAdminRequired={false}>
                            <EventsPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/events/:clubId" element={
                        <ProtectedRoute isAdminRequired={false}>
                            <EventsPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/my-clubs" element={
                        <ProtectedRoute isAdminRequired={false}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin-dashboard" element={
                        <ProtectedRoute isAdminRequired={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;