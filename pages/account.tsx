import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/utils/AuthContext';
import { getOrders, getCartItemCount, getWishlist } from '@/utils/storage';
import type { Order } from '@/utils/storage';
import styles from '@/styles/Account.module.css';

export default function Account() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        setOrders(getOrders());
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    }, []);

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return '#38ef7d';
            case 'shipped': return '#4facfe';
            case 'confirmed': return '#667eea';
            case 'cancelled': return '#f5576c';
            default: return '#ffc107';
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // Get display name and email
    const displayName = isAuthenticated && user ? user.name : 'Guest User';
    const displayEmail = isAuthenticated && user ? user.email : 'Continue shopping as guest';
    const avatarLetter = isAuthenticated && user ? user.name.charAt(0).toUpperCase() : '👤';

    return (
        <>
            <Head>
                <title>My Account - LUXE</title>
                <meta name="description" content="Manage your account and orders" />
            </Head>

            <Header cartCount={cartCount} wishlistCount={wishlistCount} />

            <main className={styles.main}>
                <div className="container">
                    <h1 className={styles.pageTitle}>My Account</h1>

                    <div className={styles.accountContainer}>
                        {/* Sidebar */}
                        <aside className={styles.sidebar}>
                            <div className={styles.profileCard}>
                                <div className={styles.avatar} style={{
                                    background: isAuthenticated ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : undefined,
                                    color: isAuthenticated ? '#fff' : undefined,
                                    fontSize: isAuthenticated ? '1.5rem' : undefined
                                }}>
                                    {avatarLetter}
                                </div>
                                <h3>{displayName}</h3>
                                <p>{displayEmail}</p>
                                {!isAuthenticated && (
                                    <Link href="/login" className="btn btn-primary" style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                                        Login / Sign Up
                                    </Link>
                                )}
                            </div>

                            <nav className={styles.navMenu}>
                                <Link href="/account" className={`${styles.navItem} ${styles.active}`}>
                                    <span>📦</span>
                                    My Orders
                                </Link>
                                <Link href="/wishlist" className={styles.navItem}>
                                    <span>❤️</span>
                                    Wishlist
                                </Link>
                                <Link href="/cart" className={styles.navItem}>
                                    <span>🛒</span>
                                    Shopping Cart
                                </Link>
                                {isAuthenticated && (
                                    <button onClick={handleLogout} className={styles.navItem} style={{
                                        width: '100%',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#f5576c',
                                        marginTop: '1rem'
                                    }}>
                                        <span>🚪</span>
                                        Logout
                                    </button>
                                )}
                            </nav>
                        </aside>

                        {/* Orders Section */}
                        <div className={styles.content}>
                            <h2 className={styles.sectionTitle}>My Orders</h2>

                            {orders.length === 0 ? (
                                <div className={styles.emptyOrders}>
                                    <div className={styles.emptyIcon}>📦</div>
                                    <h3>No Orders Yet</h3>
                                    <p>Start shopping to see your orders here!</p>
                                    <Link href="/products" className="btn btn-primary">
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.ordersList}>
                                    {orders.map((order) => (
                                        <div key={order.id} className={styles.orderCard}>
                                            <div className={styles.orderHeader}>
                                                <div>
                                                    <h3 className={styles.orderId}>Order #{order.id}</h3>
                                                    <p className={styles.orderDate}>
                                                        {new Date(order.date).toLocaleDateString('en-IN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div
                                                    className={styles.orderStatus}
                                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                                >
                                                    {order.status.toUpperCase()}
                                                </div>
                                            </div>

                                            <div className={styles.orderItems}>
                                                {order.items.map((item, index) => (
                                                    <div key={index} className={styles.orderItem}>
                                                        <span>{item.name}</span>
                                                        <span>×{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className={styles.orderFooter}>
                                                <div className={styles.orderTotal}>
                                                    <span>Total:</span>
                                                    <span className={styles.totalAmount}>₹{order.total.toFixed(0)}</span>
                                                </div>
                                                <div className={styles.orderAddress}>
                                                    <strong>Delivery Address:</strong>
                                                    <p>{order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
