import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { filterProducts, getCartItemCount, getWishlist, addToCart, addToWishlist, removeFromWishlist, isInWishlist } from '@/utils/storage';
import { getAllProducts } from '@/src/services/api';
import type { Product } from '@/utils/storage';
import styles from '@/styles/Products.module.css';

export default function Products() {
    const router = useRouter();
    const { category, q } = router.query;

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'popular'>('popular');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await getAllProducts();
                if (response.success) {
                    setProducts(response.data.products);
                    setFilteredProducts(response.data.products);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlist().length);
    }, []);

    useEffect(() => {
        if (category && typeof category === 'string') {
            setSelectedCategory(category);
        }
    }, [category]);

    useEffect(() => {
        if (products.length === 0) return;

        let result = products;

        // Filter by search query
        if (q && typeof q === 'string') {
            const query = q.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        // Apply filters
        result = filterProducts(
            selectedCategory === 'All' ? undefined : selectedCategory,
            priceRange[0],
            priceRange[1],
            sortBy
        );

        setFilteredProducts(result);
    }, [products, selectedCategory, sortBy, priceRange, q]);

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

    const categories = ['All', 'Men', 'Women'];

    return (
        <>
            <Head>
                <title>Products - LUXE Fashion Store</title>
                <meta name="description" content="Browse our complete collection of premium fashion products" />
            </Head>

            <Header cartCount={cartCount} wishlistCount={wishlistCount} />

            <main className={styles.main}>
                <div className="container">
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>
                            {q ? `Search Results for "${q}"` : selectedCategory === 'All' ? 'All Products' : `${selectedCategory}'s Fashion`}
                        </h1>
                        <p className={styles.productCount}>
                            {isLoading ? 'Loading...' : `${filteredProducts.length} Products Found`}
                        </p>
                    </div>

                    <div className={styles.productsContainer}>
                        {/* Filters Sidebar */}
                        <aside className={styles.sidebar}>
                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Categories</h3>
                                <div className={styles.categoryFilters}>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            className={`${styles.categoryButton} ${selectedCategory === cat ? styles.active : ''}`}
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Sort By</h3>
                                <select
                                    className={styles.sortSelect}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                >
                                    <option value="popular">Most Popular</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>

                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Price Range</h3>
                                <div className={styles.priceInputs}>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                        className={styles.priceInput}
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                        className={styles.priceInput}
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    step="100"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className={styles.priceSlider}
                                />
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <div className={styles.productsGrid}>
                            {isLoading ? (
                                // Loading skeleton
                                [...Array(8)].map((_, i) => (
                                    <div key={i} style={{
                                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer 1.5s infinite',
                                        borderRadius: '16px',
                                        height: '380px'
                                    }} />
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                        onAddToCart={() => handleAddToCart(product)}
                                        onAddToWishlist={() => handleToggleWishlist(product)}
                                        isInWishlist={isInWishlist(product.id)}
                                    />
                                ))
                            ) : (
                                <div className={styles.noProducts}>
                                    <div className={styles.noProductsIcon}>🔍</div>
                                    <h3>No Products Found</h3>
                                    <p>Try adjusting your filters or search terms</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
