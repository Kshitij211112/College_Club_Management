import API from '../api';

// ─── Club Service ───────────────────────────────

export const getAll = () => API.get('/clubs');

export const getById = (id) => API.get(`/clubs/${id}`);

export const getMyClubs = () => API.get('/clubs/my-clubs');

export const create = (data) => API.post('/clubs', data);

export const update = (id, data) => API.put(`/clubs/${id}`, data);

export const remove = (id) => API.delete(`/clubs/${id}`);

export const join = (id) => API.post(`/clubs/${id}/join`);

export const changePresident = (id, data) =>
    API.put(`/clubs/${id}/change-president`, data);
