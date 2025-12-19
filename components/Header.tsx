import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

interface HeaderProps {
    cartCount?: number;
    wishlistCount?: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount = 0, wishlistCount = 0 }) => {
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
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

                    <Link href="/account" className={styles.actionButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" />
                            <circle cx="12" cy="7" r="4" strokeWidth="2" />
                        </svg>
                    </Link>
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
                </div>
            )}
        </header>
    );
};

export default Header;
