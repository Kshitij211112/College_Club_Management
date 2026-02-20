import API from '../api';

// ─── Auth Service ───────────────────────────────

export const login = (email, password) =>
    API.post('/auth/login', { email, password });

export const register = (name, email, password) =>
    API.post('/auth/register', { name, email, password });

export const googleLogin = (token) =>
    API.post('/auth/google', { token });

export const getCurrentUser = () =>
    API.get('/auth/me');
