import React from 'react';

const CATEGORY_COLORS = {
    Technical: 'bg-blue-100 text-blue-700',
    Cultural: 'bg-purple-100 text-purple-700',
    Sports: 'bg-green-100 text-green-700',
    Arts: 'bg-pink-100 text-pink-700',
    Music: 'bg-yellow-100 text-yellow-800',
    Drama: 'bg-orange-100 text-orange-700',
    Other: 'bg-slate-100 text-slate-600'
};

const AdminClubCard = ({ club, onView, onDelete }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Card Header Image */}
            <div className="h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 relative overflow-hidden">
                {club.image && club.image !== 'https://via.placeholder.com/400x300?text=Club+Image' && (
                    <img src={club.image} alt={club.name} className="w-full h-full object-cover absolute inset-0 opacity-80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    {club.logo && club.logo !== 'https://via.placeholder.com/400x300?text=Club+Logo' ? (
                        <img src={club.logo} alt="logo" className="w-12 h-12 rounded-xl border-2 border-white shadow-lg object-cover" />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white font-black text-lg">
                            {club.name?.charAt(0)}
                        </div>
                    )}
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${CATEGORY_COLORS[club.category] || CATEGORY_COLORS.Other}`}>
                        {club.category}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5">
                <h3 className="text-lg font-black text-slate-900 mb-1 truncate">{club.name}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">{club.description}</p>

                {/* President */}
                <div className="bg-slate-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                            {club.presidentName?.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate">{club.presidentName || 'Unknown'}</p>
                            <p className="text-xs text-slate-400 truncate">{club.presidentEmail || ''}</p>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-auto flex-shrink-0">PRESIDENT</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold">{club.membersCount}</span> members
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="font-semibold">{club.teamsCount}</span> teams
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button onClick={() => onView(club)} className="flex-1 bg-blue-50 text-blue-600 font-bold py-2.5 rounded-xl text-sm hover:bg-blue-100 transition-all">View Club</button>
                    <button onClick={() => onDelete(club._id)} className="bg-red-50 text-red-500 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-red-100 transition-all">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default AdminClubCard;
