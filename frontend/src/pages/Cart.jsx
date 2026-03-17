import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Cart = () => {
    const { cartItems, removeFromCart, increaseQty, decreaseQty, totalPrice } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login?redirect=/place-order');
        } else {
            navigate('/place-order');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h2>Your Cart is Empty</h2>
                <Link to="/menu" className="login-btn" style={{ display: 'inline-block', marginTop: '1rem' }}>Go To Menu</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h2>Shopping Cart</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                {cartItems.map(item => (
                    <div key={item._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '15px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h3>
                                <p style={{ color: '#666', margin: '5px 0' }}>₹{item.price}</p>
                                {item.qty >= item.stock && (
                                    <span style={{ color: '#e67e22', fontSize: '0.8rem', fontWeight: '500' }}>Max stock reached</span>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={() => decreaseQty(item._id)} style={{ border: '1px solid #ddd', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}><FaMinus size={10} /></button>
                                <span>{item.qty}</span>
                                <button onClick={() => increaseQty(item._id)} style={{ border: '1px solid #ddd', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}><FaPlus size={10} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item._id)} style={{
                                color: 'red',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                fontSize: '1.2rem'
                            }}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                <h3>Total: ₹{totalPrice}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Tax will be calculated at checkout</p>
                <button
                    onClick={checkoutHandler}
                    className="login-btn"
                    style={{ marginTop: '1rem', padding: '12px 30px', fontSize: '1.1rem', cursor: 'pointer' }}
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
