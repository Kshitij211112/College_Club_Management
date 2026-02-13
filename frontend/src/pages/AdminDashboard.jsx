import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import API, { fetchClubs } from '../api';

const AdminDashboard = () => {
    const navigate = useNavigate(); // Hook to redirect after success
    const [view, setView] = useState('clubs'); 
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    
    const [clubForm, setClubForm] = useState({ 
        name: '', 
        description: '', 
        category: 'Technical'
    });

    const [eventForm, setEventForm] = useState({
        title: '', 
        description: '', 
        date: '', 
        time: '', 
        venue: '', 
        clubId: '', 
        category: 'Technical'
    });

    useEffect(() => { 
        loadClubs(); 
        loadEvents();
    }, []);

    const loadClubs = async () => {
        try {
            const res = await fetchClubs();
            setClubs(Array.isArray(res.data) ? res.data : []);
        } catch (err) { 
            console.error("Fetch Clubs Error:", err.message);
        }
    };

    const loadEvents = async () => {
        try {
            const res = await API.get('/events');
            // Matching the parsing logic used in your EventsPage
            const eventsData = res.data.data || res.data || [];
            setEvents(Array.isArray(eventsData) ? eventsData : []);
        } catch (err) { 
            console.error("Fetch Events Error:", err.message);
        }
    };

    const handleCreateClub = async (e) => {
        e.preventDefault();
        try {
            await API.post('/clubs', clubForm);
            alert("🚀 Club successfully deployed!");
            setClubForm({ name: '', description: '', category: 'Technical' });
            loadClubs(); 
        } catch (err) { 
            alert(err.response?.data?.message || "Failed to create club."); 
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await API.post('/events', eventForm);
            alert("📅 Event successfully scheduled!");
            
            // RESET FORM
            setEventForm({ title: '', description: '', date: '', time: '', venue: '', clubId: '', category: 'Technical' });
            
            // REFRESH LOCAL LIST
            await loadEvents();

            // REDIRECT TO EVENTS PAGE
            // This ensures the EventsPage component re-mounts and fetches the latest data
            navigate('/events'); 
            
        } catch (err) { 
            console.error("Create Event Error:", err);
            alert(err.response?.data?.message || "Failed to create event."); 
        }
    };

    const handleDeleteClub = async (id) => {
        if (!window.confirm("⚠️ Delete this club?")) return;
        try {
            await API.delete(`/clubs/${id}`);
            loadClubs();
        } catch (err) {
            console.error("Delete Club Error:", err);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("⚠️ Cancel this event?")) return;
        try {
            await API.delete(`/events/${id}`);
            loadEvents();
        } catch (err) {
            console.error("Delete Event Error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <main className="max-w-[1600px] mx-auto p-6 md:p-12">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-2">
                            Admin <span className="text-blue-600">Dashboard</span>
                        </h1>
                        <div className="flex gap-3 mt-6 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
                            <button onClick={() => setView('clubs')} className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${view === 'clubs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>CLUBS</button>
                            <button onClick={() => setView('events')} className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${view === 'events' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>EVENTS</button>
                        </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center min-w-[180px]">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total {view}</p>
                        <p className="text-5xl font-black text-slate-900">{view === 'clubs' ? clubs.length : events.length}</p>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    {/* FORM SECTION */}
                    <div className="col-span-12 lg:col-span-5 xl:col-span-4">
                        <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8 border border-slate-100">
                            <h2 className="text-2xl font-black text-slate-900 mb-6">Create {view === 'clubs' ? 'Club' : 'Event'}</h2>
                            
                            {view === 'clubs' ? (
                                <form onSubmit={handleCreateClub} className="space-y-5">
                                    <input className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" placeholder="Club Name" value={clubForm.name} onChange={(e) => setClubForm({...clubForm, name: e.target.value})} required />
                                    <select className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" value={clubForm.category} onChange={(e) => setClubForm({...clubForm, category: e.target.value})}>
                                        <option value="Technical">Technical</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Sports">Sports</option>
                                    </select>
                                    <textarea className="w-full bg-slate-50 p-4 rounded-xl h-32 border-2 border-transparent focus:border-blue-600 outline-none" placeholder="Description" value={clubForm.description} onChange={(e) => setClubForm({...clubForm, description: e.target.value})} required />
                                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all">Create Club</button>
                                </form>
                            ) : (
                                <form onSubmit={handleCreateEvent} className="space-y-5">
                                    <input className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" placeholder="Event Title" value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} required />
                                    <select className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" value={eventForm.clubId} onChange={(e) => setEventForm({...eventForm, clubId: e.target.value})} required>
                                        <option value="">Select a club</option>
                                        {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="date" className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" value={eventForm.date} onChange={(e) => setEventForm({...eventForm, date: e.target.value})} required />
                                        <input type="time" className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" value={eventForm.time} onChange={(e) => setEventForm({...eventForm, time: e.target.value})} required />
                                    </div>
                                    <input className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" placeholder="Venue" value={eventForm.venue} onChange={(e) => setEventForm({...eventForm, venue: e.target.value})} required />
                                    <textarea className="w-full bg-slate-50 p-4 rounded-xl h-32 border-2 border-transparent focus:border-blue-600 outline-none" placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} required />
                                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all">Create Event</button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* LIST SECTION */}
                    <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b-2 border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase">Details</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase">Info</th>
                                        <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {view === 'clubs' ? (
                                        clubs.map(club => (
                                            <tr key={club._id} className="hover:bg-slate-50/50">
                                                <td className="px-8 py-6"><p className="font-bold">{club.name}</p><span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{club.category}</span></td>
                                                <td className="px-8 py-6"><p className="text-sm">{club.presidentName || 'You'}</p></td>
                                                <td className="px-8 py-6 text-right">
                                                    <button onClick={() => handleDeleteClub(club._id)} className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-xs font-bold">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        events.map(event => (
                                            <tr key={event._id} className="hover:bg-slate-50/50">
                                                <td className="px-8 py-6"><p className="font-bold">{event.title}</p><span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">{event.clubId?.name || 'Club'}</span></td>
                                                <td className="px-8 py-6"><p className="text-sm">{new Date(event.date).toLocaleDateString()}</p><p className="text-xs text-slate-400">{event.venue}</p></td>
                                                <td className="px-8 py-6 text-right">
                                                    <button onClick={() => handleDeleteEvent(event._id)} className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-xs font-bold">Cancel</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;