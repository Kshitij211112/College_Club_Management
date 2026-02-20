import React, { useEffect, useState } from 'react';
import API from '../../api';

const RecruitmentSection = ({ club }) => {
    const [positions, setPositions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewApps, setViewApps] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', team: 'General', deadline: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (club?._id) loadPositions();
    }, [club]);

    const loadPositions = async () => {
        try {
            const res = await API.get(`/recruitment?clubId=${club._id}`);
            setPositions(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/recruitment', { ...form, clubId: club._id });
            setShowModal(false);
            setForm({ title: '', description: '', team: 'General', deadline: '' });
            loadPositions();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create position');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this position?')) return;
        try {
            await API.delete(`/recruitment/${id}`);
            loadPositions();
        } catch (err) { alert('Failed to delete position'); }
    };

    const handleToggleStatus = async (pos) => {
        try {
            await API.put(`/recruitment/${pos._id}`, { status: pos.status === 'open' ? 'closed' : 'open' });
            loadPositions();
        } catch (err) { alert('Failed to update status'); }
    };

    const handleAppStatus = async (posId, appId, status) => {
        try {
            await API.put(`/recruitment/${posId}/applications/${appId}`, { status });
            loadPositions();
            // Refresh viewApps
            const updated = positions.find(p => p._id === posId);
            if (updated) setViewApps(updated);
        } catch (err) { alert('Failed to update application'); }
    };

    const daysLeft = (deadline) => {
        const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return 'Expired';
        if (diff === 0) return 'Last day';
        return `${diff} day${diff > 1 ? 's' : ''} left`;
    };

    const appStatusColor = (s) => {
        if (s === 'accepted') return 'bg-green-100 text-green-700';
        if (s === 'rejected') return 'bg-red-100 text-red-600';
        return 'bg-yellow-100 text-yellow-700';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Recruitment</h2>
                    <p className="text-sm text-slate-400 mt-1">{positions.length} positions</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                    <span className="text-lg">+</span> Open Position
                </button>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-black text-slate-900 mb-5">Open New Position</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Position Title" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" required />
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description & Requirements" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 h-24 resize-none" required />
                            <input value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} placeholder="Team (e.g., Technical)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" />
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Deadline</label>
                                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" required />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creating...' : 'Open Position'}</button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Applications Modal */}
            {viewApps && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewApps(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl font-black text-slate-900">Applications — {viewApps.title}</h3>
                            <button onClick={() => setViewApps(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
                        </div>
                        {viewApps.applications?.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-8">No applications yet</p>
                        ) : (
                            <div className="space-y-3">
                                {viewApps.applications.map(app => (
                                    <div key={app._id} className="border border-slate-100 rounded-xl p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{app.name}</p>
                                                <p className="text-xs text-slate-400">{app.email}</p>
                                                {app.message && <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">{app.message}</p>}
                                            </div>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${appStatusColor(app.status)}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </div>
                                        {app.status === 'pending' && (
                                            <div className="flex gap-2 mt-3">
                                                <button onClick={() => handleAppStatus(viewApps._id, app._id, 'accepted')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition-all">✓ Accept</button>
                                                <button onClick={() => handleAppStatus(viewApps._id, app._id, 'rejected')} className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition-all">✕ Reject</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Position Cards */}
            {positions.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <span className="text-4xl mb-4 block">💼</span>
                    <h3 className="text-lg font-bold text-slate-900">No open positions</h3>
                    <p className="text-sm text-slate-400 mt-1">Create a position to start recruiting</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {positions.map(pos => (
                        <div key={pos._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">{pos.title}</h3>
                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{pos.team}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${pos.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {pos.status === 'open' ? 'Open' : 'Closed'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{pos.description}</p>
                            <div className="flex items-center justify-between text-xs mb-4">
                                <span className={`font-bold ${new Date(pos.deadline) < new Date() ? 'text-red-500' : 'text-amber-600'}`}>⏰ {daysLeft(pos.deadline)}</span>
                                <span className="text-slate-400 font-semibold">👥 {pos.applications?.length || 0} applicants</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setViewApps(pos)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all">
                                    View Applications
                                </button>
                                <button onClick={() => handleToggleStatus(pos)} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${pos.status === 'open' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                    {pos.status === 'open' ? 'Close' : 'Reopen'}
                                </button>
                                <button onClick={() => handleDelete(pos._id)} className="px-3 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecruitmentSection;
