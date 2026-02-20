import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import AuthPage from '../pages/auth/AuthPage';
import HomePage from '../pages/home/HomePage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ClubsPage from '../pages/clubs/ClubsPage';
import ClubDetailPage from '../pages/clubs/ClubDetailPage';
import ClubTeamsPage from '../pages/clubs/ClubTeamsPage';
import EventsPage from '../pages/events/EventsPage';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import ProfilePage from '../pages/profile/ProfilePage';
import PresidentDashboard from '../pages/president/PresidentDashboard';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public route — no layout */}
            <Route path="/auth" element={<AuthPage />} />

            {/* President Dashboard — own layout (sidebar + topbar) */}
            <Route path="/president-dashboard" element={
                <ProtectedRoute roles={['president', 'admin']}>
                    <PresidentDashboard />
                </ProtectedRoute>
            } />

            {/* All protected routes share MainLayout */}
            <Route element={<MainLayout />}>
                <Route path="/home" element={
                    <ProtectedRoute><HomePage /></ProtectedRoute>
                } />

                <Route path="/clubs" element={
                    <ProtectedRoute><ClubsPage /></ProtectedRoute>
                } />

                <Route path="/clubs/:id" element={
                    <ProtectedRoute><ClubDetailPage /></ProtectedRoute>
                } />

                <Route path="/clubs/:id/teams" element={
                    <ProtectedRoute><ClubTeamsPage /></ProtectedRoute>
                } />

                <Route path="/events" element={
                    <ProtectedRoute><EventsPage /></ProtectedRoute>
                } />

                <Route path="/events/:clubId" element={
                    <ProtectedRoute><EventsPage /></ProtectedRoute>
                } />

                <Route path="/my-clubs" element={
                    <ProtectedRoute><StudentDashboard /></ProtectedRoute>
                } />

                <Route path="/profile" element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />

                <Route path="/admin-dashboard" element={
                    <ProtectedRoute roles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Catch-all */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
};

export default AppRoutes;
