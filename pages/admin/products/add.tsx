import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminLayout from '@/layouts/AdminLayout';
import { withAdminAuth } from '@/utils/withAdminAuth';
import { useToast } from '@/components/Toast';
import { createProduct, CreateProductData } from '@/src/services/api';
import styles from '@/styles/AdminForms.module.css';

interface FormData {
    name: string;
    description: string;
    price: string;
    originalPrice: string;
    category: string;
    image: string;
    stockQuantity: string;
    sizes: string[];
    colors: string[];
    featured: boolean;
}

interface FormErrors {
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    image?: string;
    stockQuantity?: string;
}

function AddProductPage() {
    const router = useRouter();
    const toast = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'Men',
        image: '',
        stockQuantity: '100',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [],
        featured: false
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [colorInput, setColorInput] = useState('');

    const categories = ['Men', 'Women', 'Kids', 'Accessories'];
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSizeToggle = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleAddColor = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && colorInput.trim()) {
            e.preventDefault();
            if (!formData.colors.includes(colorInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    colors: [...prev.colors, colorInput.trim()]
                }));
            }
            setColorInput('');
        }
    };

    const handleRemoveColor = (color: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== color)
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 20) {
            newErrors.description = 'Description must be at least 20 characters';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = 'Please enter a valid price';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.image.trim()) {
            newErrors.image = 'Image URL is required';
        }

        if (formData.stockQuantity && (isNaN(Number(formData.stockQuantity)) || Number(formData.stockQuantity) < 0)) {
            newErrors.stockQuantity = 'Please enter a valid stock quantity';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Validation Error', 'Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            const productData: CreateProductData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                category: formData.category,
                image: formData.image.trim(),
                stockQuantity: Number(formData.stockQuantity) || 100,
                sizes: formData.sizes,
                colors: formData.colors,
                featured: formData.featured
            };

            await createProduct(productData);

            toast.success('Product Added Successfully', `"${formData.name}" has been added to your inventory.`);

            // Redirect to products list after short delay
            setTimeout(() => {
                router.push('/admin/products');
            }, 1500);

        } catch (error: any) {
            console.error('Create product error:', error);
            const errorMessage = error.message || 'Failed to create product. Please try again.';
            toast.error('Error Adding Product', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValidImageUrl = (url: string) => {
        return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
    };

    return (
        <AdminLayout
            title="Add New Product"
            breadcrumb={[
                { label: 'Products', href: '/admin/products' },
                { label: 'Add New' }
            ]}
        >
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Product Information</h2>
                            <p className={styles.formSubtitle}>
                                Fill in the details below to add a new product to your store.
                            </p>
                        </div>

                        <div className={styles.formGrid}>
                            {/* Product Name */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.formLabel}>
                                    Product Name <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`${styles.formInput} ${errors.name ? styles.error : ''}`}
                                    placeholder="e.g., Premium Cotton T-Shirt"
                                />
                                {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
                            </div>

                            {/* Description */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.formLabel}>
                                    Description <span className={styles.required}>*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`${styles.formTextarea} ${errors.description ? styles.error : ''}`}
                                    placeholder="Describe your product in detail..."
                                    rows={4}
                                />
                                {errors.description && <p className={styles.errorMessage}>{errors.description}</p>}
                                <p className={styles.formHelp}>{formData.description.length} / 2000 characters</p>
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
                                        onChange={handleChange}
                                        className={`${styles.formInput} ${errors.price ? styles.error : ''}`}
                                        placeholder="999"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                {errors.price && <p className={styles.errorMessage}>{errors.price}</p>}
                            </div>

                            {/* Original Price */}
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Original Price (₹)</label>
                                <div className={styles.priceInputGroup}>
                                    <span className={styles.currencySymbol}>₹</span>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleChange}
                                        className={styles.formInput}
                                        placeholder="1299 (for discount display)"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <p className={styles.formHelp}>Leave empty if no discount</p>
                            </div>

                            {/* Category */}
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Category <span className={styles.required}>*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`${styles.formSelect} ${errors.category ? styles.error : ''}`}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className={styles.errorMessage}>{errors.category}</p>}
                            </div>

                            {/* Stock Quantity */}
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                    className={`${styles.formInput} ${errors.stockQuantity ? styles.error : ''}`}
                                    placeholder="100"
                                    min="0"
                                />
                                {errors.stockQuantity && <p className={styles.errorMessage}>{errors.stockQuantity}</p>}
                            </div>

                            {/* Image URL */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.formLabel}>
                                    Image URL <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className={`${styles.formInput} ${errors.image ? styles.error : ''}`}
                                    placeholder="https://example.com/image.jpg or /images/product.jpg"
                                />
                                {errors.image && <p className={styles.errorMessage}>{errors.image}</p>}

                                {/* Image Preview */}
                                <div className={`${styles.imagePreview} ${formData.image && isValidImageUrl(formData.image) ? styles.hasImage : ''}`}>
                                    {formData.image && isValidImageUrl(formData.image) ? (
                                        <Image
                                            src={formData.image}
                                            alt="Product preview"
                                            className={styles.previewImage}
                                            width={200}
                                            height={200}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className={styles.noImage}>
                                            <span>🖼️</span>
                                            <p>Image preview will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.formLabel}>Available Sizes</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {availableSizes.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => handleSizeToggle(size)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '8px',
                                                border: formData.sizes.includes(size)
                                                    ? '2px solid #7c3aed'
                                                    : '2px solid #e2e8f0',
                                                background: formData.sizes.includes(size)
                                                    ? 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)'
                                                    : 'white',
                                                color: formData.sizes.includes(size) ? '#5b21b6' : '#64748b',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.formLabel}>Colors</label>
                                <div className={styles.tagsContainer}>
                                    {formData.colors.map(color => (
                                        <span key={color} className={styles.tag}>
                                            {color}
                                            <button
                                                type="button"
                                                className={styles.tagRemove}
                                                onClick={() => handleRemoveColor(color)}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={colorInput}
                                        onChange={(e) => setColorInput(e.target.value)}
                                        onKeyDown={handleAddColor}
                                        className={styles.tagInput}
                                        placeholder="Type a color and press Enter"
                                    />
                                </div>
                                <p className={styles.formHelp}>Press Enter to add each color</p>
                            </div>

                            {/* Featured */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <div className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className={styles.checkbox}
                                    />
                                    <label htmlFor="featured" className={styles.checkboxLabel}>
                                        Feature this product on homepage
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className={styles.formActions}>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        Adding Product...
                                    </>
                                ) : (
                                    <>
                                        ➕ Add Product
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => router.push('/admin/products')}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

export default withAdminAuth(AddProductPage);
