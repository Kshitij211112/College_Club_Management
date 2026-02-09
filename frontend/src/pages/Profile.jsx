import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get the basic profile from localStorage
    const profile = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        const fetchUserData = async () => {
            if (!profile?.user?._id) return;
            try {
                // 1. Fetch full user details (including joinedClubs)
                const userRes = await axios.get(`http://localhost:5000/api/users/${profile.user._id}`);
                setUserData(userRes.data);

                // 2. Fetch posts authored by this user
                const postsRes = await axios.get(`http://localhost:5000/api/posts/user/${profile.user._id}`);
                setUserPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
                
            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (!profile) return <div className="p-10 text-center">Please login to view your profile.</div>;
    if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header / Personal Info */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border flex items-center gap-6">
                <div className="h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {userData?.name?.charAt(0) || profile.user.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{userData?.name || profile.user.name}</h1>
                    <p className="text-gray-500">{userData?.email || profile.user.email}</p>
                    <span className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        {userData?.role || profile.user.role}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Joined Clubs Section */}
                <div className="md:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">My Clubs</h2>
                    <div className="bg-white p-4 rounded-xl border space-y-3">
                        {userData?.joinedClubs?.length > 0 ? (
                            userData.joinedClubs.map(club => (
                                <div key={club._id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                    <span className="font-medium text-gray-700">{club.name}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">No clubs joined yet.</p>
                        )}
                    </div>
                </div>

                {/* User's Posts Section */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">My Activity</h2>
                    {userPosts.length > 0 ? (
                        userPosts.map(post => (
                            <div key={post._id} className="bg-white p-5 rounded-xl border shadow-sm hover:border-blue-300 transition mb-4">
                                <h3 className="font-bold text-lg">{post.title}</h3>
                                <p className="text-gray-600 mt-2 text-sm">{post.content}</p>
                                <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                                    <span>Posted in {post.clubName || 'General'}</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                            <p className="text-gray-500">You haven't posted anything yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;