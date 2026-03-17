import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaUtensils, FaPizzaSlice, FaHamburger, FaCoffee, FaBirthdayCake, FaDrumstickBite, FaBoxOpen } from 'react-icons/fa';
import api from '../api/axios';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) return imagePath;
        // Prefix with backend URL if it's a relative path
        return `http://localhost:5000${imagePath}`;
    };

    const getCategoryIcon = (category) => {
        const cat = category.toLowerCase();
        if (cat.includes('pizza')) return <FaPizzaSlice />;
        if (cat.includes('burger') || cat.includes('sandwich')) return <FaHamburger />;
        if (cat.includes('coffee') || cat.includes('beverage') || cat.includes('juice') || cat.includes('tea')) return <FaCoffee />;
        if (cat.includes('cake') || cat.includes('pastry')) return <FaBirthdayCake />;
        if (cat.includes('chicken')) return <FaDrumstickBite />;
        if (cat.includes('rice') || cat.includes('noodle') || cat.includes('starter')) return <FaUtensils />;
        return <FaBoxOpen />;
    };

    const isPlaceholder = !product.image || product.image === '' || product.image === 'https://via.placeholder.com/150' || product.image.includes('placeholder') || imgError;

    const handleAddToCart = async () => {
        if (!user) {
            localStorage.setItem('pendingCart', JSON.stringify(product));
            toast.info('Please login to add items to your cart.');
            navigate('/login');
            return;
        }

        const added = addToCart(product);
        if (added) {
            try {
                await api.post('/activities', { action: 'Added to Cart', details: `Added ${product.name} to cart` });
            } catch (error) {
                console.error("Could not log activity", error);
            }
            toast.success(`${product.name} added to cart!`, {
                position: "bottom-right",
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="product-card-premium">
            <div className="product-category-tag">{product.category}</div>

            <div className="product-image-container" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
                {isPlaceholder ? (
                    <div className="product-placeholder">
                        <div className="placeholder-icon-container">
                            {getCategoryIcon(product.category)}
                        </div>
                        <div className="placeholder-text">{product.name.charAt(0)}</div>
                        <div className="placeholder-badge">Freshly Prepared</div>
                    </div>
                ) : (
                    <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="product-image"
                        onError={() => setImgError(true)}
                    />
                )}
            </div>

            <div className="product-info">
                <h3 className="product-name" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
                <p className="product-desc">{product.description}</p>

                {product.stock <= 10 && product.stock > 0 && (
                    <p style={{ color: '#e67e22', fontSize: '0.85rem', fontWeight: 'bold', margin: '5px 0' }}>
                        {product.stock} left
                    </p>
                )}

                {product.stock === 0 && (
                    <p style={{ color: 'red', fontSize: '0.85rem', fontWeight: 'bold', margin: '5px 0' }}>
                        Out of Stock
                    </p>
                )}

                <div className="product-footer">
                    <span className="product-price">₹{product.price}</span>
                    <button
                        className="add-btn-premium"
                        onClick={handleAddToCart}
                        title={product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        disabled={product.stock === 0}
                        style={product.stock === 0 ? { backgroundColor: '#ccc', cursor: 'not-allowed' } : {}}
                    >
                        <FaPlus size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
