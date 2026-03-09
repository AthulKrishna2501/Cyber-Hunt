const API_URL = 'http://127.0.0.1:8081/api';

export const api = {
    register: async (data: any) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        return response.json();
    },
    login: async (data: any) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        return response.json();
    },
    submitReport: async (data: FormData) => {
        // Find user email from form data or local storage
        const userEmail = localStorage.getItem('cyberhunt_user_email'); // We should store this during login
        if (userEmail && !data.has('userEmail')) {
            data.append('userEmail', userEmail);
        }

        const response = await fetch(`${API_URL}/reports`, {
            method: 'POST',
            body: data,
            // Don't set Content-Type header when sending FormData; browser will set it with boundary
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

        const response = await fetch(`${API_URL}/reports?email=${email}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch reports');
        }
        const data = await response.json();
        return data || [];
    }
};
