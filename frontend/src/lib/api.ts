/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// Using a mock API flow to act as a backend substitute for the assignment

export const api = {
    register: async (data: any) => {
        return new Promise<{ success: boolean, token: string }>((resolve) => {
            setTimeout(() => resolve({ success: true, token: 'mock-jwt-token-123' }), 1500);
        });
    },
    login: async (data: any) => {
        return new Promise<{ success: boolean, token: string }>((resolve, reject) => {
            setTimeout(() => {
                if (data.email && data.password) {
                    // allow any format-validated credentials since there is no DB hookup
                    resolve({ success: true, token: 'mock-jwt-token-123' });
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 1000);
        });
    },
    submitReport: async (data: FormData) => {
        return new Promise<{ success: boolean }>((resolve) => {
            setTimeout(() => resolve({ success: true }), 1500);
        });
    },
    getSubmissions: async () => {
        return new Promise<Array<any>>((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: '9823-X', title: 'SQL Injection in Auth Module', date: 'Oct 24, 2023', status: 'Verified' },
                    { id: '7741-B', title: 'XSS on Profile Page', date: 'Oct 22, 2023', status: 'Pending' },
                    { id: '4120-Q', title: 'Broken Access Control', date: 'Oct 20, 2023', status: 'Rejected' },
                    { id: '1102-L', title: 'CSRF in Settings', date: 'Oct 18, 2023', status: 'Verified' },
                ]);
            }, 800);
        });
    }
};
