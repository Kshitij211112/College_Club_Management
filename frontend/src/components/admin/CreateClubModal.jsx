import React, { useState } from 'react';

const CreateClubModal = ({ onClose, onSubmit, loading }) => {
    const [form, setForm] = useState({
        name: '', description: '', category: 'Technical',
        presidentName: '', presidentEmail: '', logo: '', image: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form, () => {
            setForm({ name: '', description: '', category: 'Technical', presidentName: '', presidentEmail: '', logo: '', image: '' });
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
                {/* Sticky header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-slate-100 flex-shrink-0">
                    <h2 className="text-2xl font-black text-slate-900">➕ Create New Club</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl transition-all">✕</button>
                </div>

                {/* Scrollable form content */}
                <div className="overflow-y-auto flex-1 px-8 pt-4 pb-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Club Name *</label>
                        <input className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none mt-1" placeholder="e.g. Coding Club" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                        <select className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none mt-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                            <option value="Technical">Technical</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Sports">Sports</option>
                            <option value="Arts">Arts</option>
                            <option value="Music">Music</option>
                            <option value="Drama">Drama</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description *</label>
                        <textarea className="w-full bg-slate-50 p-4 rounded-xl h-24 border-2 border-transparent focus:border-blue-600 outline-none mt-1 resize-none" placeholder="Brief description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">👤 President Details</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">President Name *</label>
                        <input className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none mt-1" placeholder="e.g. John Doe" value={form.presidentName} onChange={(e) => setForm({ ...form, presidentName: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">President Email *</label>
                        <input type="email" className="w-full bg-slate-50 p-4 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none mt-1" placeholder="president@college.edu" value={form.presidentEmail} onChange={(e) => setForm({ ...form, presidentEmail: e.target.value })} required />
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">🖼️ Images (Optional)</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logo URL</label>
                        <input className="w-full bg-slate-50 p-3 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none mt-1 text-sm" placeholder="https://..." value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cover Image URL</label>
                        <input className="w-full bg-slate-50 p-3 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none mt-1 text-sm" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                    </div>

                    <button type="submit" disabled={loading} className={`w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {loading ? 'Creating...' : '🚀 Create Club & Generate Password'}
                    </button>
                </form>
                </div>
            </div>
        </div>
    );
};

export default CreateClubModal;
