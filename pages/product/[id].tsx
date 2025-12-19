import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProductById, addToCart, addToWishlist, removeFromWishlist, isInWishlist, getCartItemCount, getWishlist } from '@/utils/storage';
import type { Product } from '@/utils/storage';
import styles from '@/styles/ProductDetail.module.css';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [inWishlist, setInWishlist] = useState(false);

    useEffect(() => {
        if (id && typeof id === 'string') {
            const foundProduct = getProductById(id);
            if (foundProduct) {
                setProduct(foundProduct);
                setSelectedSize(foundProduct.sizes[0]);
                setSelectedColor(foundProduct.colors[0]);
                setInWishlist(isInWishlist(id));
            }
        }
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, selectedSize, selectedColor, quantity);
            setCartCount(getCartItemCount());
            alert(`${product.name} added to cart!`);
        }
    };

    const handleToggleWishlist = () => {
        if (product) {
            if (inWishlist) {
                removeFromWishlist(product.id);
            } else {
                addToWishlist(product);
            }
            setInWishlist(!inWishlist);
            setWishlistCount(getWishlist().length);
        }
    };

    const handleBuyNow = () => {
        if (product) {
            addToCart(product, selectedSize, selectedColor, quantity);
            setCartCount(getCartItemCount());
            window.location.href = '/checkout';
        }
    };

    if (!product) {
        return (
            <>
                <Header cartCount={cartCount} wishlistCount={wishlistCount} />
                <div className={styles.loading}>
                    <div className="spinner"></div>
                    <p>Loading product...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{product.name} - LUXE</title>
                <meta name="description" content={product.description} />
            </Head>

            <Header cartCount={cartCount} wishlistCount={wishlistCount} />

            <main className={styles.main}>
                <div className="container">
                    <div className={styles.breadcrumb}>
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <Link href="/products">Products</Link>
                        <span>/</span>
                        <Link href={`/products?category=${product.category}`}>{product.category}</Link>
                        <span>/</span>
                        <span>{product.name}</span>
                    </div>

                    <div className={styles.productContainer}>
                        {/* Product Images */}
                        <div className={styles.imageSection}>
                            <div className={styles.mainImage}>
                                <img src={product.image} alt={product.name} className={styles.productImg} />
                                {product.discount && (
                                    <div className={styles.discountBadge}>
                                        {product.discount}% OFF
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className={styles.infoSection}>
                            <h1 className={styles.productName}>{product.name}</h1>

                            <div className={styles.rating}>
                                <div className={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className={styles.ratingText}>
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>

                            <div className={styles.priceSection}>
                                <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <>
                                        <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
                                        <span className={styles.savings}>
                                            Save ₹{(product.originalPrice - product.price).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className={styles.description}>{product.description}</p>

                            {/* Size Selection */}
                            <div className={styles.optionSection}>
                                <h3 className={styles.optionTitle}>Select Size</h3>
                                <div className={styles.sizeOptions}>
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`${styles.sizeButton} ${selectedSize === size ? styles.active : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div className={styles.optionSection}>
                                <h3 className={styles.optionTitle}>Select Color</h3>
                                <div className={styles.colorOptions}>
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            className={`${styles.colorButton} ${selectedColor === color ? styles.active : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className={styles.optionSection}>
                                <h3 className={styles.optionTitle}>Quantity</h3>
                                <div className={styles.quantityControl}>
                                    <button
                                        className={styles.quantityButton}
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </button>
                                    <span className={styles.quantity}>{quantity}</span>
                                    <button
                                        className={styles.quantityButton}
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className={styles.actionButtons}>
                                <button className="btn btn-primary" onClick={handleAddToCart}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="9" cy="21" r="1" strokeWidth="2" />
                                        <circle cx="20" cy="21" r="1" strokeWidth="2" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeWidth="2" />
                                    </svg>
                                    Add to Cart
                                </button>
                                <button className="btn btn-secondary" onClick={handleBuyNow}>
                                    ⚡ Buy Now
                                </button>
                                <button
                                    className={`btn ${inWishlist ? 'btn-secondary' : 'btn-outline'}`}
                                    onClick={handleToggleWishlist}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" />
                                    </svg>
                                    {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                                </button>
                            </div>

                            {/* Product Features */}
                            <div className={styles.features}>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>✓</span>
                                    <span>100% Original Products</span>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>✓</span>
                                    <span>Easy 30-day returns</span>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>✓</span>
                                    <span>Cash on Delivery available</span>
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
