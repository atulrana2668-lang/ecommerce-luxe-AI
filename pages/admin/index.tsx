import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import styles from '@/styles/AdminDashboard.module.css';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Sales', value: '₹1,24,500', icon: '💰', change: '+12.5%', isPositive: true, type: 'revenue' },
        { label: 'Total Orders', value: '156', icon: '🛒', change: '+8.2%', isPositive: true, type: 'orders' },
        { label: 'Total Users', value: '842', icon: '👥', change: '+5.4%', isPositive: true, type: 'customers' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className={styles.dashboard}>
                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <div key={index} className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles[stat.type]}`}>
                                {stat.icon}
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statLabel}>{stat.label}</div>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={`${styles.statChange} ${stat.isPositive ? styles.positive : styles.negative}`}>
                                    {stat.isPositive ? '↑' : '↓'} {stat.change}
                                    <span style={{ color: '#64748b', marginLeft: '0.25rem' }}>vs last month</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Placeholder */}
                <div className={styles.chartsSection}>
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3 className={styles.chartTitle}>Sales Overview</h3>
                            <select className={styles.chartFilter}>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div className={styles.chartPlaceholder}>
                            <span>📈</span>
                            <p>Sales analytics visualization will appear here</p>
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3 className={styles.chartTitle}>Top Categories</h3>
                        </div>
                        <div className={styles.chartPlaceholder}>
                            <span>📊</span>
                            <p>Category distribution chart</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Card */}
                <div className={styles.ordersSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Dashboard Summary</h3>
                    </div>
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        <p>Welcome to the LUXE Administration Panel. Use the sidebar to manage your store products, orders, and customer data.</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
