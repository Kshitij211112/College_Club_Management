import React, { useEffect, useState } from 'react';
import API from '../../api';

const TeamsSection = ({ club }) => {
    const [teams, setTeams] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ name: 'Technical', description: '' });
    const [addMemberForm, setAddMemberForm] = useState({ teamId: null, email: '' });
    const [loading, setLoading] = useState(false);

    const teamNames = ['Photography', 'Videography', 'Technical', 'Non-Technical', 'Volunteers', 'Design', 'Content', 'Marketing', 'Social Media', 'Event Management'];

    useEffect(() => {
        if (club?._id) loadTeams();
    }, [club]);

    const loadTeams = async () => {
        try {
            const res = await API.get(`/clubs/${club._id}/teams`);
            setTeams(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post(`/clubs/${club._id}/teams`, form);
            setShowCreate(false);
            setForm({ name: 'Technical', description: '' });
            loadTeams();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create team');
        } finally { setLoading(false); }
    };

    const handleDelete = async (teamId) => {
        if (!window.confirm('Delete this team?')) return;
        try {
            await API.delete(`/clubs/${club._id}/teams/${teamId}`);
            loadTeams();
        } catch (err) { alert('Failed to delete team'); }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            // Find user by email first
            const usersRes = await API.get('/auth/me');
            // For simplicity, we need userId — president can enter userId or we search
            await API.post(`/clubs/${club._id}/teams/${addMemberForm.teamId}/members`, {
                userId: addMemberForm.email // This should be a user ID
            });
            setAddMemberForm({ teamId: null, email: '' });
            loadTeams();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add member');
        }
    };

    const handleRemoveMember = async (teamId, memberId) => {
        try {
            await API.delete(`/clubs/${club._id}/teams/${teamId}/members/${memberId}`);
            loadTeams();
        } catch (err) { alert('Failed to remove member'); }
    };

    const handleRoleChange = async (teamId, memberId, role) => {
        try {
            await API.put(`/clubs/${club._id}/teams/${teamId}/members/${memberId}`, { role });
            loadTeams();
        } catch (err) { alert('Failed to update role'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Teams</h2>
                    <p className="text-sm text-slate-400 mt-1">{teams.length} teams</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                    <span className="text-lg">+</span> Create Team
                </button>
            </div>

            {/* Create Team Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreate(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-black text-slate-900 mb-5">Create Team</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Team Name</label>
                                <select value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500">
                                    {teamNames.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 h-24 resize-none" placeholder="Team description..." />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creating...' : 'Create Team'}</button>
                                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Teams Grid */}
            {teams.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <span className="text-4xl mb-4 block">👥</span>
                    <h3 className="text-lg font-bold text-slate-900">No teams yet</h3>
                    <p className="text-sm text-slate-400 mt-1">Create your first team to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {teams.map(team => (
                        <div key={team._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                            <div className="p-5 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">{team.name}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">{team.members?.length || 0} members</p>
                                    </div>
                                    <button onClick={() => handleDelete(team._id)} className="text-red-500 bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">Delete</button>
                                </div>
                                {team.description && <p className="text-sm text-slate-500 mt-2">{team.description}</p>}
                            </div>
                            <div className="p-5">
                                {team.members?.length === 0 ? (
                                    <p className="text-xs text-slate-400 text-center py-4">No members in this team</p>
                                ) : (
                                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                        {team.members?.map(member => (
                                            <div key={member._id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                                                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                                                    {(member.user?.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-semibold text-slate-700 truncate">{member.user?.name || 'Unknown'}</p>
                                                </div>
                                                <select
                                                    value={member.role}
                                                    onChange={(e) => handleRoleChange(team._id, member.user?._id, e.target.value)}
                                                    className="text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-200 outline-none bg-white"
                                                >
                                                    <option value="member">Member</option>
                                                    <option value="lead">Lead</option>
                                                    <option value="co-lead">Co-Lead</option>
                                                </select>
                                                <button onClick={() => handleRemoveMember(team._id, member.user?._id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {addMemberForm.teamId === team._id ? (
                                    <form onSubmit={handleAddMember} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="User ID"
                                            value={addMemberForm.email}
                                            onChange={e => setAddMemberForm({ ...addMemberForm, email: e.target.value })}
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                                            required
                                        />
                                        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold">Add</button>
                                        <button type="button" onClick={() => setAddMemberForm({ teamId: null, email: '' })} className="text-slate-400 text-xs">✕</button>
                                    </form>
                                ) : (
                                    <button onClick={() => setAddMemberForm({ teamId: team._id, email: '' })} className="w-full text-center bg-slate-50 text-slate-500 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-all">+ Add Member</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeamsSection;
