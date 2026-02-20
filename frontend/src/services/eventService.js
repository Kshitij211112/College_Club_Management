import API from '../api';

// ─── Event Service ──────────────────────────────

export const getAll = () => API.get('/events');

export const getByClub = (clubId) => API.get(`/events/club/${clubId}`);

export const create = (data) => API.post('/events', data);

export const remove = (id) => API.delete(`/events/${id}`);
