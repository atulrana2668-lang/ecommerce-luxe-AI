import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getWishlist, removeFromWishlist, addToCart, getCartItemCount, isInWishlist } from '@/utils/storage';
import type { Product } from '@/utils/storage';
import styles from '@/styles/Wishlist.module.css';

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = () => {
        const items = getWishlist();
        setWishlistItems(items);
        setWishlistCount(items.length);
        setCartCount(getCartItemCount());
    };

    const handleAddToCart = (product: Product) => {
        const defaultSize = product.sizes[0];
        const defaultColor = product.colors[0];
        addToCart(product, defaultSize, defaultColor, 1);
        setCartCount(getCartItemCount());
        alert(`${product.name} added to cart!`);
    };

    const handleRemoveFromWishlist = (product: Product) => {
        removeFromWishlist(product.id);
        loadWishlist();
    };

    return (
        <>
            <Head>
                <title>My Wishlist - LUXE</title>
                <meta name="description" content="Your saved favorite products" />
            </Head>

            <Header cartCount={cartCount} wishlistCount={wishlistCount} />

            <main className={styles.main}>
                <div className="container">
                    <h1 className={styles.pageTitle}>My Wishlist</h1>
                    <p className={styles.pageSubtitle}>
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>

                    {wishlistItems.length === 0 ? (
                        <div className={styles.emptyWishlist}>
                            <div className={styles.emptyIcon}>❤️</div>
                            <h2>Your Wishlist is Empty</h2>
                            <p>Save your favorite items to buy them later!</p>
                            <a href="/products" className="btn btn-primary">
                                Explore Products
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-4">
                            {wishlistItems.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    onAddToCart={() => handleAddToCart(product)}
                                    onAddToWishlist={() => handleRemoveFromWishlist(product)}
                                    isInWishlist={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
