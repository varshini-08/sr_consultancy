import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} added to cart`);
    };

    return (
        <div className="product-card" style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
            <dir style={{ height: '200px', overflow: 'hidden', margin: 0, padding: 0 }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </dir>
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{product.name}</h3>
                    <span style={{ backgroundColor: '#fff0f0', color: 'var(--primary-color)', padding: '2px 8px', borderRadius: '5px', fontSize: '0.8rem' }}>{product.category}</span>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px', flex: 1 }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>₹{product.price}</span>
                    <button onClick={handleAddToCart} style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        Add <FaPlus size={10} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
