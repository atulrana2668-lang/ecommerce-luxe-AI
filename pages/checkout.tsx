import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCart, getCartTotal, clearCart, addOrder, getCartItemCount, getWishlist } from '@/utils/storage';
import type { CartItem, Address, Order } from '@/utils/storage';
import styles from '@/styles/Checkout.module.css';

export default function Checkout() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod'
    });

    useEffect(() => {
        const items = getCart();
        if (items.length === 0) {
            router.push('/cart');
        }
        setCartItems(items);
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.pincode) {
            alert('Please fill in all fields');
            return;
        }

        // Create order
        const address: Address = {
            id: Date.now().toString(),
            name: formData.name,
            phone: formData.phone,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            isDefault: true
        };

        const order: Order = {
            id: `ORD${Date.now()}`,
            userId: 'guest',
            items: cartItems,
            total: total,
            address: address,
            status: 'pending',
            date: new Date().toISOString(),
            paymentMethod: formData.paymentMethod
        };

        addOrder(order);
        clearCart();

        // Redirect to success page
        router.push(`/order-success?orderId=${order.id}`);
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    return (
        <>
            <Head>
                <title>Checkout - LUXE</title>
                <meta name="description" content="Complete your purchase" />
            </Head>

            <Header cartCount={cartCount} wishlistCount={wishlistCount} />

            <main className={styles.main}>
                <div className="container">
                    <h1 className={styles.pageTitle}>Checkout</h1>

                    <div className={styles.checkoutContainer}>
                        {/* Checkout Form */}
                        <form className={styles.checkoutForm} onSubmit={handleSubmit}>
                            <div className={styles.formSection}>
                                <h2 className={styles.sectionTitle}>Contact Information</h2>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email">Email *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">Phone Number *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <h2 className={styles.sectionTitle}>Shipping Address</h2>
                                <div className={styles.formGrid}>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label htmlFor="street">Street Address *</label>
                                        <input
                                            type="text"
                                            id="street"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="city">City *</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="state">State *</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="pincode">Pincode *</label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <h2 className={styles.sectionTitle}>Payment Method</h2>
                                <div className={styles.paymentMethods}>
                                    <label className={styles.paymentOption}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleInputChange}
                                        />
                                        <div className={styles.paymentLabel}>
                                            <span className={styles.paymentIcon}>💵</span>
                                            <div>
                                                <strong>Cash on Delivery</strong>
                                                <p>Pay when you receive</p>
                                            </div>
                                        </div>
                                    </label>
                                    <label className={styles.paymentOption}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={handleInputChange}
                                        />
                                        <div className={styles.paymentLabel}>
                                            <span className={styles.paymentIcon}>💳</span>
                                            <div>
                                                <strong>Credit/Debit Card</strong>
                                                <p>Secure payment</p>
                                            </div>
                                        </div>
                                    </label>
                                    <label className={styles.paymentOption}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="upi"
                                            checked={formData.paymentMethod === 'upi'}
                                            onChange={handleInputChange}
                                        />
                                        <div className={styles.paymentLabel}>
                                            <span className={styles.paymentIcon}>📱</span>
                                            <div>
                                                <strong>UPI Payment</strong>
                                                <p>Pay via UPI apps</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.125rem' }}>
                                Place Order - ₹{total.toFixed(0)}
                            </button>
                        </form>

                        {/* Order Summary */}
                        <div className={styles.orderSummary}>
                            <h2 className={styles.summaryTitle}>Order Summary</h2>

                            <div className={styles.summaryItems}>
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className={styles.summaryItem}>
                                        <div className={styles.itemInfo}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <span className={styles.itemMeta}>
                                                {item.selectedSize} / {item.selectedColor} × {item.quantity}
                                            </span>
                                        </div>
                                        <span className={styles.itemPrice}>
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryCalculations}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? styles.free : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{tax.toFixed(0)}</span>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Total</span>
                                    <span>₹{total.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
