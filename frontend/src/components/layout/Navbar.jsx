import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import useAuth from '../../hooks/useAuth';
import API from '../../api';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, isAdmin, isPresident, isLoggedIn, role, logout } = useAuth();

    const [showProfile, setShowProfile] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    const profileRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
                setShowPasswordForm(false);
                setPasswordMsg({ text: '', type: '' });
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

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
        setShowProfile(false);
        logout();
        navigate('/auth');
    };

    const getRoleLabel = () => {
        if (isAdmin) return 'Administrator';
        if (isPresident) return 'President';
        return 'Student';
    };

    const getRoleColor = () => {
        if (isAdmin) return '#ef4444';
        if (isPresident) return '#3b82f6';
        return '#22c55e';
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMsg({ text: '', type: '' });

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordMsg({ text: 'New passwords do not match', type: 'error' });
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordMsg({ text: 'Password must be at least 6 characters', type: 'error' });
            return;
        }

        setChangingPassword(true);
        try {
            await API.put('/auth/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordMsg({ text: '✅ Password changed successfully!', type: 'success' });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setShowPasswordForm(false);
                setPasswordMsg({ text: '', type: '' });
            }, 2000);
        } catch (err) {
            setPasswordMsg({ text: err.response?.data?.message || 'Failed to change password', type: 'error' });
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <nav className="relative bg-[var(--bg-color)] opacity-95 backdrop-blur-xl border-b border-slate-700/20 px-6 md:px-16 py-5 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            {/* Logo */}
            <Link to="/" className="group relative flex items-center gap-3 z-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="relative w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-sm font-black italic transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-blue-600/20">
                        <span className="relative z-10">CH</span>
                    </div>
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-xl font-black text-[var(--text-color)] tracking-tighter">
                        CLUB<span className="text-blue-600">HUB</span>
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.35em] font-bold text-slate-500">Campus Connect</span>
                </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4 md:gap-10 relative z-10">
                <div className="hidden md:flex items-center gap-8">
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-lg transition-all border text-xl ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/30' : 'bg-slate-200/80 hover:bg-slate-300/80 border-slate-300/50'}`}
                        title="Toggle Dark/Light Mode"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {!isAdmin && (
                        <Link
                            to="/home"
                            className={`relative text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${location.pathname === '/home' ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
                        >
                            Explore
                        </Link>
                    )}

                    {!isAdmin && (
                        <button
                            onClick={handleEventsClick}
                            className={`relative text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${location.pathname.startsWith('/events') ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
                        >
                            Events
                        </button>
                    )}

                    {isAdmin && (
                        <Link
                            to="/admin-dashboard"
                            className={`relative text-[11px] font-black uppercase tracking-widest transition-all duration-300 px-3 py-1.5 rounded-lg border border-blue-500/20 ${location.pathname === '/admin-dashboard' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-600/5'}`}
                        >
                            Dashboard
                        </Link>
                    )}

                    {isPresident && (
                        <Link
                            to="/president-dashboard"
                            className={`relative text-[11px] font-black uppercase tracking-widest transition-all duration-300 px-3 py-1.5 rounded-lg border border-blue-500/20 ${location.pathname === '/president-dashboard' ? 'bg-blue-600/10 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-600/5'}`}
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                {isLoggedIn ? (
                    <div className="flex items-center gap-4 border-l border-slate-700/50 pl-6" ref={profileRef}>
                        {/* Clickable User Info */}
                        <button
                            onClick={() => { setShowProfile(!showProfile); setShowPasswordForm(false); setPasswordMsg({ text: '', type: '' }); }}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${getRoleColor()}, ${getRoleColor()}cc)` }}>
                                {user?.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex flex-col items-start hidden sm:flex">
                                <span className="text-[11px] font-bold text-[var(--text-color)] leading-none group-hover:text-blue-500 transition-colors">{user?.name}</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color: getRoleColor() }}>
                                    {getRoleLabel()}
                                </span>
                            </div>
                            <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Profile Dropdown */}
                        {showProfile && (
                            <div className={`absolute top-full right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden z-50 border ${theme === 'dark' ? 'bg-[#1a1d27] border-slate-700/50' : 'bg-white border-slate-200'}`}
                                style={{ animation: 'fadeSlideDown 0.2s ease-out' }}
                            >
                                {/* User Info Header */}
                                <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-black text-xl border-2 border-white/30">
                                            {user?.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{user?.name}</p>
                                            <p className="text-xs text-blue-100 mt-0.5">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-[10px] font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wider">
                                            {getRoleLabel()}
                                        </span>
                                        {user?.managedClub && (
                                            <span className="text-[10px] font-semibold bg-white/10 px-3 py-1 rounded-full">
                                                {typeof user.managedClub === 'object' ? user.managedClub.name : 'Club Manager'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Info Fields */}
                                <div className="p-4 space-y-3">
                                    <div className={`flex items-center gap-3 text-sm p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                        <span className="text-lg">📧</span>
                                        <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Email</p>
                                            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-3 text-sm p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                        <span className="text-lg">🛡️</span>
                                        <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Role</p>
                                            <p className="text-xs font-bold" style={{ color: getRoleColor() }}>{getRoleLabel()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Change Password Section */}
                                <div className={`px-4 pb-4 ${theme === 'dark' ? 'border-t border-slate-700/50' : 'border-t border-slate-100'} pt-3`}>
                                    {!showPasswordForm ? (
                                        <button
                                            onClick={() => setShowPasswordForm(true)}
                                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${theme === 'dark' ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                        >
                                            🔒 Change Password
                                        </button>
                                    ) : (
                                        <form onSubmit={handlePasswordChange} className="space-y-3">
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                className={`w-full px-3 py-2.5 rounded-lg text-xs outline-none border transition-colors ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-700 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500'}`}
                                                required
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                className={`w-full px-3 py-2.5 rounded-lg text-xs outline-none border transition-colors ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-700 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500'}`}
                                                required
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                className={`w-full px-3 py-2.5 rounded-lg text-xs outline-none border transition-colors ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-700 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500'}`}
                                                required
                                            />
                                            {passwordMsg.text && (
                                                <p className={`text-[11px] font-semibold ${passwordMsg.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                                    {passwordMsg.text}
                                                </p>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={changingPassword}
                                                    className="flex-1 bg-blue-600 text-white text-[11px] font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                                                >
                                                    {changingPassword ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowPasswordForm(false); setPasswordMsg({ text: '', type: '' }); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                                                    className={`px-4 text-[11px] font-bold py-2.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                {/* Logout */}
                                <div className={`px-4 pb-4 ${theme === 'dark' ? '' : ''}`}>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-3 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/auth" className="bg-blue-600 text-white text-[10px] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                        LOGIN
                    </Link>
                )}
            </div>

            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
