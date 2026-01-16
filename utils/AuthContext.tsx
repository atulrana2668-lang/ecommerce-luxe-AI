import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, removeToken } from './api';
import type { User, Address } from '@/src/types';

// Re-export for backward compatibility
export type { User, Address };

// Auth context interface
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    const response = await authApi.getMe();
                    if (response.success && response.data?.user) {
                        setUser(response.data.user);
                        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                    } else {
                        removeToken();
                        localStorage.removeItem('currentUser');
                    }
                } else {
                    // Try to load from localStorage as fallback
                    const storedUser = localStorage.getItem('currentUser');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                removeToken();
                localStorage.removeItem('currentUser');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await authApi.login({ email, password });

            if (response.success && response.data?.user) {
                setUser(response.data.user);
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                return { success: true, message: 'Login successful!' };
            }

            return { success: false, message: response.message || 'Login failed' };
        } catch (error: any) {
            return { success: false, message: error.message || 'Login failed' };
        }
    };

    // Register function
    const register = async (
        name: string,
        email: string,
        password: string,
        phone?: string
    ): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await authApi.register({ name, email, password, phone });

            if (response.success && response.data?.user) {
                setUser(response.data.user);
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                return { success: true, message: 'Registration successful!' };
            }

            return { success: false, message: response.message || 'Registration failed' };
        } catch (error: any) {
            return { success: false, message: error.message || 'Registration failed' };
        }
    };

    // Logout function
    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    // Update user data locally
    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
    };

    // Refresh user data from server
    const refreshUser = async () => {
        try {
            const response = await authApi.getMe();
            if (response.success && response.data?.user) {
                setUser(response.data.user);
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
