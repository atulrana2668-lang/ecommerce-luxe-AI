import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { searchProducts, addToCart, addToWishlist, removeFromWishlist, isInWishlist, getCartItemCount, getWishlist } from '@/utils/storage';
import type { Product } from '@/utils/storage';
import styles from '@/styles/Search.module.css';

export default function Search() {
    const router = useRouter();
    const { q } = router.query;

    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        if (q && typeof q === 'string') {
            const results = searchProducts(q);
            setSearchResults(results);
        }
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    }, [q]);

    const handleAddToCart = (product: Product) => {
        const defaultSize = product.sizes[0];
        const defaultColor = product.colors[0];
        addToCart(product, defaultSize, defaultColor, 1);
        setCartCount(getCartItemCount());
        alert(`${product.name} added to cart!`);
    };

    const handleToggleWishlist = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
        setWishlistCount(getWishlist().length);
    };

    return (
        <>
            <Head>
                <title>Search Results - LUXE</title>
                <meta name="description" content={`Search results for ${q}`} />
            </Head>

            <Header cartCount={cartCount} wishlistCount={wishlistCount} />

            <main className={styles.main}>
                <div className="container">
                    <h1 className={styles.pageTitle}>
                        Search Results for "{q}"
                    </h1>
                    <p className={styles.resultCount}>
                        {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found
                    </p>

                    {searchResults.length > 0 ? (
                        <div className="grid grid-4">
                            {searchResults.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    onAddToCart={() => handleAddToCart(product)}
                                    onAddToWishlist={() => handleToggleWishlist(product)}
                                    isInWishlist={isInWishlist(product.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noResults}>
                            <div className={styles.noResultsIcon}>🔍</div>
                            <h2>No Products Found</h2>
                            <p>Try searching with different keywords</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
