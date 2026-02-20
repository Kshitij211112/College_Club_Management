import React, { useEffect, useState } from 'react';
import API from '../../api';

const OverviewSection = ({ club, onNavigate }) => {
    const [stats, setStats] = useState({ members: 0, events: 0, positions: 0, followers: 0 });
    const [recentEvents, setRecentEvents] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        if (!club?._id) return;
        loadStats();
    }, [club]);

    const loadStats = async () => {
        try {
            const [eventsRes, positionsRes, postsRes] = await Promise.all([
                API.get(`/events?clubId=${club._id}`),
                API.get(`/recruitment?clubId=${club._id}`),
                API.get(`/posts?clubId=${club._id}&limit=5`)
            ]);
            const events = eventsRes.data.data || eventsRes.data || [];
            const positions = positionsRes.data.data || [];
            const posts = postsRes.data.data || [];
            const openPositions = positions.filter(p => p.status === 'open');

            setStats({
                members: club.members?.length || 0,
                events: Array.isArray(events) ? events.length : 0,
                positions: openPositions.length,
                followers: 0
            });
            setRecentEvents(Array.isArray(events) ? events.slice(0, 4) : []);
            setRecentPosts(posts.slice(0, 4));
        } catch (err) {
            console.error('Error loading overview:', err);
        }
    };

    const statCards = [
        { label: 'Total Members', value: stats.members, icon: '👥', color: 'from-blue-500 to-blue-600' },
        { label: 'Total Events', value: stats.events, icon: '📅', color: 'from-emerald-500 to-emerald-600' },
        { label: 'Active Positions', value: stats.positions, icon: '💼', color: 'from-amber-500 to-amber-600' },
        { label: 'Followers', value: stats.followers, icon: '❤️', color: 'from-rose-500 to-rose-600' },
    ];

    const quickActions = [
        { label: 'Create Event', icon: '📅', section: 'events', color: 'bg-blue-600 hover:bg-blue-700' },
        { label: 'Create Post', icon: '✏️', section: 'posts', color: 'bg-emerald-600 hover:bg-emerald-700' },
        { label: 'Open Position', icon: '💼', section: 'recruitment', color: 'bg-amber-600 hover:bg-amber-700' },
    ];

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">{card.icon}</span>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        </div>
                        <p className="text-3xl font-black text-slate-900">{card.value}</p>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    {quickActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => onNavigate(action.section)}
                            className={`${action.color} text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md`}
                        >
                            <span>{action.icon}</span> {action.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Events */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Events</h3>
                        <button onClick={() => onNavigate('events')} className="text-xs text-blue-600 font-bold hover:underline">View All</button>
                    </div>
                    {recentEvents.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-8">No events yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentEvents.map(event => (
                                <div key={event._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                                        {new Date(event.date).getDate()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{event.title}</p>
                                        <p className="text-xs text-slate-400">{event.venue} · {event.time}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto flex-shrink-0 ${event.status === 'Upcoming' ? 'bg-green-100 text-green-700' : event.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Posts */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Posts</h3>
                        <button onClick={() => onNavigate('posts')} className="text-xs text-blue-600 font-bold hover:underline">View All</button>
                    </div>
                    {recentPosts.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-8">No posts yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentPosts.map(post => (
                                <div key={post._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-lg flex-shrink-0">✏️</div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{post.title}</p>
                                        <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-xs text-slate-400 ml-auto flex-shrink-0">❤️ {post.likes}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
