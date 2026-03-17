import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                // Display first 8 products on home page
                setProducts(data.slice(0, 8));
            } catch (error) {
                console.error('Error fetching products for home page:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="home">
            {/* Hero Section */}
            <div className="hero" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/sr_bakery_exterior.jpg")', // Real Bakery Exterior
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                backgroundAttachment: 'fixed'
            }}>
                <div className="hero-content" style={{ maxWidth: '800px', padding: '0 20px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            border: '2px solid rgba(255,255,255,0.8)',
                            padding: '10px 20px',
                            fontSize: '1.2rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            backgroundColor: 'rgba(0,0,0,0.3)'
                        }}>Since 2025</span>
                    </div>
                    <h1 style={{
                        fontSize: '4.5rem',
                        marginBottom: '1rem',
                        fontFamily: 'Playfair Display, serif',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        lineHeight: 1.1
                    }}>
                        Welcome to <br />
                        <span style={{ color: '#d35400' }}>SR Bakery</span>
                    </h1>

                    <Link to="/menu" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                        Browse Our Products
                    </Link>
                </div>
            </div>

            {/* Introduction Section */}
            <div className="section-intro" style={{ padding: '5rem 0', backgroundColor: '#fff' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4rem' }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h4 style={{ color: '#d35400', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Our Story</h4>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                            Welcome to SR Bakery
                        </h2>
                        <h3 style={{ fontSize: '1.5rem', color: '#5d4037', marginBottom: '1.5rem', fontWeight: 400 }}>
                            Your Home for Premium Cakes & Pastries
                        </h3>
                        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.8 }}>
                            At SR Bakery, we take pride in crafting mouthwatering cakes and pastries using the finest ingredients and traditional techniques.
                            Whether you're celebrating a special occasion or just craving a sweet treat, our baked goods are made with love and passion.
                            Discover why our customers love our signature creations!
                        </p>
                        <Link to="/menu" className="btn btn-primary">
                            Browse Our Products
                        </Link>
                    </div>
                    <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
                        <div style={{
                            position: 'relative',
                            zIndex: 1,
                            borderRadius: '10px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}>
                            <img
                                src="/sr_bakery_real.jpg"
                                alt="SR Bakery Interior and Team"
                                style={{ width: '100%', display: 'block', minHeight: '400px', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '40%',
                            height: '40%',
                            backgroundColor: '#f4a460',
                            zIndex: 0,
                            borderRadius: '10px',
                            opacity: 0.3
                        }}></div>
                    </div>
                </div>
            </div>

            {/* Best Selling Section / Dynamic Menus */}
            <div className="section-bestsellers" style={{ padding: '5rem 0', backgroundColor: '#fdfbf7' }}>
                <div className="container">
                    <div className="text-center">
                        <h2 className="section-title">Premium Menu</h2>
                        <p className="section-subtitle">Our Freshly Prepared Items</p>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading menus...</div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '30px',
                            marginTop: '3rem'
                        }}>
                            {products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#7f8c8d' }}>No items found.</p>
                            )}
                        </div>
                    )}

                    <div className="text-center" style={{ marginTop: '3rem' }}>
                        <Link to="/menu" className="btn btn-primary" style={{ padding: '15px 50px' }}>
                            View Full Menu
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
