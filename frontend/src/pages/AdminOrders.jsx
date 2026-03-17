import { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            toast.success(`Order status updated to ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await api.get('/analytics/export-orders', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `orders_report_${new Date().toLocaleDateString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Report downloaded successfully');
        } catch (error) {
            console.error('Error downloading excel:', error);
            toast.error('Failed to download report');
        }
    };

    const filteredOrders = filterStatus
        ? orders.filter(order => order.status === filterStatus)
        : orders;

    // Sort by date desc
    const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Manage Orders</h2>
                <button
                    onClick={downloadExcel}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    Export to Excel
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginRight: '10px' }}>Filter Status:</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px' }}
                >
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Order ID</th>
                            <th style={{ padding: '15px' }}>Customer</th>
                            <th style={{ padding: '15px' }}>Mobile</th>
                            <th style={{ padding: '15px' }}>Date</th>
                            <th style={{ padding: '15px' }}>Total</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedOrders.map(order => (
                            <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>{order._id.substring(0, 10)}...</td>
                                <td style={{ padding: '15px' }}>{order.user?.name || 'Guest'}</td>
                                <td style={{ padding: '15px' }}>{order.shippingAddress?.mobileNumber || 'N/A'}</td>
                                <td style={{ padding: '15px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '15px' }}>₹{order.totalAmount}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        fontSize: '0.85rem',
                                        backgroundColor:
                                            order.status === 'Delivered' ? '#e8f5e9' :
                                                order.status === 'Cancelled' ? '#ffebee' :
                                                    order.status === 'Ready' ? '#e3f2fd' :
                                                        '#fff3e0',
                                        color:
                                            order.status === 'Delivered' ? '#2e7d32' :
                                                order.status === 'Cancelled' ? '#c62828' :
                                                    order.status === 'Ready' ? '#1565c0' :
                                                        '#ef6c00'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        style={{ padding: '5px', borderRadius: '5px', marginRight: '5px' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Ready">Ready</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <a 
                                        href={`${import.meta.env.VITE_BACKEND_URL}/orders/${order._id}/invoice`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ fontSize: '0.8rem', color: '#3498db', textDecoration: 'none', marginLeft: '5px' }}
                                    >
                                        Invoice
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
