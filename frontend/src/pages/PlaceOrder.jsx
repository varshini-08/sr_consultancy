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

    const [name, setName] = useState(user?.name || '');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        const orderData = {
            orderItems: cartItems.map(item => ({
                productId: item._id,
                name: item.name,
                quantity: item.qty, // Ensure this matches what backend expects
                price: item.price,
                image: item.image
            })),
            shippingAddress: {
                name, address, city, postalCode, mobileNumber, country: 'India'
            },
            itemsPrice: totalPrice,
            taxPrice,
            shippingPrice,
            totalAmount: grandTotal
        };

        navigate('/payment', { state: { orderData } });
    };

    return (
        <div className="container" style={{ marginTop: '2rem', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Shipping Details</h2>
                <form onSubmit={handlePlaceOrder}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Customer Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        />
                    </div>
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
                    <div style={{ marginBottom: '15px' }}>
                        <label>Mobile Number</label>
                        <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            title="Please enter a valid 10-digit mobile number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        />
                    </div>

                    <button type="submit" className="login-btn" style={{ marginTop: '20px', width: '100%', cursor: 'pointer' }}>
                        Proceed to Checkout (₹{grandTotal.toFixed(2)})
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
