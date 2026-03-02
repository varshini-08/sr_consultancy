import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const OrderTracking = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    // Auto-search if ID passed in query (optional, for redirect from checkout)
    // Actually, I didn't pass query in checkout redirect, but good handle manually.

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!orderId) return;

        setLoading(true);
        try {
            const { data } = await api.get(`/orders/${orderId}`);
            setOrder(data);
        } catch (error) {
            setOrder(null);
            toast.error(error.response?.data?.message || 'Order not found');
        } finally {
            setLoading(false);
        }
    };

    // Auto-refresh logic could be added with setInterval if order is active

    const getStatusStep = (status) => {
        const steps = ['Pending', 'Preparing', 'Ready', 'Delivered'];
        const index = steps.indexOf(status);
        return index !== -1 ? index : 0;
    };

    const currentStep = order ? getStatusStep(order.status) : 0;
    const steps = ['Pending', 'Preparing', 'Ready', 'Delivered'];

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '600px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Track Your Order</h2>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Enter Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                <button type="submit" className="login-btn" style={{ padding: '10px 20px', cursor: 'pointer' }}>Track</button>
            </form>

            {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

            {order && (
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                        <h3>Order #{order._id}</h3>
                        <p style={{ color: '#666' }}>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', position: 'relative' }}>
                        {/* Progress Bar Line */}
                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '0',
                            right: '0',
                            height: '2px',
                            backgroundColor: '#ddd',
                            zIndex: 0
                        }}>
                            <div style={{
                                width: `${(currentStep / (steps.length - 1)) * 100}%`,
                                height: '100%',
                                backgroundColor: 'var(--primary-color)',
                                transition: 'width 0.3s'
                            }}></div>
                        </div>

                        {steps.map((step, index) => (
                            <div key={step} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundColor: index <= currentStep ? 'var(--primary-color)' : '#eee',
                                    color: index <= currentStep ? 'white' : '#666',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 5px',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}>
                                    {index + 1}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: index <= currentStep ? 'var(--text-color)' : '#999' }}>{step}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <h4>Items:</h4>
                        <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                            {order.orderItems.map(item => (
                                <li key={item._id} style={{ marginBottom: '5px' }}>
                                    {item.quantity}x {item.name} - ₹{item.price * item.quantity}
                                </li>
                            ))}
                        </ul>
                        <div style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'right' }}>
                            Total: ₹{order.totalPrice}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
