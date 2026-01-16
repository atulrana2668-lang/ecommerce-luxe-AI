import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal, getCartItemCount, getWishlist } from '@/utils/storage';
import type { CartItem } from '@/utils/storage';
import styles from '@/styles/Cart.module.css';

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        setCartItems(getCart());
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    };

    const handleUpdateQuantity = (id: string, size: string, color: string, newQuantity: number) => {
        updateCartItemQuantity(id, size, color, newQuantity);
        loadCart();
    };

    const handleRemoveItem = (id: string, size: string, color: string) => {
        if (confirm('Remove this item from cart?')) {
            removeFromCart(id, size, color);
            loadCart();
        }
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    return (
        <>
            <Head>
                <title>Shopping Cart - LUXE</title>
                <meta name="description" content="Review your shopping cart" />
            </Head>

            <Header cartCount={cartCount} wishlistCount={wishlistCount} />

            <main className={styles.main}>
                <div className="container">
                    <h1 className={styles.pageTitle}>Shopping Cart</h1>

                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <div className={styles.emptyCartIcon}>🛒</div>
                            <h2>Your Cart is Empty</h2>
                            <p>Add some amazing products to your cart!</p>
                            <Link href="/products" className="btn btn-primary">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.cartContainer}>
                            {/* Cart Items */}
                            <div className={styles.cartItems}>
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className={styles.cartItem}>
                                        <div className={styles.itemImage}>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={100}
                                                height={100}
                                                style={{
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    background: '#f8f9fa'
                                                }}
                                            />
                                        </div>

                                        <div className={styles.itemDetails}>
                                            <Link href={`/product/${item.id}`} className={styles.itemName}>
                                                {item.name}
                                            </Link>
                                            <div className={styles.itemMeta}>
                                                <span className={styles.metaItem}>
                                                    <strong>Size:</strong> {item.selectedSize}
                                                </span>
                                                <span className={styles.metaItem}>
                                                    <strong>Color:</strong> {item.selectedColor}
                                                </span>
                                            </div>
                                            <div className={styles.itemPrice}>
                                                ₹{item.price.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className={styles.itemActions}>
                                            <div className={styles.quantityControl}>
                                                <button
                                                    className={styles.quantityButton}
                                                    onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className={styles.quantity}>{item.quantity}</span>
                                                <button
                                                    className={styles.quantityButton}
                                                    onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className={styles.itemTotal}>
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </div>

                                            <button
                                                className={styles.removeButton}
                                                onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <polyline points="3 6 5 6 21 6" strokeWidth="2" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className={styles.orderSummary}>
                                <h2 className={styles.summaryTitle}>Order Summary</h2>

                                <div className={styles.summaryRow}>
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? styles.free : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>

                                {shipping > 0 && (
                                    <div className={styles.shippingNote}>
                                        Add ₹{(1000 - subtotal).toLocaleString()} more for FREE shipping!
                                    </div>
                                )}

                                <div className={styles.summaryRow}>
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{tax.toFixed(0)}</span>
                                </div>

                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Total</span>
                                    <span>₹{total.toFixed(0)}</span>
                                </div>

                                <Link href="/checkout" className={`btn btn-primary ${styles.checkoutButton}`}>
                                    Proceed to Checkout
                                </Link>

                                <Link href="/products" className={styles.continueShoppingLink}>
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
