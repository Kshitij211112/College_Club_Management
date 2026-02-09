import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClubById, joinClub } from '../api';

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserId = () => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    console.log('👤 Profile from localStorage:', profile); // DEBUG
    return profile?.user?._id || profile?._id;
  };

  const isPresident = () => {
    const userId = getUserId();
    const presidentId = club?.president?._id || club?.president;
    console.log('🔍 President Check:', {
      userId,
      presidentId,
      isMatch: userId === presidentId
    }); // DEBUG
    return userId === presidentId;
  };

  const loadDetails = useCallback(async () => {
    try {
      const res = await fetchClubById(id);
      console.log('🏛️ Club Data:', res.data); // DEBUG
      setClub(res.data);
    } catch (err) {
      console.error("Error loading club details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleJoinRequest = async () => {
    try {
      const res = await joinClub(id);
      alert(res.data.message || "Welcome to the club!");
      loadDetails(); 
    } catch (err) {
      alert(err.response?.data?.message || "Could not join club.");
    }
  };

  const handleManageTeams = () => {
    console.log('🚀 Navigating to teams page'); // DEBUG
    navigate(`/clubs/${id}/teams`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-slate-700/30 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium text-sm tracking-widest uppercase animate-pulse">Loading Experience</p>
      </div>
    </div>
  );

  if (!club) return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center text-center">
      <div>
        <h2 className="text-2xl font-black text-[var(--text-color)] mb-2">Club Not Found</h2>
        <button onClick={() => navigate('/')} className="text-blue-500 font-bold hover:underline">Return to Campus</button>
      </div>
    </div>
  );

  const userId = getUserId();
  const isMember = club.members?.includes(userId) || club.members?.some(m => m._id === userId || m === userId);
  const userIsPresident = isPresident();

  console.log('✅ Membership Check:', {
    userId,
    clubMembers: club.members,
    isMember,
    userIsPresident
  }); // DEBUG

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] selection:bg-blue-500/30 transition-colors duration-300">
      {/* Debug Panel - Remove after testing */}
      <div className="fixed top-20 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs z-50 max-w-xs">
        <p className="font-bold text-yellow-400 mb-2">🔍 Debug Info:</p>
        <p>User ID: {userId || 'NOT FOUND'}</p>
        <p>Is Member: {isMember ? '✅ YES' : '❌ NO'}</p>
        <p>Is President: {userIsPresident ? '👑 YES' : '❌ NO'}</p>
        <p>Members Count: {club.members?.length || 0}</p>
      </div>

      {/* Sleek Minimal Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-color)]/80 backdrop-blur-md border-b border-slate-700/20">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-slate-400 hover:text-[var(--text-color)] transition-all"
          >
            <div className="p-2 rounded-full group-hover:bg-slate-800/50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Back</span>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              {club.category}
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-8 space-y-12">
            <header className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] text-[var(--text-color)]">
                {club.name}
              </h1>
              <div className="h-1.5 w-24 bg-blue-600 rounded-full shadow-lg shadow-blue-600/20"></div>
            </header>

            <section>
              <p className="text-xl md:text-2xl text-[var(--text-color)] opacity-60 leading-relaxed font-medium">
                {club.description}
              </p>
            </section>

            {/* Visual Social Proof Section */}
            <section className="pt-10 border-t border-slate-700/20">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Current Community</h3>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-[var(--bg-color)] bg-slate-800 ring-1 ring-slate-700/50 shadow-sm overflow-hidden transition-transform hover:scale-110 hover:z-10">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${club.name + i}`} alt="member avatar" className="opacity-100" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-lg font-black text-[var(--text-color)] leading-tight">{club.members?.length || 0}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Members</p>
                </div>
              </div>
            </section>

            {/* Teams Section - THIS IS THE KEY SECTION */}
            {isMember && (
              <section className="pt-10 border-t border-slate-700/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Club Teams</h3>
                  {userIsPresident && (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                      President
                    </span>
                  )}
                </div>
                
                <div className="bg-[var(--card-bg)] rounded-2xl border border-slate-700/20 p-8 space-y-4 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-[var(--text-color)] text-sm mb-2">Team Management</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {userIsPresident 
                          ? "Organize your club into specialized teams like Photography, Technical, Events, and more." 
                          : "View all the different teams within this club and their members."}
                      </p>
                      <button 
                        onClick={handleManageTeams}
                        className="group flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-all"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {userIsPresident ? 'Manage Teams' : 'View Teams'}
                        </span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* If not a member, show message */}
            {!isMember && (
              <section className="pt-10 border-t border-slate-700/20">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center">
                  <p className="text-sm text-yellow-400 font-medium">
                    🔒 Join this club to access teams and exclusive content
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Right Side: Action Sidebar */}
          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-slate-700/30 p-10 shadow-2xl space-y-10 transition-colors">
              
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-slate-700/20">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Led By</span>
                  <span className="text-sm font-bold text-[var(--text-color)]">{club.presidentName || "Pending"}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Member Status</span>
                  <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg ${isMember ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800/50 text-slate-500'}`}>
                    {isMember ? 'Member' : 'Guest'}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                {isMember ? (
                  <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-black text-[var(--text-color)] uppercase text-xs tracking-[0.2em]">Verified Member</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">You have full access to club events, chats, and internal resources.</p>
                    </div>
                    
                    {/* Quick Actions for Members */}
                    <div className="space-y-3 pt-2">
                      <button 
                        onClick={handleManageTeams}
                        className="w-full py-4 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600/20 hover:border-blue-500/50 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        View Teams
                      </button>
                      
                      <button className="w-full py-4 bg-transparent border border-slate-700 text-[var(--text-color)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800/50 transition-all active:scale-95">
                        Open Dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleJoinRequest}
                    className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-95 shadow-xl shadow-blue-900/20"
                  >
                    Join Community
                  </button>
                )}
              </div>
            </div>
            
            <p className="mt-8 text-center text-[9px] font-bold text-slate-600 uppercase tracking-[0.4em]">
              Campus Connect • Version 1.0
            </p>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default ClubDetail;