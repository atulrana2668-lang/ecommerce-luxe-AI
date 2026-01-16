import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCartItemCount, getWishlist } from '@/utils/storage';
import styles from '@/styles/Account.module.css';

export default function Terms() {
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    }, []);

    return (
        <>
            <Head>
                <title>Terms of Service - LUXE</title>
                <meta name="description" content="LUXE Terms of Service and Conditions" />
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
                        Terms of Service
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
                                1. Agreement to Terms
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                By accessing our website at luxe.com, you agree to be bound by these terms of service,
                                all applicable laws and regulations, and agree that you are responsible for compliance
                                with any applicable local laws. If you do not agree with any of these terms, you are
                                prohibited from using or accessing this site.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                2. Use License
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                Permission is granted to temporarily download one copy of the materials on LUXE&apos;s
                                website for personal, non-commercial transitory viewing only. This is the grant of
                                a license, not a transfer of title.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                3. Product Information
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                We strive to display product colors and images as accurately as possible. However,
                                we cannot guarantee that your computer monitor&apos;s display of any color will be accurate.
                                We reserve the right to limit quantities of items purchased per person, household, or order.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                4. Pricing & Payment
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes.
                                We reserve the right to change prices at any time without notice. Payment must be
                                made in full at the time of purchase through our secure payment gateway.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                5. Shipping & Delivery
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                Free shipping is available on orders above ₹999. Standard delivery takes 5-7 business
                                days. Express delivery options are available at checkout. We are not responsible for
                                delays caused by customs or other factors beyond our control.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                6. Returns & Refunds
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                We offer a 30-day return policy on all unworn, unwashed items with original tags
                                attached. Refunds will be processed within 7-10 business days after we receive the
                                returned item. Shipping costs for returns are the responsibility of the customer
                                unless the item was defective or incorrect.
                            </p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                7. Contact Us
                            </h2>
                            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                If you have any questions about these Terms, please contact us at support@luxe.com
                                or call our customer service line at +91-1800-LUXE-HELP.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
