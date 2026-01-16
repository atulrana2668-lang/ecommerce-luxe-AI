import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Auth.module.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <>
            <Head>
                <title>Forgot Password - LUXE</title>
                <meta name="description" content="Reset your LUXE account password" />
            </Head>

            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.logo}>
                        <Link href="/" className={styles.logoText}>LUXE</Link>
                        <p className={styles.logoSubtext}>Premium Fashion</p>
                    </div>

                    {isSubmitted ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
                            <h1 className={styles.title}>Check Your Email</h1>
                            <p className={styles.subtitle} style={{ marginBottom: '1.5rem' }}>
                                We&apos;ve sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '2rem'
                            }}>
                                Didn&apos;t receive the email? Check your spam folder or try again with a different email address.
                            </p>
                            <Link href="/login" className={styles.submitButton} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className={styles.title}>Forgot Password?</h1>
                            <p className={styles.subtitle}>
                                Enter your email and we&apos;ll send you a reset link
                            </p>

                            {error && (
                                <div className={`${styles.alert} ${styles.alertError}`}>
                                    <span className={styles.alertIcon}>⚠️</span>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Email Address</label>
                                    <div className={styles.inputWrapper}>
                                        <span className={styles.inputIcon}>📧</span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className={styles.input}
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className={styles.spinner}></span>
                                            Sending Reset Link...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>

                            <p className={styles.switchText}>
                                Remember your password?{' '}
                                <Link href="/login" className={styles.switchLink}>
                                    Sign In
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
