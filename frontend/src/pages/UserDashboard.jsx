import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaHistory, FaClock, FaArrowLeft } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, activitiesRes] = await Promise.all([
                    api.get('/orders/myorders'),
                    api.get('/activities/myactivities')
                ]);
                setOrders(ordersRes.data);
                setActivities(activitiesRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Dashboard...</div>;

    return (
        <div style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', padding: '3rem 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <Link 
                    to="/" 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        textDecoration: 'none', 
                        color: '#5d4037', 
                        fontWeight: 'bold',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem'
                    }}
                >
                    <FaArrowLeft size={12} /> Back to Home
                </Link>
                <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#5d4037', marginBottom: '0.5rem' }}>
                    Welcome back, {user?.name}!
                </h1>
                <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>Here is a summary of your recent activities and orders.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Orders Section */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.4rem', color: '#5d4037', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaBoxOpen color="#d35400" /> Past Orders
                        </h2>
                        {orders.length === 0 ? (
                            <p style={{ color: '#7f8c8d' }}>You have not placed any orders yet.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {orders.map(order => (
                                    <li key={order._id} style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Order #{order._id.substring(20, 24)}</span>
                                            <a 
                                                href={`${import.meta.env.VITE_BACKEND_URL}/orders/${order._id}/invoice?print=true`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ fontSize: '0.8rem', color: '#3498db', textDecoration: 'none' }}
                                            >
                                                Download Invoice
                                            </a>
                                            <span style={{ color: '#d35400', fontWeight: 'bold' }}>₹{order.totalAmount}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#7f8c8d' }}>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span style={{
                                                backgroundColor: order.isPaid ? '#e8f5e9' : '#ffebee',
                                                color: order.isPaid ? '#2ecc71' : '#e74c3c',
                                                padding: '2px 8px',
                                                borderRadius: '10px',
                                                fontSize: '0.8rem'
                                            }}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Activity Timeline Section */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.4rem', color: '#5d4037', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaHistory color="#3498db" /> Activity Log
                        </h2>
                        {activities.length === 0 ? (
                            <p style={{ color: '#7f8c8d' }}>No recent activity to show.</p>
                        ) : (
                            <div style={{ position: 'relative', borderLeft: '2px solid #ecf0f1', paddingLeft: '20px', marginLeft: '10px' }}>
                                {activities.map((activity, index) => (
                                    <div key={activity._id} style={{ marginBottom: index === activities.length - 1 ? 0 : '1.5rem', position: 'relative' }}>
                                        <FaClock style={{
                                            position: 'absolute',
                                            left: '-29px',
                                            top: '2px',
                                            backgroundColor: 'white',
                                            color: '#3498db',
                                            padding: '2px',
                                            borderRadius: '50%'
                                        }} size={16} />
                                        <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '1rem' }}>{activity.action}</h4>
                                        <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>{activity.details}</p>
                                        <span style={{ fontSize: '0.8rem', color: '#bdc3c7', display: 'block', marginTop: '5px' }}>
                                            {new Date(activity.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
