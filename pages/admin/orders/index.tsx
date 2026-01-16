import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import styles from '@/styles/AdminDashboard.module.css';

const AdminOrdersPage = () => {
    // Dummy orders for now
    const orders = [
        { id: 'ORD-1234', customer: 'Rahul Sharma', date: '2024-05-15', total: '₹3,499', status: 'delivered' },
        { id: 'ORD-1235', customer: 'Priya Verma', date: '2024-05-16', total: '₹1,299', status: 'shipped' },
        { id: 'ORD-1236', customer: 'Amit Singh', date: '2024-05-16', total: '₹5,999', status: 'processing' },
        { id: 'ORD-1237', customer: 'Sneha Patel', date: '2024-05-17', total: '₹2,199', status: 'pending' },
    ];

    return (
        <AdminLayout title="Orders" breadcrumb={[{ label: 'Orders' }]}>
            <div className={styles.ordersSection}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>All Orders</h3>
                </div>

                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td><strong>{order.id}</strong></td>
                                <td>{order.customer}</td>
                                <td>{order.date}</td>
                                <td>{order.total}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    <button style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                    }}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminOrdersPage;
