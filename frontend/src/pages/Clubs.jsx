import React, { useState, useEffect } from 'react';
import API from '../api'; // Use centralized API instance

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthData = () => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile) {
      const token = profile.token;
      const userId = profile.user?._id || profile._id;
      if (token && userId) return { token, userId };
    }
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) return { token, userId: user._id || user.id };
    return token ? { token, userId: null } : null;
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await API.get('/clubs');
      setClubs(res.data);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (clubId) => {
    const auth = getAuthData();
    if (!auth?.token) return alert("Please login first");

    try {
      const res = await API.post(`/clubs/${clubId}/join`);
      alert(res.data.message || "Successfully joined!");
      fetchClubs(); // Refresh to show updated state
    } catch (err) {
      alert(err.response?.data?.message || "Error joining club");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Explore Communities
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Join the most active clubs on campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club) => {
            const auth = getAuthData();
            const isMember = auth?.userId && club.members?.includes(auth.userId);

            return (
              <div 
                key={club._id} 
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
                    {club.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">
                    {club.category || 'General'}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  {club.name}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                  {club.description}
                </p>

                {isMember ? (
                  <button disabled className="w-full bg-emerald-50 text-emerald-600 font-bold py-4 rounded-2xl border border-emerald-100 cursor-default">
                    Joined ✓
                  </button>
                ) : (
                  <button 
                    onClick={() => handleJoin(club._id)}
                    className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                  >
                    Join Community
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Clubs;