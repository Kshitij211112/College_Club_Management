import React, { useState } from 'react';
import API from '../../api';

const MembersSection = ({ club, onClubUpdate }) => {
    const [search, setSearch] = useState('');
    const members = club?.members || [];

    const filtered = members.filter(m => {
        const name = m.name || m.email || '';
        return name.toLowerCase().includes(search.toLowerCase());
    });

    const handleRemove = async (userId) => {
        if (!window.confirm('Remove this member from the club?')) return;
        try {
            // Remove from club members array
            await API.put(`/clubs/${club._id}`, {
                members: club.members.filter(m => (m._id || m) !== userId).map(m => m._id || m)
            });
            onClubUpdate();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove member');
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Members</h2>
                    <p className="text-sm text-slate-400 mt-1">{members.length} total members</p>
                </div>
                <input
                    type="text"
                    placeholder="Search members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-72 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Member</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-sm">No members found</td></tr>
                        ) : filtered.map((member, i) => {
                            const name = member.name || 'Unknown';
                            const email = member.email || '';
                            const id = member._id || member;
                            const isPresident = club.president === id || club.president?._id === id;
                            return (
                                <tr key={id || i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{name.charAt(0).toUpperCase()}</div>
                                            <span className="text-sm font-semibold text-slate-800">{name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isPresident ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {isPresident ? 'President' : 'Member'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!isPresident && (
                                            <button onClick={() => handleRemove(id)} className="text-red-500 bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MembersSection;
