import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext'; // Import the context

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useContext(ThemeContext); // Use the context

    const profileData = localStorage.getItem('profile');
    const user = profileData ? JSON.parse(profileData).user : null;
    const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

    const handleEventsClick = () => {
        const isClubPage = location.pathname.startsWith('/club/');
        if (isClubPage) {
            const clubId = location.pathname.split('/')[2];
            navigate(`/events/${clubId}`);
        } else {
            navigate('/events');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('profile');
        localStorage.removeItem('token');
        navigate('/auth');
    };

    return (
        /* 1. Updated background and border to use CSS variables */
        <nav className="relative bg-[var(--bg-color)] opacity-95 backdrop-blur-xl border-b border-slate-700/20 px-6 md:px-16 py-5 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            
            {/* Logo Section */}
            <Link to="/" className="group relative flex items-center gap-3 z-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-sm font-black italic transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-blue-600/20">
                        <span className="relative z-10">CH</span>
                    </div>
                </div>
                <div className="flex flex-col leading-none">
                    {/* 2. Updated text color variable */}
                    <span className="text-xl font-black text-[var(--text-color)] tracking-tighter">
                        CLUB<span className="text-blue-600">HUB</span>
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.35em] font-bold text-slate-500">Campus Connect</span>
                </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-4 md:gap-10 relative z-10">
                <div className="hidden md:flex items-center gap-8">
                    {/* 3. Theme Toggle Button */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all border border-slate-700/30 text-xl"
                        title="Toggle Dark/Light Mode"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    <Link 
                        to="/home" 
                        className={`relative text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${location.pathname === '/home' ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
                    >
                        Explore
                    </Link>
                    
                    <button 
                        onClick={handleEventsClick} 
                        className={`relative text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${location.pathname.startsWith('/events') ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
                    >
                        Events
                    </button>

                    {isAdmin && (
                        <Link 
                            to="/admin-dashboard" 
                            className={`relative text-[11px] font-black uppercase tracking-widest transition-all duration-300 px-3 py-1.5 rounded-lg border border-blue-500/20 ${location.pathname === '/admin-dashboard' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-600/5'}`}
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                {user ? (
                    <div className="flex items-center gap-4 border-l border-slate-700/50 pl-6">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-[10px] font-bold text-[var(--text-color)] leading-none">{user.name}</span>
                            <span className="text-[9px] font-medium text-slate-500 uppercase tracking-tighter mt-1">{isAdmin ? 'Administrator' : 'Student'}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="bg-blue-600 text-white text-[10px] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/10 active:scale-95"
                        >
                            LOGOUT
                        </button>
                    </div>
                ) : (
                    <Link to="/auth" className="bg-blue-600 text-white text-[10px] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                        LOGIN
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;