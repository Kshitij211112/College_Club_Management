import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

API.interceptors.request.use((req) => {
    try {
        // 1. Try to get the token from 'profile' (standard for many MERN setups)
        const profile = JSON.parse(localStorage.getItem('profile'));
        
        // 2. Fallback to 'token' if profile doesn't exist
        const token = profile?.token || localStorage.getItem('token');
        
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // If localStorage data is corrupted, clear it
        console.error("Error reading auth token:", e);
        localStorage.removeItem('profile');
        localStorage.removeItem('token');
    }
    
    return req;
});

// Auto-handle expired/invalid tokens
API.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('profile');
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// --- Club Endpoints ---
export const fetchClubs = () => API.get('/clubs');
export const fetchClubById = (id) => API.get(`/clubs/${id}`);
export const fetchMyClubs = () => API.get('/clubs/my-clubs');
export const createClub = (formData) => API.post('/clubs', formData);
export const updateClub = (id, updatedData) => API.put(`/clubs/${id}`, updatedData);
export const deleteClub = (id) => API.delete(`/clubs/${id}`);
export const joinClub = (id) => API.post(`/clubs/${id}/join`);

// --- Event Endpoints ---
export const fetchEvents = (query = "") => API.get(`/events${query}`);
export const fetchEventsByClub = (clubId) => API.get(`/events/club/${clubId}`);
export const createEvent = (eventData) => API.post('/events', eventData);

export default API;