import React from 'react';
import { Link } from 'react-router-dom';

const ClubCard = ({ club, isMember, onJoin }) => {
  return (
    <div className="group relative h-full">
      {/* 1. Subtle Outer Glow - Stays only on hover */}
      <div className="absolute -inset-1 bg-blue-400/5 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative h-full transition-all duration-500 hover:-translate-y-2">
        {/* 2. Main Card Body - ONLY SHADOW IS HERE */}
        <div className="relative bg-[var(--card-bg)] rounded-[2.8rem] p-8 md:p-10 h-full flex flex-col border border-slate-200/50 shadow-sm group-hover:shadow-md transition-all">
          
          {/* Top Bar: Icon & Category */}
          <div className="flex justify-between items-start mb-8">
            <div className="relative">
              {/* Icon: Shadow Removed */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                {club.name.charAt(0)}
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[var(--card-bg)] rounded-full"></div>
            </div>
            
            {/* Category Tag: Shadow Removed */}
            <span className="text-[9px] font-black py-2 px-4 bg-white text-blue-600 border border-blue-100 rounded-full uppercase tracking-widest">
              {club.category || 'General'}
            </span>
          </div>

          {/* Text Content */}
          <div className="flex-grow">
            <h2 className="text-3xl font-black text-[var(--text-color)] mb-4 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
              {club.name}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
              {club.description}
            </p>
          </div>

          {/* Social Proof Section */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-[var(--card-bg)] bg-white overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${club.name + i}`} 
                    alt="member" 
                    className="w-full h-full object-cover opacity-100" 
                  />
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-[var(--text-color)] leading-none">{club.members?.length || 0}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Members</p>
            </div>
          </div>

          {/* Actions: Join & Details (ALL BUTTON SHADOWS REMOVED) */}
          <div className="flex gap-4">
            {isMember ? (
              <button disabled className="flex-1 bg-emerald-50 text-emerald-600 font-bold py-4 rounded-2xl border border-emerald-100 cursor-default text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                <span>✓</span> Joined
              </button>
            ) : (
              <button 
                onClick={() => onJoin(club._id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest active:scale-95"
              >
                Join
              </button>
            )}

            <Link 
              to={`/clubs/${club._id}`} 
              className="flex-1 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;