const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081/api';

export interface RegisterData {
    fullName: string;
    email: string;
    phone: string;
    batch: string;
    module: string;
    consent: boolean;
}

export interface LoginData {
    email: string;
}

// Helper to handle fetch with auth
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const accessToken = localStorage.getItem('cyberhunt_access_token');

    // Add token to headers if it exists
    const headers = new Headers(options.headers);
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 (Unauthorized) - attempt to refresh token
    if (response.status === 401) {
        const refreshToken = localStorage.getItem('cyberhunt_refresh_token');
        if (refreshToken) {
            try {
                const refreshRes = await fetch(`${API_URL}/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    localStorage.setItem('cyberhunt_access_token', data.accessToken);
                    localStorage.setItem('cyberhunt_refresh_token', data.refreshToken);

                    // Retry original request with new token
                    headers.set('Authorization', `Bearer ${data.accessToken}`);
                    response = await fetch(url, { ...options, headers });
                } else {
                    // Refresh failed, logout
                    api.logout();
                }
            } catch {
                api.logout();
            }
        } else {
            api.logout();
        }
    }

    return response;
};

export const api = {
    register: async (data: RegisterData) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        const res = await response.json();
        if (res.accessToken) {
            localStorage.setItem('cyberhunt_access_token', res.accessToken);
            localStorage.setItem('cyberhunt_refresh_token', res.refreshToken);
        }
        return res;
    },
    login: async (data: LoginData) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        const res = await response.json();
        if (res.accessToken) {
            localStorage.setItem('cyberhunt_access_token', res.accessToken);
            localStorage.setItem('cyberhunt_refresh_token', res.refreshToken);
        }
        return res;
    },
    submitReport: async (formData: FormData) => {
        const userEmail = localStorage.getItem('cyberhunt_user_email');
        if (userEmail && !formData.has('userEmail')) {
            formData.append('userEmail', userEmail);
        }

        const response = await fetchWithAuth(`${API_URL}/reports`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Submission failed');
        }
        return response.json();
    },
    getSubmissions: async () => {
        const email = localStorage.getItem('cyberhunt_user_email');
        if (!email) return [];

        const response = await fetchWithAuth(`${API_URL}/reports?email=${email}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch reports');
        }
        const data = await response.json();
        return data || [];
    },
    logout: () => {
        localStorage.removeItem('cyberhunt_access_token');
        localStorage.removeItem('cyberhunt_refresh_token');
        localStorage.removeItem('cyberhunt_token'); // for safety
        localStorage.removeItem('cyberhunt_user');
        localStorage.removeItem('cyberhunt_user_email');
        localStorage.removeItem('cyberhunt_target_url');
        window.location.href = '/login';
    }
};
