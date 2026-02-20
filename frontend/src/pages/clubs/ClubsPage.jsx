import React, { useState, useEffect } from 'react';
import * as clubService from '../../services/clubService';
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../../components/ui';

const ClubsPage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
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
        if (!userId) return alert("Please login first");
        try {
            const res = await clubService.join(clubId);
            alert(res.data.message || "Successfully joined!");
            fetchClubs();
        } catch (err) {
            alert(err.response?.data?.message || "Error joining club");
        }
    };

    if (loading) return <Spinner label="Loading clubs..." />;

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
                        const isMember = userId && club.members?.includes(userId);
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

                                <h2 className="text-2xl font-bold text-slate-900 mb-3">{club.name}</h2>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">{club.description}</p>

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

export default ClubsPage;
