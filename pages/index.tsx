import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';
import { getCartItemCount, getWishlist, addToCart, addToWishlist, removeFromWishlist, isInWishlist } from '@/utils/storage';
import { getAllProducts } from '@/src/services/api';
import type { Product } from '@/utils/storage';
import styles from '@/styles/Home.module.css';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getAllProducts();
                if (response.success) {
                    setProducts(response.data.products);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    }, []);

    const handleAddToCart = (product: Product) => {
        // Add with default size and color
        const defaultSize = product.sizes[0];
        const defaultColor = product.colors[0];
        addToCart(product, defaultSize, defaultColor, 1);
        setCartCount(getCartItemCount());

        // Show notification
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

    const handleBuyNow = (product: Product) => {
        const defaultSize = product.sizes[0];
        const defaultColor = product.colors[0];
        addToCart(product, defaultSize, defaultColor, 1);
        setCartCount(getCartItemCount());
        window.location.href = '/checkout';
    };

    const featuredProducts = products.slice(0, 8);
    const categories = ['All', 'Men', 'Women'];

    return (
        <>
            <Head>
                <title>LUXE - Premium Fashion E-commerce Store</title>
                <meta name="description" content="Shop the latest fashion trends at LUXE. Premium clothing, accessories, and more with amazing discounts." />
            </Head>

            <Header cartCount={cartCount} wishlistCount={wishlistCount} />

            <main>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroOverlay}></div>
                    <div className={`container ${styles.heroContent}`}>
                        <h1 className={styles.heroTitle}>
                            Elevate Your Style
                            <span className={styles.heroSubtitle}>Discover Premium Fashion</span>
                        </h1>
                        <p className={styles.heroDescription}>
                            Explore our curated collection of premium clothing and accessories.
                            Up to 50% off on selected items!
                        </p>
                        <div className={styles.heroButtons}>
                            <Link href="/products" className="btn btn-primary">
                                Shop Now
                            </Link>
                            <Link href="/products?category=Women" className="btn btn-outline">
                                Women&apos;s Collection
                            </Link>
                        </div>
                    </div>
                    <div className={styles.heroDecoration}>
                        <div className={styles.floatingShape}></div>
                        <div className={styles.floatingShape}></div>
                        <div className={styles.floatingShape}></div>
                    </div>
                </section>

                {/* Features Section */}
                <section className={styles.features}>
                    <div className="container">
                        <div className={styles.featuresGrid}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🚚</div>
                                <h3>Free Shipping</h3>
                                <p>On orders above ₹999</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🔄</div>
                                <h3>Easy Returns</h3>
                                <p>30-day return policy</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>💳</div>
                                <h3>Secure Payment</h3>
                                <p>100% secure transactions</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>⚡</div>
                                <h3>Fast Delivery</h3>
                                <p>Express delivery available</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className={styles.categoriesSection}>
                    <div className="container">
                        <h2 className={styles.sectionTitle}>Shop by Category</h2>
                        <div className={styles.categoriesGrid}>
                            <Link href="/products?category=Men" className={styles.categoryCard}>
                                <div className={styles.categoryImage}>
                                    <Image src="/images/hero_male_model_1766164077598.png" alt="Men's Fashion" className={styles.catImg} width={400} height={500} />
                                </div>
                                <h3 className={styles.categoryName}>Men&apos;s Fashion</h3>
                                <p className={styles.categoryDesc}>Explore Collection →</p>
                            </Link>
                            <Link href="/products?category=Women" className={styles.categoryCard}>
                                <div className={styles.categoryImage}>
                                    <Image src="/images/hero_female_model_1766164095781.png" alt="Women's Fashion" className={styles.catImg} width={400} height={500} />
                                </div>
                                <h3 className={styles.categoryName}>Women&apos;s Fashion</h3>
                                <p className={styles.categoryDesc}>Explore Collection →</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className={styles.productsSection}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Featured Products</h2>
                            <Link href="/products" className={styles.viewAllLink}>
                                View All →
                            </Link>
                        </div>
                        <div className="grid grid-4" style={{ minHeight: loading ? '600px' : 'auto' }}>
                            {loading ? (
                                <ProductSkeletonGrid count={8} />
                            ) : (
                                featuredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                        onAddToCart={() => handleAddToCart(product)}
                                        onAddToWishlist={() => handleToggleWishlist(product)}
                                        onBuyNow={() => handleBuyNow(product)}
                                        isInWishlist={isInWishlist(product.id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className={styles.newsletter}>
                    <div className="container">
                        <div className={styles.newsletterContent}>
                            <h2 className={styles.newsletterTitle}>Stay Updated!</h2>
                            <p className={styles.newsletterText}>
                                Subscribe to our newsletter and get exclusive deals, new arrivals, and fashion tips.
                            </p>
                            <form className={styles.newsletterForm}>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className={styles.newsletterInput}
                                />
                                <button type="submit" className="btn btn-primary">
                                    Subscribe Now
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
