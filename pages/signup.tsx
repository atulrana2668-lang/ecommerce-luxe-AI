import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';
import styles from '@/styles/Auth.module.css';

export default function Signup() {
    const router = useRouter();
    const { register, isAuthenticated, isLoading } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

    // Redirect if already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone must be a 10-digit number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAlert(null);

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const result = await register(
                formData.name,
                formData.email,
                formData.password,
                formData.phone || undefined
            );

            if (result.success) {
                setAlert({ type: 'success', message: 'Account created successfully! Redirecting...' });
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setAlert({ type: 'error', message: result.message });
            }
        } catch (error: any) {
            setAlert({ type: 'error', message: error.message || 'Registration failed. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPasswordStrength = (): { strength: number; label: string; color: string } => {
        const password = formData.password;
        let strength = 0;

        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 2) return { strength: 1, label: 'Weak', color: '#ef4444' };
        if (strength <= 4) return { strength: 2, label: 'Medium', color: '#f59e0b' };
        return { strength: 3, label: 'Strong', color: '#22c55e' };
    };

    if (isLoading) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    const passwordStrength = getPasswordStrength();

    return (
        <>
            <Head>
                <title>Create Account - LUXE</title>
                <meta name="description" content="Create your LUXE account and start shopping" />
            </Head>

            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.logo}>
                        <Link href="/" className={styles.logoText}>LUXE</Link>
                        <p className={styles.logoSubtext}>Premium Fashion</p>
                    </div>

                    <h1 className={styles.title}>Create Account</h1>
                    <p className={styles.subtitle}>Join LUXE for exclusive deals</p>

                    {alert && (
                        <div className={`${styles.alert} ${alert.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
                            <span className={styles.alertIcon}>
                                {alert.type === 'error' ? '⚠️' : '✓'}
                            </span>
                            {alert.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Full Name</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>👤</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`${styles.input} ${errors.name ? styles.error : ''}`}
                                    autoComplete="name"
                                />
                            </div>
                            {errors.name && <span className={styles.errorText}>⚠ {errors.name}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>📧</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={`${styles.input} ${errors.email ? styles.error : ''}`}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && <span className={styles.errorText}>⚠ {errors.email}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Phone Number (Optional)</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>📱</span>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit phone number"
                                    className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                                    autoComplete="tel"
                                    maxLength={10}
                                />
                            </div>
                            {errors.phone && <span className={styles.errorText}>⚠ {errors.phone}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Password</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    className={`${styles.input} ${errors.password ? styles.error : ''}`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {formData.password && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '4px',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {[1, 2, 3].map((level) => (
                                            <div
                                                key={level}
                                                style={{
                                                    height: '4px',
                                                    flex: 1,
                                                    borderRadius: '2px',
                                                    background: level <= passwordStrength.strength
                                                        ? passwordStrength.color
                                                        : '#e5e7eb'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: passwordStrength.color }}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                            {errors.password && <span className={styles.errorText}>⚠ {errors.password}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Confirm Password</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>🔒</span>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className={styles.errorText}>⚠ {errors.confirmPassword}</span>}
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className={styles.termsText}>
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className={styles.termsLink}>Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className={styles.termsLink}>Privacy Policy</Link>
                    </p>

                    <div className={styles.divider}>
                        <span className={styles.dividerText}>or continue with</span>
                    </div>

                    <div className={styles.socialButtons}>
                        <button type="button" className={styles.socialButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button type="button" className={styles.socialButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    <p className={styles.switchText}>
                        Already have an account?{' '}
                        <Link href="/login" className={styles.switchLink}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
