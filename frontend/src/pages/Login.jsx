import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [navigate, user, redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Login Successful');

            // Auto-resume cart
            const pendingCartStr = localStorage.getItem('pendingCart');
            if (pendingCartStr) {
                const pendingProduct = JSON.parse(pendingCartStr);
                addToCart(pendingProduct);
                localStorage.removeItem('pendingCart');

                // Log activity
                try {
                    await api.post('/activities', { action: 'Added to Cart', details: `Added ${pendingProduct.name} to cart after login` });
                } catch (error) {
                    console.error("Could not log activity", error);
                }

                toast.success(`${pendingProduct.name} added to cart!`);
                navigate('/cart');
                return;
            }

            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        required
                    />
                </div>
                <button type="submit" className="login-btn" style={{ width: '100%', cursor: 'pointer' }}>
                    Sign In
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>
                New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
            </p>
        </div>
    );
};

export default Login;
