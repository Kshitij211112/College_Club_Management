import React, { useEffect, useState } from 'react';
import API from '../../api';

const EventsSection = ({ club }) => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', date: '', time: '', venue: '', category: 'Other', eventType: 'Offline' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (club?._id) loadEvents();
    }, [club]);

    const loadEvents = async () => {
        try {
            const res = await API.get(`/events?clubId=${club._id}`);
            setEvents(res.data.data || res.data || []);
        } catch (err) { console.error(err); }
    };

    const openCreate = () => {
        setEditingEvent(null);
        setForm({ title: '', description: '', date: '', time: '', venue: '', category: 'Other', eventType: 'Offline' });
        setShowModal(true);
    };

    const openEdit = (event) => {
        setEditingEvent(event);
        setForm({
            title: event.title, description: event.description,
            date: event.date?.split('T')[0] || '', time: event.time || '', venue: event.venue,
            category: event.category || 'Other', eventType: event.eventType || 'Offline'
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingEvent) {
                await API.put(`/events/${editingEvent._id}`, { ...form, clubId: club._id });
            } else {
                await API.post('/events', { ...form, clubId: club._id });
            }
            setShowModal(false);
            loadEvents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save event');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await API.delete(`/events/${id}`);
            loadEvents();
        } catch (err) { alert('Failed to delete event'); }
    };

    const statusColor = (s) => {
        if (s === 'Upcoming') return 'bg-green-100 text-green-700';
        if (s === 'Cancelled') return 'bg-red-100 text-red-600';
        return 'bg-slate-100 text-slate-500';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Events</h2>
                    <p className="text-sm text-slate-400 mt-1">{events.length} events</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                    <span className="text-lg">+</span> Create Event
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-black text-slate-900 mb-5">{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event Title" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" required />
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 h-24 resize-none" required />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" required />
                                <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" required />
                            </div>
                            <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="Venue" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" required />
                            <div className="grid grid-cols-2 gap-3">
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500">
                                    {['Technical', 'Cultural', 'Workshop', 'Competition', 'Performance', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500">
                                    {['Online', 'Offline', 'Hybrid'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : editingEvent ? 'Update' : 'Create'}</button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Event</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {events.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">No events yet</td></tr>
                        ) : events.map(event => (
                            <tr key={event._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-800">{event.title}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{event.venue}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{new Date(event.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">{event.eventType || 'Offline'}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColor(event.status)}`}>{event.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEdit(event)} className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all">Edit</button>
                                        <button onClick={() => handleDelete(event._id)} className="text-red-500 bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventsSection;
