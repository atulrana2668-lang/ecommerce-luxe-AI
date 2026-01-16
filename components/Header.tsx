import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/utils/AuthContext';
import styles from './Header.module.css';

interface HeaderProps {
    cartCount?: number;
    wishlistCount?: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount = 0, wishlistCount = 0 }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        window.location.href = '/';
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContainer}`}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>✨</span>
                    <span className={styles.logoText}>LUXE</span>
                </Link>

                {/* Search Bar */}
                <form className={styles.searchBar} onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search for products, brands and more..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchButton}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8" strokeWidth="2" />
                            <path d="m21 21-4.35-4.35" strokeWidth="2" />
                        </svg>
                    </button>
                </form>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <Link href="/products?category=Men" className={styles.navLink}>
                        Men
                    </Link>
                    <Link href="/products?category=Women" className={styles.navLink}>
                        Women
                    </Link>
                    <Link href="/products" className={styles.navLink}>
                        All Products
                    </Link>
                </nav>

                {/* Actions */}
                <div className={styles.actions}>
                    <Link href="/wishlist" className={styles.actionButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" />
                        </svg>
                        {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
                    </Link>

                    <Link href="/cart" className={styles.actionButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="9" cy="21" r="1" strokeWidth="2" />
                            <circle cx="20" cy="21" r="1" strokeWidth="2" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeWidth="2" />
                        </svg>
                        {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                    </Link>

                    {/* Profile / Auth Section */}
                    {isAuthenticated && user ? (
                        <div className={styles.profileDropdown} ref={profileRef}>
                            <button
                                className={styles.profileButton}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className={styles.avatar}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginLeft: '4px' }}>
                                    <path d="M6 9l6 6 6-6" strokeWidth="2" />
                                </svg>
                            </button>

                            {isProfileOpen && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownHeader}>
                                        <div className={styles.dropdownAvatar}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className={styles.dropdownName}>{user.name}</p>
                                            <p className={styles.dropdownEmail}>{user.email}</p>
                                        </div>
                                    </div>
                                    <div className={styles.dropdownDivider}></div>
                                    <Link href="/account" className={styles.dropdownItem} onClick={() => setIsProfileOpen(false)}>
                                        <span>👤</span> My Account
                                    </Link>
                                    <Link href="/account#orders" className={styles.dropdownItem} onClick={() => setIsProfileOpen(false)}>
                                        <span>📦</span> My Orders
                                    </Link>
                                    <Link href="/wishlist" className={styles.dropdownItem} onClick={() => setIsProfileOpen(false)}>
                                        <span>❤️</span> Wishlist
                                    </Link>
                                    <div className={styles.dropdownDivider}></div>
                                    <button className={styles.dropdownLogout} onClick={handleLogout}>
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link href="/login" className={styles.loginButton}>
                                Login
                            </Link>
                            <Link href="/signup" className={styles.signupButton}>
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
                        <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
                        <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <Link href="/products?category=Men" className={styles.mobileNavLink}>
                        Men
                    </Link>
                    <Link href="/products?category=Women" className={styles.mobileNavLink}>
                        Women
                    </Link>
                    <Link href="/products" className={styles.mobileNavLink}>
                        All Products
                    </Link>
                    <div className={styles.mobileAuthSection}>
                        {isAuthenticated && user ? (
                            <>
                                <Link href="/account" className={styles.mobileNavLink}>
                                    My Account
                                </Link>
                                <button onClick={handleLogout} className={styles.mobileLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={styles.mobileNavLink}>
                                    Login
                                </Link>
                                <Link href="/signup" className={styles.mobileNavLink}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
