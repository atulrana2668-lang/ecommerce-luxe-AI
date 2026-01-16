import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/utils/AuthContext';
import { useToast } from '@/components/Toast';
import { getCart, getCartTotal, clearCart, addOrder, getCartItemCount, getWishlist } from '@/utils/storage';
import { createPaymentOrder, verifyPayment, createSimpleOrder, saveFinalOrder } from '@/src/services/api';
import type { CartItem, Address, Order } from '@/utils/storage';
import styles from '@/styles/Checkout.module.css';

// Razorpay type declaration
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function Checkout() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const toast = useToast();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

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

    // Load cart items
    useEffect(() => {
        const items = getCart();
        if (items.length === 0) {
            router.push('/cart');
        }
        setCartItems(items);
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    }, [router]);

    // Pre-fill user data if logged in
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [isAuthenticated, user]);

    // Dynamically load Razorpay SDK
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                setRazorpayLoaded(true);
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Initialize Razorpay payment
    const initializeRazorpay = async (razorpayOrderId: string, totalAmount: number) => {
        const res = await loadRazorpayScript();

        if (!res) {
            toast.error('Payment Error', 'Razorpay SDK failed to load. Are you online?');
            return;
        }

        const options = {
            key: 'rzp_test_123', // Dummy key as requested for now
            amount: totalAmount * 100,
            currency: 'INR',
            name: 'LUXE Store',
            description: 'Premium Fashion Purchase',
            order_id: razorpayOrderId,
            handler: async (response: any) => {
                try {
                    setIsProcessing(true);

                    // Prepare final order data
                    const finalOrderData = {
                        items: cartItems.map(item => ({
                            productId: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            selectedSize: item.selectedSize,
                            selectedColor: item.selectedColor,
                            image: item.image
                        })),
                        shippingAddress: {
                            name: formData.name,
                            phone: formData.phone,
                            street: formData.street,
                            city: formData.city,
                            state: formData.state,
                            pincode: formData.pincode
                        },
                        paymentMethod: formData.paymentMethod,
                        paymentStatus: 'paid', // Mark as paid on success
                        paymentId: response.razorpay_payment_id,
                        total: totalAmount
                    };

                    const saveResponse = await saveFinalOrder(finalOrderData);

                    if (saveResponse.success) {
                        clearCart();
                        toast.success('Payment Successful! 🎉', 'Your order has been confirmed.');
                        router.push(`/order-success?orderId=${saveResponse.data.order._id}`);
                    }
                } catch (error: any) {
                    console.error('Order save error:', error);
                    toast.error('Order Error', 'Payment was successful but we failed to save your order. Please contact support.');
                } finally {
                    setIsProcessing(false);
                }
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: '#7c3aed'
            },
            modal: {
                ondismiss: () => {
                    setIsProcessing(false);
                    toast.warning('Payment Cancelled', 'You cancelled the transaction.');
                }
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
            toast.error('Missing Info', 'Please fill all required fields.');
            return;
        }

        setIsProcessing(true);

        try {
            if (formData.paymentMethod === 'cod') {
                // Local storage fallback for COD
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
                    userId: user?.id || 'guest',
                    items: cartItems,
                    total: total,
                    address: address,
                    status: 'pending',
                    date: new Date().toISOString(),
                    paymentMethod: 'cod'
                };

                addOrder(order);
                clearCart();
                toast.success('Order Placed! 🎉', 'COD order successful.');
                router.push(`/order-success?orderId=${order.id}`);
            } else {
                // Razorpay Flow
                if (!isAuthenticated) {
                    toast.warning('Login Required', 'Please login to pay online.');
                    router.push('/login?redirect=/checkout');
                    return;
                }

                // 1. Create Razorpay Order ID on Backend
                const response = await createSimpleOrder(total);

                if (response.success) {
                    // 2. Open Modal
                    await initializeRazorpay(response.order.id, total);
                } else {
                    toast.error('Error', 'Could not initiate payment.');
                }
            }
        } catch (error: any) {
            toast.error('Checkout Error', error.message || 'Something went wrong.');
            setIsProcessing(false);
        }
    };

    // Calculate totals only on client to avoid hydration mismatch
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    const subtotal = mounted ? getCartTotal() : 0;
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    return (
        <>
            <Head>
                <title>Checkout - LUXE</title>
                <meta name="description" content="Complete your purchase" />
            </Head>

            {/* Razorpay Script */}
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
            />

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
                                                <p>Secure Razorpay payment</p>
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
                                                <p>Pay via Razorpay UPI</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1.125rem' }}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>Processing...</>
                                ) : formData.paymentMethod === 'cod' ? (
                                    <>Place Order - ₹{total.toFixed(0)}</>
                                ) : (
                                    <>Pay Now - ₹{total.toFixed(0)}</>
                                )}
                            </button>

                            {formData.paymentMethod !== 'cod' && (
                                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                                    🔒 Secured by Razorpay
                                </p>
                            )}
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
