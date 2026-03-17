import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { totalQty } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo-container">
                    <div className="sr-logo">
                        <div className="logo-shield-top"></div>
                        <div className="logo-content">
                            <span className="logo-initials">SR</span>
                        </div>
                        <div className="logo-ribbon">
                            <span className="ribbon-text">BAKERY</span>
                        </div>
                        <div className="logo-tagline">PREMIUM CAKE QUALITY</div>
                    </div>
                </Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/menu">Menu</Link>
                    <Link to="/contact">Contact</Link>
                    {user && user.role === 'admin' && (
                        <Link to="/admin/dashboard">Admin</Link>
                    )}
                    {user && user.role !== 'admin' && (
                        <Link to="/user/dashboard">Dashboard</Link>
                    )}
                </div>
                <div className="nav-actions">
                    <Link to="/cart" className="cart-icon">
                        <FaShoppingCart />
                        {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
                    </Link>
                    {user ? (
                        <div className="user-menu">
                            <span className="user-name"><FaUser /> {user.name}</span>
                            <button onClick={handleLogout} className="logout-btn"><FaSignOutAlt /></button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
