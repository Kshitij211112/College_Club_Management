import React, { useState, useRef, useCallback } from 'react';

const CATEGORY_COLORS = {
    Technical: 'bg-blue-100 text-blue-700',
    Cultural: 'bg-purple-100 text-purple-700',
    Sports: 'bg-green-100 text-green-700',
    Arts: 'bg-pink-100 text-pink-700',
    Music: 'bg-yellow-100 text-yellow-800',
    Drama: 'bg-orange-100 text-orange-700',
    Other: 'bg-slate-100 text-slate-600'
};

const ClubDetailModal = ({ club, onClose, onDelete, onChangePresident }) => {
    const [showChangePresident, setShowChangePresident] = useState(false);
    const [presidentForm, setPresidentForm] = useState({ presidentName: '', presidentEmail: '' });
    const [changing, setChanging] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const scrollRef = useRef(null);

    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            setScrolled(scrollRef.current.scrollTop > 30);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setChanging(true);
        try {
            await onChangePresident(presidentForm);
            setPresidentForm({ presidentName: '', presidentEmail: '' });
            setShowChangePresident(false);
        } catch {
            // error handled by parent
        } finally { setChanging(false); }
    };

    if (!club) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">

                {/* Sticky Header - shrinks on scroll */}
                <div
                    className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 relative rounded-t-3xl flex-shrink-0 flex items-end transition-all duration-300 ease-in-out"
                    style={{ height: scrolled ? '64px' : '160px' }}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center text-white font-bold text-xl transition-all z-10">✕</button>
                    <div className={`absolute left-6 transition-all duration-300 ease-in-out ${scrolled ? 'bottom-3 flex items-center gap-3' : 'bottom-4'}`}>
                        <h2 className={`font-black text-white transition-all duration-300 ${scrolled ? 'text-lg' : 'text-3xl'}`}>{club.name}</h2>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block transition-all duration-300 ${CATEGORY_COLORS[club.category] || CATEGORY_COLORS.Other} ${scrolled ? 'mt-0' : 'mt-2'}`}>{club.category}</span>
                    </div>
                </div>

                {/* Scrollable content - hidden scrollbar */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 space-y-6"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style>{`
                        .flex-1.overflow-y-auto::-webkit-scrollbar { display: none; }
                    `}</style>
                    {/* Description */}
                    <div className="bg-gray-50 rounded-2xl p-4 border border-blue-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-slate-600 leading-relaxed">{club.description}</p>
                    </div>

                    {/* President Info */}
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">👤 Current President</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-black text-lg">
                                {club.president?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{club.president?.name || 'Unknown'}</p>
                                <p className="text-sm text-slate-500">{club.president?.email || 'No email'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Change President */}
                    {!showChangePresident ? (
                        <button onClick={() => setShowChangePresident(true)} className="w-full bg-amber-50 text-amber-700 border border-amber-200 font-bold py-3 rounded-xl hover:bg-amber-100 transition-all text-sm">
                            🔄 Change President
                        </button>
                    ) : (
                        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">🔄 Assign New President</h4>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input className="w-full bg-white p-3 rounded-xl border-2 border-transparent focus:border-amber-500 outline-none" placeholder="New President Name" value={presidentForm.presidentName} onChange={(e) => setPresidentForm({ ...presidentForm, presidentName: e.target.value })} required />
                                <input type="email" className="w-full bg-white p-3 rounded-xl border-2 border-transparent focus:border-amber-500 outline-none" placeholder="New President Email" value={presidentForm.presidentEmail} onChange={(e) => setPresidentForm({ ...presidentForm, presidentEmail: e.target.value })} required />
                                <p className="text-xs text-amber-600">A new password will be generated. The old president's access will be revoked.</p>
                                <div className="flex gap-2">
                                    <button type="submit" disabled={changing} className={`flex-1 bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-all text-sm ${changing ? 'opacity-70' : ''}`}>{changing ? 'Changing...' : 'Confirm Change'}</button>
                                    <button type="button" onClick={() => setShowChangePresident(false)} className="bg-white text-slate-500 font-bold px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-sm border border-slate-200">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Members List */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            👥 Members ({club.members?.length || 0})
                        </h4>
                        <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                            {club.members && club.members.length > 0 ? (
                                club.members.map((member, idx) => (
                                    <div key={member._id || idx} className="flex items-center gap-3 px-4 py-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">
                                            {(member.name || 'U').charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-700 truncate">{member.name || 'Unknown'}</p>
                                            <p className="text-xs text-slate-400 truncate">{member.email || ''}</p>
                                        </div>
                                        {club.president && (member._id === club.president._id) && (
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">PRESIDENT</span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center text-slate-400 text-sm">No members yet</div>
                            )}
                        </div>
                    </div>

                    {/* Teams */}
                    {club.teams && club.teams.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">🏷️ Teams ({club.teams.length})</h4>
                            <div className="flex flex-wrap gap-2">
                                {club.teams.map((team, idx) => (
                                    <span key={team._id || idx} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-semibold">{team.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Delete */}
                    <div className="border-t border-slate-100 pt-4">
                        <button onClick={onDelete} className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-xl hover:bg-red-100 transition-all text-sm">
                            🗑️ Delete This Club
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubDetailModal;
