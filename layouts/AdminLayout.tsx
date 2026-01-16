import React, { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/utils/AuthContext';
import styles from '@/styles/AdminLayout.module.css';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
    breadcrumb?: { label: string; href?: string }[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
    children,
    title = 'Dashboard',
    breadcrumb = []
}) => {
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuth();

    // Security Check: Redirect if not admin
    useEffect(() => {
        // If we know the user is authenticated but not an admin, redirect
        if (isAuthenticated && user && user.role !== 'admin') {
            router.push('/');
        }
        // If loading is finished and not authenticated at all, redirect to login or home
        // (Assuming useAuth handles loading state or we can check token)
    }, [user, isAuthenticated, router]);

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: '📊' },
        { label: 'Products', href: '/admin/products', icon: '📦' },
        { label: 'Orders', href: '/admin/orders', icon: '🛒' },
    ];

    const isActive = (href: string) => {
        if (href === '/admin') {
            return router.pathname === '/admin';
        }
        return router.pathname.startsWith(href);
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const getUserInitials = () => {
        if (!user?.name) return 'A';
        return user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <Head>
                <title>{title} - LUXE Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className={styles.adminLayout}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <Link href="/admin" className={styles.logo}>
                            <div className={styles.logoIcon}>👑</div>
                            <div>
                                <div className={styles.logoText}>LUXE</div>
                                <div className={styles.logoSubtext}>Admin Panel</div>
                            </div>
                        </Link>
                    </div>

                    <nav className={styles.nav}>
                        <div className={styles.navSection}>
                            <div className={styles.navSectionTitle}>Menu</div>
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                                >
                                    <span className={styles.navIcon}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className={styles.navItem}
                                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'inherit', font: 'inherit' }}
                            >
                                <span className={styles.navIcon}>🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </nav>

                    <div className={styles.userSection}>
                        <div className={styles.userAvatar}>
                            {getUserInitials()}
                        </div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{user?.name || 'Admin'}</div>
                            <div className={styles.userRole}>{user?.role || 'Administrator'}</div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={styles.main}>
                    {/* Top Bar */}
                    <div className={styles.topBar}>
                        <div>
                            <h1 className={styles.pageTitle}>{title}</h1>
                            {breadcrumb.length > 0 && (
                                <div className={styles.breadcrumb}>
                                    <Link href="/admin">Admin</Link>
                                    {breadcrumb.map((crumb, index) => (
                                        <React.Fragment key={index}>
                                            <span>/</span>
                                            {crumb.href ? (
                                                <Link href={crumb.href}>{crumb.label}</Link>
                                            ) : (
                                                <span>{crumb.label}</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.topBarActions}>
                            <div className={styles.searchBar}>
                                <span>🔍</span>
                                <input type="text" placeholder="Search..." />
                            </div>
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className={styles.content}>
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminLayout;
