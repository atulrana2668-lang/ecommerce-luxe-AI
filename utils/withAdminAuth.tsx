import React, { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';
import styles from '@/styles/AdminLayout.module.css';

/**
 * Higher-Order Component to protect admin routes
 * Checks if user is authenticated and has admin role
 * Redirects to home page if not authorized
 */
export function withAdminAuth<P extends object>(
    WrappedComponent: ComponentType<P>
): React.FC<P> {
    const WithAdminAuthComponent: React.FC<P> = (props) => {
        const router = useRouter();
        const { user, isAuthenticated, isLoading } = useAuth();

        useEffect(() => {
            // Wait for auth to be checked
            if (isLoading) return;

            // Redirect if not authenticated
            if (!isAuthenticated) {
                router.replace('/login?redirect=/admin');
                return;
            }

            // Redirect if not admin
            if (user?.role !== 'admin') {
                router.replace('/');
                return;
            }
        }, [isLoading, isAuthenticated, user, router]);

        // Show loading state while checking auth
        if (isLoading) {
            return (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading...</p>
                </div>
            );
        }

        // Show loading while redirecting non-authenticated users
        if (!isAuthenticated) {
            return (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Redirecting to login...</p>
                </div>
            );
        }

        // Show loading while redirecting non-admin users
        if (user?.role !== 'admin') {
            return (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Access denied. Redirecting...</p>
                </div>
            );
        }

        // User is authenticated and is admin, render the component
        return <WrappedComponent {...props} />;
    };

    // Set display name for debugging
    WithAdminAuthComponent.displayName = `WithAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'
        })`;

    return WithAdminAuthComponent;
}

export default withAdminAuth;
