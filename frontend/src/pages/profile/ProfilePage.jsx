import React, { useState, useEffect } from 'react';
import API from '../../api';
import useAuth from '../../hooks/useAuth';
import { Spinner } from '../../components/ui';

const ProfilePage = () => {
    const { user } = useAuth();
    const [clubs, setClubs] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [clubsRes, postsRes] = await Promise.all([
                    API.get(`/users/${user?._id}/clubs`),
                    API.get(`/posts/user/${user?._id}`),
                ]);
                setClubs(clubsRes.data || []);
                setPosts(postsRes.data || []);
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) fetchProfileData();
    }, [user]);

    if (loading) return <Spinner label="Loading profile..." />;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] p-6 md:p-12 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-[var(--card-bg)] border border-slate-700/20 rounded-3xl p-10 mb-10 shadow-xl">
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-lg shadow-blue-600/20">
                            {user?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-[var(--text-color)]">{user?.name}</h1>
                            <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
                            <span className="mt-2 inline-block text-[10px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">
                                {user?.role || 'Student'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Clubs Section */}
                <div className="mb-10">
                    <h2 className="text-xl font-black text-[var(--text-color)] mb-6 uppercase tracking-wider text-xs">
                        My Clubs ({clubs.length})
                    </h2>
                    {clubs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {clubs.map(club => (
                                <div key={club._id} className="bg-[var(--card-bg)] border border-slate-700/20 rounded-2xl p-6 shadow-md">
                                    <h3 className="text-lg font-bold text-[var(--text-color)]">{club.name}</h3>
                                    <p className="text-slate-400 text-sm mt-1">{club.description?.substring(0, 100)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">You haven't joined any clubs yet.</p>
                    )}
                </div>

                {/* Posts Section */}
                <div>
                    <h2 className="text-xl font-black text-[var(--text-color)] mb-6 uppercase tracking-wider text-xs">
                        My Posts ({posts.length})
                    </h2>
                    {posts.length > 0 ? (
                        <div className="space-y-4">
                            {posts.map(post => (
                                <div key={post._id} className="bg-[var(--card-bg)] border border-slate-700/20 rounded-2xl p-6 shadow-md">
                                    <h3 className="text-lg font-bold text-[var(--text-color)]">{post.title}</h3>
                                    <p className="text-slate-400 text-sm mt-2">{post.content?.substring(0, 150)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">No posts yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
