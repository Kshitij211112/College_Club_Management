import React, { useState, useEffect } from 'react';
import * as clubService from '../../services/clubService';
import * as eventService from '../../services/eventService';
import { copyToClipboard } from '../../utils/helpers';
import {
    PasswordModal,
    CreateClubModal,
    ClubDetailModal,
    AdminClubCard,
    EventsSection
} from '../../components/admin';

const AdminDashboard = () => {
    const [view, setView] = useState('clubs');
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);

    // Modal states
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [createdCredentials, setCreatedCredentials] = useState(null);
    const [createLoading, setCreateLoading] = useState(false);

    // Club detail
    const [showClubDetail, setShowClubDetail] = useState(false);
    const [clubDetail, setClubDetail] = useState(null);

    // ─── Data Loading ───────────────────────────
    useEffect(() => { loadClubs(); loadEvents(); }, []);

    const loadClubs = async () => {
        try {
            const res = await clubService.getAll();
            setClubs(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error("Fetch Clubs Error:", err.message); }
    };

    const loadEvents = async () => {
        try {
            const res = await eventService.getAll();
            const data = res.data.data || res.data || [];
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) { console.error("Fetch Events Error:", err.message); }
    };

    // ─── Club Actions ───────────────────────────
    const handleCreateClub = async (form, resetForm) => {
        setCreateLoading(true);
        try {
            const res = await clubService.create({
                name: form.name, description: form.description,
                category: form.category, presidentName: form.presidentName,
                presidentEmail: form.presidentEmail,
                logo: form.logo || undefined, image: form.image || undefined
            });
            setCreatedCredentials({
                clubName: form.name,
                presidentEmail: res.data.presidentEmail,
                generatedPassword: res.data.generatedPassword
            });
            setShowPasswordModal(true);
            setShowCreateForm(false);
            resetForm();
            loadClubs();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create club.");
        } finally { setCreateLoading(false); }
    };

    const handleViewClub = async (club) => {
        setShowClubDetail(true);
        setClubDetail(null);
        try {
            const res = await clubService.getById(club._id);
            setClubDetail(res.data);
        } catch (err) {
            alert("Failed to load club details.");
            setShowClubDetail(false);
        }
    };

    const handleDeleteClub = async (id) => {
        if (!window.confirm("⚠️ Are you sure you want to delete this club? This cannot be undone.")) return;
        try {
            await clubService.remove(id);
            setShowClubDetail(false);
            setClubDetail(null);
            loadClubs();
        } catch (err) { alert(err.response?.data?.message || "Failed to delete club."); }
    };

    const handleChangePresident = async (presidentForm) => {
        if (!clubDetail) return;
        const res = await clubService.changePresident(clubDetail._id, presidentForm);
        setCreatedCredentials({
            clubName: clubDetail.name,
            presidentEmail: res.data.presidentEmail,
            generatedPassword: res.data.generatedPassword
        });
        setShowClubDetail(false);
        setShowPasswordModal(true);
        loadClubs();
    };

    // ─── Render ─────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">

            {/* Modals */}
            {showPasswordModal && createdCredentials && (
                <PasswordModal credentials={createdCredentials} onClose={() => setShowPasswordModal(false)} onCopy={copyToClipboard} />
            )}
            {showCreateForm && (
                <CreateClubModal onClose={() => setShowCreateForm(false)} onSubmit={handleCreateClub} loading={createLoading} />
            )}
            {showClubDetail && (
                <ClubDetailModal
                    club={clubDetail}
                    onClose={() => { setShowClubDetail(false); setClubDetail(null); }}
                    onDelete={() => handleDeleteClub(clubDetail?._id)}
                    onChangePresident={handleChangePresident}
                />
            )}

            <main className="max-w-[1600px] mx-auto p-6 md:p-12">
                {/* Header */}
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-2">
                            Admin <span className="text-blue-600">Dashboard</span>
                        </h1>
                        <div className="flex gap-3 mt-6 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
                            <button onClick={() => setView('clubs')} className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${view === 'clubs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>CLUBS</button>
                            <button onClick={() => setView('events')} className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${view === 'events' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>EVENTS</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {view === 'clubs' && (
                            <button onClick={() => setShowCreateForm(true)} className="bg-blue-600 text-white font-bold px-6 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 text-sm">
                                <span className="text-lg">+</span> Add New Club
                            </button>
                        )}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center min-w-[140px]">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total {view}</p>
                            <p className="text-4xl font-black text-slate-900">{view === 'clubs' ? clubs.length : events.length}</p>
                        </div>
                    </div>
                </header>

                {/* Clubs Grid */}
                {view === 'clubs' && (
                    clubs.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-16 text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-4xl">🏫</span></div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">No Clubs Yet</h3>
                            <p className="text-slate-400 mb-8">Get started by creating your first club</p>
                            <button onClick={() => setShowCreateForm(true)} className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg">+ Create Your First Club</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {clubs.map(club => (
                                <AdminClubCard key={club._id} club={club} onView={handleViewClub} onDelete={handleDeleteClub} />
                            ))}
                        </div>
                    )
                )}

                {/* Events */}
                {view === 'events' && (
                    <EventsSection events={events} clubs={clubs} onEventCreated={loadEvents} onEventDeleted={loadEvents} />
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
