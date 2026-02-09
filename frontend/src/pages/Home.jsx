import React, { useState, useEffect } from 'react';
import { fetchClubs, joinClub } from '../api';
import ClubCard from '../components/ClubCard';
import HomeHero from '../components/HomeHero';

const Home = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthData = () => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile) return { token: profile.token, userId: profile.user?._id || profile._id };
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    return (token && user) ? { token, userId: user._id || user.id } : null;
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      const res = await fetchClubs();
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
      const res = await joinClub(clubId);
      alert(res.data.message || "Welcome! 🎉");
      loadClubs(); 
    } catch (err) {
      alert(err.response?.data?.message || "Join failed.");
    }
  };

  if (loading) return (
    /* Updated Loading Screen with Theme Background */
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-color)] transition-colors duration-300">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const auth = getAuthData();

  return (
    /* MAIN CHANGE: Changed bg-[#FAFAFA] to var(--bg-color) 
       Added transition-colors for a smooth dark/light switch
    */
    <div className="p-6 md:p-12 bg-[var(--bg-color)] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <HomeHero />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {clubs.map((club) => (
            <ClubCard 
              key={club._id}
              club={club}
              isMember={auth?.userId && club.members?.includes(auth.userId)}
              onJoin={handleJoin}
            />
          ))}
        </div>

        {!loading && clubs.length === 0 && (
          /* Updated empty state text to use theme variable */
          <div className="text-center py-40 text-[var(--text-color)] opacity-20 font-bold uppercase tracking-[0.3em]">
            No clubs found yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;