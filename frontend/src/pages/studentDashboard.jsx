import React, { useState, useEffect } from 'react';
import API from '../api';

const StudentDashboard = () => {
    const [myClubs, setMyClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Get user name from local storage for the greeting
    const profile = JSON.parse(localStorage.getItem('profile'));
    const userName = profile?.user?.name || 'Explorer';

    useEffect(() => {
        const fetchMyClubs = async () => {
            try {
                // This endpoint should return club objects including president and vicePresident strings
                const res = await API.get('/clubs/my-clubs');
                setMyClubs(res.data);
            } catch (err) {
                console.error("Error loading clubs:", err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMyClubs();
    }, []);

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-white">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing your clubs...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* PERSONALIZED HERO SECTION */}
            <header className="bg-slate-900 pt-20 pb-32 px-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <p className="text-blue-400 font-black uppercase tracking-[0.2em] text-xs mb-3">Student Portal</p>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">
                        Welcome back, <span className="text-blue-500">{userName}</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl font-medium">
                        You are currently an active member of <span className="text-white">{myClubs.length} campus organizations</span>.
                    </p>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-6xl mx-auto px-8 -mt-16 pb-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">Your Memberships</h2>
                    <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                </div>

                {myClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myClubs.map(club => (
                            <div key={club._id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                        {club.name.charAt(0)}
                                    </div>
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">
                                        {club.category}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic tracking-tight group-hover:text-blue-600 transition-colors">
                                    {club.name}
                                </h3>
                                
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                    {club.description}
                                </p>

                                {/* LEADERSHIP SECTION ADDED HERE */}
                                <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Club Leadership</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-medium">President:</span>
                                            <span className="text-slate-900 font-bold">{club.president}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-medium">Vice Pres:</span>
                                            <span className="text-slate-900 font-bold">{club.vicePresident || "Not Assigned"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">
                                        Dashboard →
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Active</span>
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-2">The journey starts here</h3>
                        <p className="text-slate-400 mb-8 max-w-xs mx-auto font-medium">You haven't joined any clubs yet. Explore the campus directory to find your fit.</p>
                        <button 
                            onClick={() => window.location.href = '/explore'} 
                            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                        >
                            Explore All Clubs
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;