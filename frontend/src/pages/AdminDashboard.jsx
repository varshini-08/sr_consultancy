import { useEffect, useState } from 'react';
import api from '../api/axios';
import { FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaCalendar, FaShoppingBag, FaMoneyBillWave } from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/analytics/dashboard');
                setStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-center mt-3">Loading Dashboard...</div>;
    if (!stats) return <div className="text-center mt-3">Error loading stats.</div>;

    const StatCard = ({ title, count, revenue, icon, color }) => (
        <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: `5px solid ${color}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                    <h4 style={{ color: '#7f8c8d', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h4>
                    <h2 style={{ fontSize: '2rem', color: '#2c3e50', margin: '5px 0' }}>{count}</h2>
                    <p style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>Orders</p>
                </div>
                <div style={{
                    backgroundColor: `${color}20`,
                    padding: '10px',
                    borderRadius: '10px',
                    color: color
                }}>
                    {icon}
                </div>
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', color: '#95a5a6' }}>Revenue</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' }}>₹{revenue.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="admin-dashboard">
            <h2 style={{ marginBottom: '2rem', fontFamily: 'Playfair Display, serif', color: '#5d4037' }}>Dashboard Overview</h2>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '25px',
                marginBottom: '3rem'
            }}>
                <StatCard
                    title="Today"
                    count={stats.today.count}
                    revenue={stats.today.revenue}
                    icon={<FaCalendarDay size={24} />}
                    color="#e74c3c"
                />
                <StatCard
                    title="This Week"
                    count={stats.week.count}
                    revenue={stats.week.revenue}
                    icon={<FaCalendarWeek size={24} />}
                    color="#3498db"
                />
                <StatCard
                    title="This Month"
                    count={stats.month.count}
                    revenue={stats.month.revenue}
                    icon={<FaCalendarAlt size={24} />}
                    color="#f39c12"
                />
                <StatCard
                    title="This Year"
                    count={stats.year.count}
                    revenue={stats.year.revenue}
                    icon={<FaCalendar size={24} />}
                    color="#9b59b6"
                />
            </div>

            {/* Recent Orders Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#5d4037' }}>Recent Orders</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
                                <th style={{ padding: '15px', color: '#7f8c8d' }}>Order ID</th>
                                <th style={{ padding: '15px', color: '#7f8c8d' }}>Customer</th>
                                <th style={{ padding: '15px', color: '#7f8c8d' }}>Date</th>
                                <th style={{ padding: '15px', color: '#7f8c8d' }}>Total</th>
                                <th style={{ padding: '15px', color: '#7f8c8d' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders && stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map(order => (
                                    <tr key={order._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#5d4037' }}>#{order._id.substring(20, 24)}</td>
                                        <td style={{ padding: '15px' }}>{order.user ? order.user.name : 'Guest'}</td>
                                        <td style={{ padding: '15px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>₹{order.totalAmount}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '5px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                backgroundColor: order.isPaid ? '#e8f5e9' : '#ffebee',
                                                color: order.isPaid ? '#2ecc71' : '#e74c3c'
                                            }}>
                                                {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No recent orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
