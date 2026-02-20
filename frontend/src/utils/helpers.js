// ─── Date Helpers ───────────────────────────────

export const formatDate = (dateString, options) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, options || {
        month: 'short', day: 'numeric', year: 'numeric',
    });
};

// ─── Clipboard ──────────────────────────────────

export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        alert('✅ Copied to clipboard!');
    } catch {
        alert('Failed to copy');
    }
};

// ─── Auth Helpers ───────────────────────────────

export const getStoredAuth = () => {
    try {
        const profileStr = localStorage.getItem('profile');
        if (profileStr) {
            const profile = JSON.parse(profileStr);
            return {
                token: profile.token,
                user: profile.user,
                userId: profile.user?._id || profile._id,
            };
        }
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            const user = JSON.parse(userStr);
            return { token, user, userId: user._id || user.id };
        }
        return null;
    } catch {
        localStorage.removeItem('profile');
        localStorage.removeItem('token');
        return null;
    }
};

export const clearStoredAuth = () => {
    localStorage.removeItem('profile');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
