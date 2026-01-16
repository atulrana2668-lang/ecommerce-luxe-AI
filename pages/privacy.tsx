import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCartItemCount, getWishlist } from '@/utils/storage';
import styles from '@/styles/Account.module.css';

export default function Privacy() {
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    }, []);

    return (
        <>
            <Head>
                <title>Privacy Policy - LUXE</title>
                <meta name="description" content="LUXE Privacy Policy - How we protect your data" />
            </Head>

            <Header cartCount={cartCount} wishlistCount={wishlistCount} />

            <main className={styles.main} style={{ minHeight: '80vh' }}>
                <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        marginBottom: '2rem',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Privacy Policy
                    </h1>

                    <div style={{
                        background: 'var(--glass-bg)',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
                    }}>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            Last updated: January 10, 2026
                        </p>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                1. Information We Collect
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                We collect information you provide directly to us, such as when you create an account,
                                make a purchase, or contact us for support. This includes:
                            </p>
                            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                                <li style={{ marginBottom: '0.5rem' }}>Name and contact information</li>
                                <li style={{ marginBottom: '0.5rem' }}>Billing and shipping addresses</li>
                                <li style={{ marginBottom: '0.5rem' }}>Payment information</li>
                                <li style={{ marginBottom: '0.5rem' }}>Order history and preferences</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                2. How We Use Your Information
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                We use the information we collect to:
                            </p>
                            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                                <li style={{ marginBottom: '0.5rem' }}>Process and fulfill your orders</li>
                                <li style={{ marginBottom: '0.5rem' }}>Send you order confirmations and updates</li>
                                <li style={{ marginBottom: '0.5rem' }}>Provide customer support</li>
                                <li style={{ marginBottom: '0.5rem' }}>Personalize your shopping experience</li>
                                <li style={{ marginBottom: '0.5rem' }}>Send promotional communications (with your consent)</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                3. Data Security
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                We implement industry-standard security measures to protect your personal information.
                                All payment transactions are encrypted using SSL technology. We do not store your
                                complete credit card information on our servers.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                4. Cookies & Tracking
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                We use cookies and similar tracking technologies to enhance your browsing experience,
                                analyze site traffic, and personalize content. You can control cookie preferences
                                through your browser settings.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                5. Third-Party Sharing
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                We do not sell your personal information to third parties. We may share your
                                information with trusted service providers who assist us in operating our website,
                                processing payments, and delivering products.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                6. Your Rights
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                You have the right to access, update, or delete your personal information at any time.
                                You can manage your account settings or contact us to exercise these rights. You may
                                also opt out of marketing communications at any time.
                            </p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                7. Contact Us
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                If you have questions about this Privacy Policy or our data practices, please contact
                                us at privacy@luxe.com or write to us at LUXE Privacy Team, 123 Fashion Street,
                                Mumbai, India 400001.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
