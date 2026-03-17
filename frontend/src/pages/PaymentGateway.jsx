import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCreditCard, FaMoneyBillWave, FaTimesCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const PaymentGateway = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const orderData = location.state?.orderData;

    const sendWhatsAppMessage = (order) => {
        const adminNumber = "918220373220";
        const orderItems = order.orderItems.map(item => `${item.name} x${item.quantity}`).join('\n');

        const message = `New Order Received!

Order ID: ${order._id.substring(order._id.length - 6).toUpperCase()}

Customer Name: ${user.name}
Phone: ${order.shippingAddress.mobileNumber}

Delivery Address:
${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}

Items Ordered:
${orderItems}

Total Amount Paid: ₹${order.totalAmount}
Payment Method: ${order.paymentMethod}

Status: Payment Successful

Please prepare the order.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

    useEffect(() => {
        // Prevent access if no order data is staged
        if (!orderData) {
            navigate('/cart');
        }
    }, [orderData, navigate]);

    if (!orderData) return null;

    const handlePayment = async (method) => {
        setLoading(true);
        let finalPaymentMethod = method;

        // Simulate a slight delay for processing
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Update the requested payment method internally
            const payload = { ...orderData, paymentMethod: finalPaymentMethod };
            const { data } = await api.post('/orders', payload);
            clearCart();
            toast.success('Order Successfully Placed!');
            logActivity(finalPaymentMethod, data._id, data.totalAmount);
            navigate('/user/dashboard');
        } catch (error) {
            console.error('Order Error:', error);
            toast.error(error.response?.data?.message || 'Payment Processing Failed');
            setLoading(false);
        }
    };

    const handleRazorpayPayment = async () => {
        setLoading(true);

        try {
            // 1. Create order on server
            const { data: order } = await api.post('/orders/razorpay', {
                amount: orderData.totalAmount
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
                amount: order.amount,
                currency: order.currency,
                name: "SR Bakery",
                description: "Bakery Order Payment",
                image: "/logo.png",
                order_id: order.id,
                handler: async (response) => {
                    try {
                        // 2. Verify payment on server
                        const { data: verification } = await api.post('/orders/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData
                        });

                        if (verification.success) {
                            clearCart();
                            toast.success('Payment Successful! Order Placed.');
                            logActivity('Razorpay', verification.order._id, orderData.totalAmount);

                            // Send WhatsApp Message to Admin
                            sendWhatsAppMessage(verification.order);

                            navigate('/user/dashboard');
                        }
                    } catch (error) {
                        console.error('Verification Error:', error);
                        toast.error('Payment verification failed');
                        setLoading(false);
                    }
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#d2691e"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setLoading(false);
        } catch (error) {
            console.error('Razorpay Error:', error);
            const errorMessage = error.response?.data?.details || error.response?.data?.message || 'Could not initialize Razorpay';
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    const handleDecline = () => {
        toast.info('Payment Declined. Order was not placed.');
        navigate('/cart');
    };

    const logActivity = async (method, orderId, total) => {
        try {
            await api.post('/activities', {
                action: 'Placed Order',
                details: `Successfully placed Order #${orderId.substring(20, 24)} via ${method} totaling ₹${total}`
            });
        } catch (e) {
            // Non-blocking
        }
    }

    return (
        <div style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', padding: '3rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#5d4037', marginBottom: '10px' }}>Secure Checkout</h2>
                <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Choose your payment method to complete the order.</p>

                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold' }}>
                        <span>Total Amount Due:</span>
                        <span style={{ color: '#d35400', fontSize: '1.2rem' }}>₹{orderData.totalAmount}</span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '20px' }}>
                        <FaSpinner className="spinner" size={40} color="#3498db" style={{ animation: 'spin 1.5s linear infinite' }} />
                        <p style={{ marginTop: '15px', color: '#2c3e50', fontWeight: 'bold' }}>Processing Transaction...</p>
                        <style>{`
                            @keyframes spin { 100% { transform: rotate(360deg); } }
                        `}</style>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <button
                            onClick={handleRazorpayPayment}
                            style={{ backgroundColor: '#d2691e', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
                            <FaCreditCard size={20} /> Pay with Razorpay (UPI/Card/Netbanking)
                        </button>

                        <button
                            onClick={() => handlePayment('Cash on Delivery')}
                            style={{ backgroundColor: '#3498db', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
                            <FaMoneyBillWave size={20} /> Cash on Delivery (COD)
                        </button>

                        <button
                            onClick={handleDecline}
                            style={{ backgroundColor: 'transparent', color: '#e74c3c', padding: '15px', border: '2px solid #e74c3c', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', marginTop: '10px' }}>
                            <FaTimesCircle size={20} /> Decline Payment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentGateway;
