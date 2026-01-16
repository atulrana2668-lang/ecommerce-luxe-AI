import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import styles from '@/styles/Toast.module.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return <span>{icons[type]}</span>;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (type: ToastType, title: string, message?: string, duration: number = 5000) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newToast: Toast = { id, type, title, message, duration };

            setToasts((prev) => [...prev, newToast]);

            // Auto remove after duration
            setTimeout(() => {
                removeToast(id);
            }, duration);
        },
        [removeToast]
    );

    const success = useCallback(
        (title: string, message?: string) => showToast('success', title, message),
        [showToast]
    );

    const error = useCallback(
        (title: string, message?: string) => showToast('error', title, message),
        [showToast]
    );

    const warning = useCallback(
        (title: string, message?: string) => showToast('warning', title, message),
        [showToast]
    );

    const info = useCallback(
        (title: string, message?: string) => showToast('info', title, message),
        [showToast]
    );

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}

            {/* Toast Container */}
            <div className={styles.toastContainer}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`${styles.toast} ${styles[toast.type]}`}
                    >
                        <div className={styles.toastIcon}>
                            <ToastIcon type={toast.type} />
                        </div>
                        <div className={styles.toastContent}>
                            <div className={styles.toastTitle}>{toast.title}</div>
                            {toast.message && (
                                <div className={styles.toastMessage}>{toast.message}</div>
                            )}
                        </div>
                        <button
                            className={styles.toastClose}
                            onClick={() => removeToast(toast.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
