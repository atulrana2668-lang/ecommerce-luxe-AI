import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/layouts/AdminLayout';
import { withAdminAuth } from '@/utils/withAdminAuth';
import { useToast } from '@/components/Toast';
import { getAllProducts, deleteProduct } from '@/src/services/api';
import type { Product } from '@/src/types';
import styles from '@/styles/AdminDashboard.module.css';

function AdminProductsPage() {
    const toast = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await getAllProducts();
            if (response.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Error', 'Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (product: Product) => {
        if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
            return;
        }

        try {
            setDeletingId(product.id);
            await deleteProduct(product.id);
            toast.success('Product Deleted', `"${product.name}" has been removed.`);
            fetchProducts(); // Refresh list
        } catch (error: any) {
            toast.error('Delete Failed', error.message || 'Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <AdminLayout
            title="Products"
            breadcrumb={[{ label: 'Products' }]}
        >
            <div>
                {/* Header with Add Button */}
                <div className={styles.sectionHeader} style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                            {products.length} products in your inventory
                        </p>
                    </div>
                    <Link
                        href="/admin/products/new"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                            color: 'white',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        ➕ Add Product
                    </Link>
                </div>

                {/* Products Table */}
                <div className={styles.ordersSection}>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                border: '3px solid #e2e8f0',
                                borderTopColor: '#7c3aed',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 1rem'
                            }}></div>
                            <p style={{ color: '#64748b' }}>Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📦</span>
                            <h3 style={{ marginBottom: '0.5rem' }}>No Products Yet</h3>
                            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                                Start by adding your first product
                            </p>
                            <Link
                                href="/admin/products/add"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                                    color: 'white',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}
                            >
                                ➕ Add Your First Product
                            </Link>
                        </div>
                    ) : (
                        <table className={styles.ordersTable}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    background: '#f1f5f9'
                                                }}>
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        width={50}
                                                        height={50}
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{product.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                        ID: {product.id.slice(-8)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                background: '#f1f5f9',
                                                borderRadius: '50px',
                                                fontSize: '0.8rem'
                                            }}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td>
                                            <div>
                                                <strong>₹{product.price.toLocaleString()}</strong>
                                                {product.originalPrice && (
                                                    <div style={{
                                                        fontSize: '0.75rem',
                                                        color: '#94a3b8',
                                                        textDecoration: 'line-through'
                                                    }}>
                                                        ₹{product.originalPrice.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{product.stockQuantity || 'N/A'}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${product.inStock ? styles.delivered : styles.cancelled}`}>
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    style={{
                                                        padding: '0.4rem 0.75rem',
                                                        background: '#f1f5f9',
                                                        borderRadius: '6px',
                                                        fontSize: '0.8rem',
                                                        textDecoration: 'none',
                                                        color: '#334155'
                                                    }}
                                                >
                                                    ✏️ Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    disabled={deletingId === product.id}
                                                    style={{
                                                        padding: '0.4rem 0.75rem',
                                                        background: deletingId === product.id ? '#fee2e2' : '#fef2f2',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontSize: '0.8rem',
                                                        color: '#dc2626',
                                                        cursor: deletingId === product.id ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    {deletingId === product.id ? '...' : '🗑️ Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default withAdminAuth(AdminProductsPage);
