import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Tax is 5%
    const taxPrice = totalPrice * 0.05;
    const shippingPrice = totalPrice > 500 ? 0 : 50; // Free shipping over 500
    const grandTotal = totalPrice + taxPrice + shippingPrice;

    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    productId: item._id,
                    name: item.name,
                    quantity: item.qty,
                    price: item.price,
                    image: item.image
                })),
                shippingAddress: {
                    address, city, postalCode, country: 'India'
                },
                paymentMethod,
                itemsPrice: totalPrice,
                taxPrice,
                shippingPrice,
                totalPrice: grandTotal
            };

            const { data } = await api.post('/orders', orderData);

            // If payment method is Card/UPI, simulate payment
            if (paymentMethod !== 'Cash') {
                await api.put(`/orders/${data._id}/pay`, {
                    id: 'PAYMENT_ID_' + Math.floor(Math.random() * 1000000),
                    status: 'COMPLETED',
                    update_time: new Date().toISOString(),
                    email_address: user.email
                });
                toast.success('Payment Successful');
            }

            toast.success('Order Placed Successfully');
            clearCart();
            // Go to order tracking or details
            // For now, tracking page requires entering ID manually as per prompt "Enter Order ID"
            // But usually we redirect to order details.
            // Let's redirect to My Orders or Tracking with ID ? 
            // The prompt says "Customer can Enter Order ID". I'll redirect to a generic success page or Tracking.
            // Let's redirect to Home for now, or Track Order page.
            navigate('/track-order');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Order Failed');
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Shipping & Payment</h2>
                <form onSubmit={handlePlaceOrder}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Address</label>
                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>City</label>
                        <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Postal Code</label>
                        <input
                            type="text"
                            required
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        />
                    </div>

                    <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Payment Method</h3>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <label>
                            <input
                                type="radio"
                                value="Cash"
                                checked={paymentMethod === 'Cash'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            /> Cash on Delivery
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="UPI"
                                checked={paymentMethod === 'UPI'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            /> UPI
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Card"
                                checked={paymentMethod === 'Card'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            /> Card
                        </label>
                    </div>

                    <button type="submit" className="login-btn" style={{ marginTop: '20px', width: '100%', cursor: 'pointer' }}>
                        Place Order (₹{grandTotal.toFixed(2)})
                    </button>
                </form>
            </div>

            <div style={{ width: '350px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', height: 'fit-content', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '15px' }}>Order Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Items:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Tax (5%):</span>
                    <span>₹{taxPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Shipping:</span>
                    <span>₹{shippingPrice.toFixed(2)}</span>
                </div>
                <div style={{ borderTop: '1px solid #ddd', margin: '10px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <span>Total:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
