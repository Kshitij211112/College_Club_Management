import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminRequired }) => {
    const location = useLocation();
    
    // 1. Safely retrieve profile
    const profileData = localStorage.getItem('profile');
    const profile = profileData ? JSON.parse(profileData) : null;

    // 2. If not logged in, send to /auth (NOT /login)
    // We use 'replace' to stop the infinite loop and 'state' to remember the current page
    if (!profile || !profile.token) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // 3. If Admin is required but the user is a student
    if (isAdminRequired && profile.user.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-red-100 text-center max-w-md">
                    <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-800">Access Denied</h1>
                    <p className="text-gray-500 mt-4 leading-relaxed">
                        This area is restricted to **Administrators**. Your account does not have the necessary permissions.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/home'}
                        className="mt-8 bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    // 4. Everything is good, render the page
    return children;
};

export default ProtectedRoute;