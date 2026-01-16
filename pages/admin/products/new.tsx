import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/layouts/AdminLayout';
import { createProduct } from '@/src/services/api';
import { useToast } from '@/components/Toast';
import styles from '@/styles/AdminForms.module.css';

const AddProduct = () => {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'Men',
        stockQuantity: '',
    });

    const categories = ['Men', 'Women', 'Kids', 'Accessories'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.price || !formData.description || !formData.image || !formData.stockQuantity) {
            toast.error('Error', 'Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity),
                // Default values for other required/optional schema fields
                originalPrice: Number(formData.price) + 200, // Just a placeholder for demo
                sizes: ['M', 'L', 'XL'],
                colors: ['Blue', 'Black', 'White'],
                featured: false,
            };

            const response = await createProduct(productData);

            if (response.success) {
                toast.success('Success!', 'Product created successfully');
                router.push('/admin');
            } else {
                toast.error('Error', response.message || 'Failed to create product');
            }
        } catch (error: any) {
            console.error('Add product error:', error);
            toast.error('Error', error.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout
            title="Add New Product"
            breadcrumb={[{ label: 'Products', href: '/admin/products' }, { label: 'New Product' }]}
        >
            <Head>
                <title>Add Product - LUXE Admin</title>
            </Head>

            <div className={styles.formContainer}>
                <form className={styles.formCard} onSubmit={handleSubmit}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Product Information</h2>
                        <p className={styles.formSubtitle}>Fill in the details to list a new product in your store.</p>
                    </div>

                    <div className={styles.formGrid}>
                        {/* Name */}
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.formLabel}>
                                Product Name <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Premium Cotton Shirt"
                                className={styles.formInput}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Category <span className={styles.required}>*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={styles.formSelect}
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Stock */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Stock Quantity <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                placeholder="0"
                                className={styles.formInput}
                                min="0"
                                required
                            />
                        </div>

                        {/* Price */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Price (₹) <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.priceInputGroup}>
                                <span className={styles.currencySymbol}>₹</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className={styles.formInput}
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        {/* Image URL */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Image URL <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                                className={styles.formInput}
                                required
                            />
                            {formData.image && (
                                <div className={`${styles.imagePreview} ${styles.hasImage}`}>
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className={styles.previewImage}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Invalid+Image+URL';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.formLabel}>
                                Description <span className={styles.required}>*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter a detailed description of the product..."
                                className={styles.formTextarea}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => router.push('/admin')}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className={styles.spinner}></div>
                                    Creating...
                                </>
                            ) : (
                                'Create Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddProduct;
