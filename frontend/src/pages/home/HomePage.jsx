import React, { useState, useEffect } from 'react';
import * as clubService from '../../services/clubService';
import useAuth from '../../hooks/useAuth';
import ClubCard from '../../components/common/ClubCard';
import HomeHero from '../../components/common/HomeHero';
import { Spinner } from '../../components/ui';

const HomePage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();

    useEffect(() => {
        loadClubs();
    }, []);

    const loadClubs = async () => {
        try {
            const res = await clubService.getAll();
            setClubs(res.data);
        } catch (err) {
            console.error("Fetch Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (clubId) => {
        try {
            const res = await clubService.join(clubId);
            alert(res.data.message || "Welcome! 🎉");
            loadClubs();
        } catch (err) {
            alert(err.response?.data?.message || "Join failed.");
        }
    };

    if (loading) return <Spinner label="Loading clubs..." />;

    return (
        <div className="p-6 md:p-12 bg-[var(--bg-color)] min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <HomeHero />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {clubs.map((club) => (
                        <ClubCard
                            key={club._id}
                            club={club}
                            isMember={userId && club.members?.includes(userId)}
                            onJoin={handleJoin}
                        />
                    ))}
                </div>

                {!loading && clubs.length === 0 && (
                    <div className="text-center py-40 text-[var(--text-color)] opacity-20 font-bold uppercase tracking-[0.3em]">
                        No clubs found yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
