// API utility for making requests to the Next.js API routes

const API_BASE_URL = '/api';

interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: any[];
}

// Get auth token from localStorage
const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
};

// Set auth token to localStorage
export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
    }
};

// Remove auth token from localStorage
export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
    }
};

// Generic API request function
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error: any) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API
export const authApi = {
    register: async (userData: { name: string; email: string; password: string; phone?: string }) => {
        const response = await apiRequest<{ user: any; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        if (response.data?.token) {
            setToken(response.data.token);
        }
        return response;
    },

    login: async (credentials: { email: string; password: string }) => {
        const response = await apiRequest<{ user: any; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        if (response.data?.token) {
            setToken(response.data.token);
        }
        return response;
    },

    getMe: async () => {
        return apiRequest<{ user: any }>('/auth/me');
    },

    logout: async () => {
        removeToken();
        localStorage.removeItem('currentUser');
        return { success: true, message: 'Logged out successfully' };
    },
};

export default apiRequest;
