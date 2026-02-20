import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import useAuth from '../../hooks/useAuth';
import API from '../../api';

import OverviewSection from '../../components/president/OverviewSection';
import MembersSection from '../../components/president/MembersSection';
import TeamsSection from '../../components/president/TeamsSection';
import EventsSection from '../../components/president/EventsSection';
import PostsSection from '../../components/president/PostsSection';
import RecruitmentSection from '../../components/president/RecruitmentSection';
import AnalyticsSection from '../../components/president/AnalyticsSection';

const PresidentDashboard = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, logout } = useAuth();
    const [club, setClub] = useState(null);
    const [section, setSection] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        loadClub();
    }, []);

    const loadClub = async () => {
        try {
            const clubId = user?.managedClub?._id || user?.managedClub;
            if (!clubId) { setLoading(false); return; }
            const res = await API.get(`/clubs/${clubId}`);
            setClub(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to load club:', err);
        } finally { setLoading(false); }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'members', label: 'Members', icon: '👥' },
        { id: 'teams', label: 'Teams', icon: '🏠' },
        { id: 'events', label: 'Events', icon: '📅' },
        { id: 'posts', label: 'Posts', icon: '✏️' },
        { id: 'recruitment', label: 'Recruitment', icon: '💼' },
        { id: 'analytics', label: 'Analytics', icon: '📈' },
    ];

    const renderSection = () => {
        switch (section) {
            case 'overview': return <OverviewSection club={club} onNavigate={setSection} />;
            case 'members': return <MembersSection club={club} onClubUpdate={loadClub} />;
            case 'teams': return <TeamsSection club={club} />;
            case 'events': return <EventsSection club={club} />;
            case 'posts': return <PostsSection club={club} />;
            case 'recruitment': return <RecruitmentSection club={club} />;
            case 'analytics': return <AnalyticsSection club={club} />;
            default: return <OverviewSection club={club} onNavigate={setSection} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-slate-500 font-semibold">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl p-10 shadow-sm border border-slate-100 max-w-md">
                    <span className="text-5xl mb-4 block">🏫</span>
                    <h2 className="text-2xl font-black text-slate-900">No Club Assigned</h2>
                    <p className="text-sm text-slate-400 mt-2">You don't manage any club yet. Contact the administrator.</p>
                    <button onClick={() => navigate('/home')} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">Go Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-100 flex flex-col transition-all duration-300 fixed h-full z-40`}>
                {/* Logo */}
                <div className="p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {club.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        {sidebarOpen && (
                            <div className="min-w-0">
                                <h2 className="text-sm font-black text-slate-900 truncate">{club.name}</h2>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">President Panel</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setSection(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                section === item.id
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <span className="text-lg flex-shrink-0">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t border-slate-100">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all"
                    >
                        <span className="text-lg flex-shrink-0">{sidebarOpen ? '◀' : '▶'}</span>
                        {sidebarOpen && <span>Collapse</span>}
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all"
                    >
                        <span className="text-lg flex-shrink-0">🏠</span>
                        {sidebarOpen && <span>Back to Site</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                {/* Top Bar */}
                <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 capitalize">{section}</h1>
                        <p className="text-xs text-slate-400 mt-0.5">{club.name} Dashboard</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-base"
                            title="Toggle theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        {/* Notification icon */}
                        <button className="relative p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-base">
                            🔔
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">3</span>
                        </button>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                    {user?.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{user?.name}</p>
                                    <p className="text-[10px] text-blue-500 font-bold">President</p>
                                </div>
                                <svg className={`w-3 h-3 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50" style={{ animation: 'fadeSlideDown 0.15s ease-out' }}>
                                    <div className="p-4 border-b border-slate-100">
                                        <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                                        <p className="text-xs text-slate-400">{user?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <button onClick={() => { navigate('/home'); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-all">🏠 Back to Site</button>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all">🚪 Logout</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-8">
                    {renderSection()}
                </main>
            </div>

            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default PresidentDashboard;
