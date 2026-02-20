import React, { useEffect, useState } from 'react';
import API from '../../api';

const AnalyticsSection = ({ club }) => {
    const [data, setData] = useState({ members: 0, events: [], posts: [], positions: [] });

    useEffect(() => {
        if (club?._id) loadData();
    }, [club]);

    const loadData = async () => {
        try {
            const [eventsRes, postsRes, positionsRes] = await Promise.all([
                API.get(`/events?clubId=${club._id}`),
                API.get(`/posts?clubId=${club._id}`),
                API.get(`/recruitment?clubId=${club._id}`)
            ]);
            setData({
                members: club.members?.length || 0,
                events: eventsRes.data.data || eventsRes.data || [],
                posts: postsRes.data.data || [],
                positions: positionsRes.data.data || []
            });
        } catch (err) { console.error(err); }
    };

    const events = Array.isArray(data.events) ? data.events : [];
    const upcomingEvents = events.filter(e => e.status === 'Upcoming').length;
    const completedEvents = events.filter(e => e.status === 'Completed').length;
    const totalRegistrations = events.reduce((sum, e) => sum + (e.registrations || e.registeredUsers?.length || 0), 0);
    const totalLikes = data.posts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalApps = data.positions.reduce((sum, p) => sum + (p.applications?.length || 0), 0);
    const acceptedApps = data.positions.reduce((sum, p) => sum + (p.applications?.filter(a => a.status === 'accepted').length || 0), 0);

    const metrics = [
        { label: 'Total Members', value: data.members, icon: '👥', bg: 'from-blue-500 to-blue-600' },
        { label: 'Upcoming Events', value: upcomingEvents, icon: '📅', bg: 'from-emerald-500 to-emerald-600' },
        { label: 'Completed Events', value: completedEvents, icon: '✅', bg: 'from-cyan-500 to-cyan-600' },
        { label: 'Total Registrations', value: totalRegistrations, icon: '🎫', bg: 'from-violet-500 to-violet-600' },
        { label: 'Total Posts', value: data.posts.length, icon: '✏️', bg: 'from-indigo-500 to-indigo-600' },
        { label: 'Total Likes', value: totalLikes, icon: '❤️', bg: 'from-rose-500 to-rose-600' },
        { label: 'Open Positions', value: data.positions.filter(p => p.status === 'open').length, icon: '💼', bg: 'from-amber-500 to-amber-600' },
        { label: 'Applications', value: totalApps, icon: '📝', bg: 'from-orange-500 to-orange-600' },
    ];

    // Simple bar chart for event category breakdown
    const categoryCount = {};
    events.forEach(e => { categoryCount[e.category || 'Other'] = (categoryCount[e.category || 'Other'] || 0) + 1; });
    const maxCat = Math.max(...Object.values(categoryCount), 1);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Analytics</h2>
                <p className="text-sm text-slate-400">Club performance overview</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all group">
                        <span className="text-2xl mb-3 block">{m.icon}</span>
                        <p className="text-2xl font-black text-slate-900">{m.value}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{m.label}</p>
                    </div>
                ))}
            </div>

            {/* Event Category Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">Events by Category</h3>
                {Object.keys(categoryCount).length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">No event data yet</p>
                ) : (
                    <div className="space-y-3">
                        {Object.entries(categoryCount).map(([cat, count]) => (
                            <div key={cat} className="flex items-center gap-4">
                                <span className="text-xs font-semibold text-slate-600 w-28 text-right">{cat}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                                        style={{ width: `${Math.max((count / maxCat) * 100, 10)}%` }}
                                    >
                                        <span className="text-[10px] font-bold text-white">{count}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recruitment Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Recruitment Overview</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Total Applications</span>
                            <span className="text-lg font-black text-slate-900">{totalApps}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Accepted</span>
                            <span className="text-lg font-black text-green-600">{acceptedApps}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Acceptance Rate</span>
                            <span className="text-lg font-black text-blue-600">{totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0}%</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Post Engagement</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Total Posts</span>
                            <span className="text-lg font-black text-slate-900">{data.posts.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Total Likes</span>
                            <span className="text-lg font-black text-rose-500">{totalLikes}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Avg. Likes/Post</span>
                            <span className="text-lg font-black text-blue-600">{data.posts.length > 0 ? Math.round(totalLikes / data.posts.length) : 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;
