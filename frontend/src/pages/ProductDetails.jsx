import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaMinus, FaShoppingCart, FaBolt, FaArrowLeft, FaPizzaSlice, FaHamburger, FaCoffee, FaBirthdayCake, FaDrumstickBite, FaUtensils, FaBoxOpen } from 'react-icons/fa';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageHandler';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Product not found');
                navigate('/menu');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);


    const getCategoryIcon = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('pizza')) return <FaPizzaSlice />;
        if (cat.includes('burger') || cat.includes('sandwich')) return <FaHamburger />;
        if (cat.includes('coffee') || cat.includes('beverage') || cat.includes('juice') || cat.includes('tea')) return <FaCoffee />;
        if (cat.includes('cake') || cat.includes('pastry')) return <FaBirthdayCake />;
        if (cat.includes('chicken')) return <FaDrumstickBite />;
        if (cat.includes('rice') || cat.includes('noodle') || cat.includes('starter')) return <FaUtensils />;
        return <FaBoxOpen />;
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.info('Please login to add items to your cart.');
            navigate('/login');
            return;
        }

        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.success(`${product.name} added to cart!`);
    };

    const handleBuyNow = () => {
        if (!user) {
            toast.info('Please login to continue.');
            navigate('/login');
            return;
        }
        
        // Add to cart and then navigate to cart/checkout
        addToCart(product);
        navigate('/place-order');
    };

    if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}><h2>Loading...</h2></div>;
    if (!product) return null;

    const isPlaceholder = !product.image || product.image === '' || product.image.includes('placeholder') || imgError;

    return (
        <div className="container" style={{ padding: '3rem 20px', minHeight: '80vh' }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#555', cursor: 'pointer', marginBottom: '2rem', fontWeight: 'bold' }}
            >
                <FaArrowLeft /> Back to Menu
            </button>

            <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Left: Product Image */}
                <div style={{ flex: '1', minWidth: '350px' }}>
                    <div style={{ 
                        borderRadius: '20px', 
                        overflow: 'hidden', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        backgroundColor: '#f9f9f9',
                        height: '450px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        {isPlaceholder ? (
                            <div className="product-placeholder" style={{ borderRadius: '0', width: '100%', height: '100%' }}>
                                <div className="placeholder-icon-container" style={{ fontSize: '5rem' }}>
                                    {getCategoryIcon(product.category)}
                                </div>
                                <div style={{ fontSize: '2rem', marginTop: '10px' }}>{product.name}</div>
                            </div>
                        ) : (
                            <img 
                                src={getImageUrl(product.image)} 
                                alt={product.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={() => setImgError(true)}
                            />
                        )}
                        <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'var(--primary-color)', color: 'white', padding: '5px 15px', borderRadius: '30px', fontWeight: 'bold' }}>
                            {product.category}
                        </div>
                    </div>
                </div>

                {/* Right: Product Details */}
                <div style={{ flex: '1', minWidth: '350px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '10px', color: '#2c3e50' }}>{product.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>₹{product.price}</span>
                        {product.stock > 0 ? (
                            <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                In Stock ({product.stock})
                            </span>
                        ) : (
                            <span style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '5px 12px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                Out of Stock
                            </span>
                        )}
                    </div>

                    <div style={{ marginBottom: '30px', borderTop: '1px solid #eee', paddingHeight: '20px' }}>
                        <h3 style={{ margin: '20px 0 10px', color: '#5d4037' }}>Description</h3>
                        <p style={{ fontSize: '1.1rem', color: '#7f8c8d', lineHeight: '1.8' }}>
                            {product.description || `Indulge in our exquisite ${product.name}, crafted with the finest ingredients and prepared fresh to your order. A true delight for your taste buds, specifically prepared to bring you the authentic flavors of SR Bakery.`}
                        </p>
                    </div>

                    {product.stock > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span style={{ fontWeight: 'bold' }}>Quantity:</span>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '30px', padding: '5px 15px', gap: '15px' }}>
                                    <button 
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                        <FaMinus size={12} />
                                    </button>
                                    <span style={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button 
                                    onClick={handleAddToCart}
                                    style={{ 
                                        flex: 1, 
                                        backgroundColor: 'white', 
                                        color: 'var(--primary-color)', 
                                        border: '2px solid var(--primary-color)', 
                                        padding: '15px', 
                                        borderRadius: '30px', 
                                        fontWeight: 'bold', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '10px', 
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    className="details-btn-secondary"
                                >
                                    <FaShoppingCart /> Add To Cart
                                </button>
                                <button 
                                    onClick={handleBuyNow}
                                    style={{ 
                                        flex: 1, 
                                        backgroundColor: 'var(--primary-color)', 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '15px', 
                                        borderRadius: '30px', 
                                        fontWeight: 'bold', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '10px', 
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    className="details-btn-primary"
                                >
                                    <FaBolt /> Buy Now
                                </button>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff8f1', borderRadius: '15px', border: '1px solid #ffe8d1' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#d35400' }}>SR Bakery Guarantee:</div>
                        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: '#5d4037', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Freshly Prepared</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Authentic Flavour</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Hygiene Standard</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Fast Delivery</li>
                        </ul>
                    </div>
                </div>
            </div>

            <style>{`
                .details-btn-secondary:hover {
                    background-color: #fff8f8;
                    transform: translateY(-2px);
                }
                .details-btn-primary:hover {
                    background-color: var(--primary-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(192, 57, 43, 0.3);
                }
            `}</style>
        </div>
    );
};

export default ProductDetails;
