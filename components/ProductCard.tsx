import React from 'react';
import Link from 'next/link';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviews: number;
    discount?: number;
    onAddToCart?: () => void;
    onAddToWishlist?: () => void;
    onBuyNow?: () => void;
    isInWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    originalPrice,
    image,
    rating,
    reviews,
    discount,
    onAddToCart,
    onAddToWishlist,
    onBuyNow,
    isInWishlist = false
}) => {
    return (
        <div className={styles.card}>
            <Link href={`/product/${id}`} className={styles.imageContainer}>
                <img src={image} alt={name} className={styles.productImage} />
                {discount && (
                    <div className={styles.discountBadge}>
                        {discount}% OFF
                    </div>
                )}
            </Link>

            <button
                className={`${styles.wishlistButton} ${isInWishlist ? styles.active : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    onAddToWishlist?.();
                }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" />
                </svg>
            </button>

            <div className={styles.content}>
                <Link href={`/product/${id}`}>
                    <h3 className={styles.name}>{name}</h3>
                </Link>

                <div className={styles.rating}>
                    <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
                                ★
                            </span>
                        ))}
                    </div>
                    <span className={styles.reviews}>({reviews})</span>
                </div>

                <div className={styles.priceContainer}>
                    <span className={styles.price}>₹{price.toLocaleString()}</span>
                    {originalPrice && (
                        <span className={styles.originalPrice}>₹{originalPrice.toLocaleString()}</span>
                    )}
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        className={styles.addToCartButton}
                        onClick={(e) => {
                            e.preventDefault();
                            onAddToCart?.();
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="9" cy="21" r="1" strokeWidth="2" />
                            <circle cx="20" cy="21" r="1" strokeWidth="2" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeWidth="2" />
                        </svg>
                        Add to Cart
                    </button>

                    {onBuyNow && (
                        <button
                            className={styles.buyNowButton}
                            onClick={(e) => {
                                e.preventDefault();
                                onBuyNow();
                            }}
                        >
                            ⚡ Buy Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
