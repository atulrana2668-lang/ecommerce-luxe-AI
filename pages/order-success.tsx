import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getOrderById, getCartItemCount, getWishlist } from '@/utils/storage';
import type { Order } from '@/utils/storage';
import styles from '@/styles/OrderSuccess.module.css';

export default function OrderSuccess() {
    const router = useRouter();
    const { orderId } = router.query;
    const [order, setOrder] = useState<Order | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        if (orderId && typeof orderId === 'string') {
            const foundOrder = getOrderById(orderId);
            setOrder(foundOrder || null);
        }
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    }, [orderId]);

    return (
        <>
            <Head>
                <title>Order Placed Successfully - LUXE</title>
                <meta name="description" content="Your order has been placed successfully" />
            </Head>

            <Header cartCount={cartCount} wishlistCount={wishlistCount} />

            <main className={styles.main}>
                <div className="container">
                    <div className={styles.successCard}>
                        <div className={styles.successIcon}>✓</div>
                        <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
                        <p className={styles.successMessage}>
                            Thank you for shopping with LUXE. Your order has been confirmed.
                        </p>

                        {order && (
                            <div className={styles.orderDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Order ID:</span>
                                    <span className={styles.detailValue}>{order.id}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Total Amount:</span>
                                    <span className={styles.detailValue}>₹{order.total.toFixed(0)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Payment Method:</span>
                                    <span className={styles.detailValue}>
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                                            order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI Payment'}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Delivery Address:</span>
                                    <span className={styles.detailValue}>
                                        {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className={styles.actionButtons}>
                            <Link href="/products" className="btn btn-primary">
                                Continue Shopping
                            </Link>
                            <Link href="/" className="btn btn-outline">
                                Back to Home
                            </Link>
                        </div>

                        <div className={styles.infoBox}>
                            <p>📧 Order confirmation has been sent to your email</p>
                            <p>📦 Estimated delivery: 3-5 business days</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
