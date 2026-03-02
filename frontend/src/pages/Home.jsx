import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <div className="hero" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")', // Food spread / Cafe variety
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
                        {/* Logo/Badge simplified representation if needed, or just text */}
                        <span style={{
                            border: '2px solid rgba(255,255,255,0.8)',
                            padding: '10px 20px',
                            fontSize: '1.2rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            backgroundColor: 'rgba(0,0,0,0.3)'
                        }}>Since 1995</span>
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
                                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="Delicious Pastries"
                                style={{ width: '100%', display: 'block' }}
                            />
                        </div>
                        {/* Decorative background element */}
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

            {/* Best Selling Section */}
            <div className="section-bestsellers" style={{ padding: '5rem 0', backgroundColor: '#fdfbf7' }}>
                <div className="container">
                    <div className="text-center">
                        <h2 className="section-title">Premium Cakes & Pastries</h2>
                        <p className="section-subtitle">Our Best-Selling Treats</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px',
                        marginTop: '3rem'
                    }}>
                        {/* Product Card 1 */}
                        <div className="product-card" style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transition: 'transform 0.3s' }}>
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Chocolate Cake"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                />
                            </div>
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>Rich Chocolate Cake</h3>
                                <p style={{ color: '#d35400', fontWeight: 'bold', fontSize: '1.2rem' }}>₹450</p>
                            </div>
                        </div>

                        {/* Product Card 2 */}
                        <div className="product-card" style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transition: 'transform 0.3s' }}>
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1469533778471-92a68acc3633?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Fruit Tart"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                />
                            </div>
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>Fresh Fruit Tart</h3>
                                <p style={{ color: '#d35400', fontWeight: 'bold', fontSize: '1.2rem' }}>₹350</p>
                            </div>
                        </div>

                        {/* Product Card 3 */}
                        <div className="product-card" style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transition: 'transform 0.3s' }}>
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Croissants"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                />
                            </div>
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>Butter Croissants</h3>
                                <p style={{ color: '#d35400', fontWeight: 'bold', fontSize: '1.2rem' }}>₹120</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center" style={{ marginTop: '3rem' }}>
                        <Link to="/menu" className="btn btn-primary" style={{ padding: '15px 50px' }}>
                            View Our Menu
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
