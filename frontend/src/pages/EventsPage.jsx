import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventsPage = () => {
    const { clubId } = useParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                const res = await axios.get('http://localhost:8000/api/events', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const rawEvents = Array.isArray(res.data) ? res.data : (res.data.data || []);

                if (clubId) {
                    const filtered = rawEvents.filter(event => 
                        event.club === clubId || 
                        event.clubId === clubId || 
                        event.clubId?._id === clubId
                    );
                    setEvents(filtered);
                } else {
                    setEvents(rawEvents);
                }
                setError(null);
            } catch (err) {
                console.error("Fetch Error:", err);
                if (err.response?.status === 401) {
                    setError("Your session has expired. Please log in again.");
                } else {
                    setError("Unable to reach the server. Please ensure the backend is running on port 8000.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [clubId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] transition-colors duration-300">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-black tracking-widest text-xs uppercase animate-pulse">Loading Events...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-color)] p-6 md:p-12 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--text-color)] tracking-tight">
                        {clubId ? "Club Specific Events" : "All Campus Events"}
                    </h1>
                    <div className="h-1.5 w-16 bg-blue-600 mt-4 rounded-full shadow-lg shadow-blue-600/20"></div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-sm font-medium">
                        ⚠️ {error}
                    </div>
                )}

                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <div key={event._id} className="bg-[var(--card-bg)] border border-slate-700/20 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col gap-2">
                                        <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit border border-blue-500/20">
                                            {event.category || 'General'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                                            BY {event.clubId?.name || 'CAMPUS CLUB'}
                                        </span>
                                    </div>
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter text-right leading-relaxed">
                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        <br />
                                        <span className="text-blue-500">{event.time || ''}</span>
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-[var(--text-color)] mb-3 leading-tight tracking-tight">
                                    {event.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3 flex-grow opacity-80">
                                    {event.description}
                                </p>
                                
                                <div className="mb-8 flex items-center gap-2 text-slate-500 bg-slate-800/20 p-3 rounded-xl border border-slate-700/30">
                                    <span className="text-[10px] font-black uppercase tracking-widest">📍 {event.venue || 'TBA'}</span>
                                </div>

                                <button className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                                    I'm Interested
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    !error && (
                        <div className="text-center py-32 bg-[var(--card-bg)] rounded-[40px] border-2 border-dashed border-slate-700/30 transition-colors">
                            <div className="text-4xl mb-4">🗓️</div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No upcoming events found</p>
                            {clubId && (
                                <button 
                                    onClick={() => window.history.back()} 
                                    className="mt-6 text-blue-500 font-bold text-sm hover:text-blue-400 transition-colors"
                                >
                                    View all other events
                                </button>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default EventsPage;