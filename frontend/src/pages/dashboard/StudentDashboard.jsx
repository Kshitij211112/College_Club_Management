import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as clubService from '../../services/clubService';
import useAuth from '../../hooks/useAuth';
import { Spinner, EmptyState } from '../../components/ui';

const StudentDashboard = () => {
    const [myClubs, setMyClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyClubs = async () => {
            try {
                const res = await clubService.getMyClubs();
                setMyClubs(res.data.data || res.data);
            } catch (err) {
                console.error("Fetch Error:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMyClubs();
    }, []);

    if (loading) return <Spinner label="Loading your clubs..." />;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] p-6 md:p-12 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <p className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-2">Dashboard</p>
                    <h1 className="text-5xl font-black text-[var(--text-color)] tracking-tight">
                        Welcome, {user?.name?.split(' ')[0] || 'Student'}
                    </h1>
                    <p className="text-slate-400 mt-3 font-medium">
                        Here's an overview of your club memberships.
                    </p>
                </div>

                {myClubs.length === 0 ? (
                    <EmptyState
                        icon="🏫"
                        title="No Memberships Yet"
                        description="Explore campus clubs and communities to get started."
                        actionLabel="Explore Clubs"
                        onAction={() => navigate('/home')}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myClubs.map((club) => (
                            <Link
                                key={club._id}
                                to={`/clubs/${club._id}`}
                                className="bg-[var(--card-bg)] border border-slate-700/20 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-6 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                                    {club.name?.charAt(0)}
                                </div>
                                <h3 className="text-xl font-black text-[var(--text-color)] mb-2">{club.name}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{club.description}</p>
                                <div className="flex items-center gap-2 mt-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <span>{club.members?.length || 0} members</span>
                                    <span>•</span>
                                    <span>{club.category || 'General'}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
