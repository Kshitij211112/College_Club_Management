import React, { useState } from 'react';
import API from '../../api';

const EventsSection = ({ events, clubs, onEventCreated, onEventDeleted }) => {
    const [form, setForm] = useState({
        title: '', description: '', date: '', time: '',
        venue: '', clubId: '', category: 'Technical'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/events', form);
            alert("📅 Event successfully scheduled!");
            setForm({ title: '', description: '', date: '', time: '', venue: '', clubId: '', category: 'Technical' });
            onEventCreated();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create event.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("⚠️ Cancel this event?")) return;
        try {
            await API.delete(`/events/${id}`);
            onEventDeleted();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="grid grid-cols-12 gap-8">
            {/* Create Form */}
            <div className="col-span-12 lg:col-span-5 xl:col-span-4">
                <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8 border border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">📅 Create Event</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" placeholder="Event Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        <select className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" value={form.clubId} onChange={(e) => setForm({ ...form, clubId: e.target.value })} required>
                            <option value="">Select a club</option>
                            {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                            <input type="time" className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                        </div>
                        <input className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required />
                        <textarea className="w-full bg-slate-50 p-4 rounded-xl h-32 border-2 border-transparent focus:border-blue-600 outline-none" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all">Create Event</button>
                    </form>
                </div>
            </div>

            {/* Events Table */}
            <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b-2 border-slate-100">
                            <tr>
                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase">Event</th>
                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {events.length === 0 ? (
                                <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400"><p className="text-lg font-bold">No events yet</p></td></tr>
                            ) : events.map(event => (
                                <tr key={event._id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-5"><p className="font-bold">{event.title}</p><span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">{event.clubId?.name || 'Club'}</span></td>
                                    <td className="px-6 py-5"><p className="text-sm">{new Date(event.date).toLocaleDateString()}</p><p className="text-xs text-slate-400">{event.venue}</p></td>
                                    <td className="px-6 py-5 text-right"><button onClick={() => handleDelete(event._id)} className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">Cancel</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EventsSection;
