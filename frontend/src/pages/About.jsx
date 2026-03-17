import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="about-page" style={{ padding: '4rem 0', backgroundColor: 'var(--background-color)' }}>
            <div className="container">
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <h2 className="section-title">About S R Bakery</h2>
                    <p className="section-subtitle">A Local Favorite in Oddanchatram</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '3rem',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                        }}>
                            <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
                                Deliciously Baked with Love
                            </h3>
                            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                                Welcome to <strong>S R Bakery</strong>, your vibrant local destination known for crafting the most delicious, fresh breads, cakes, pastries, and snacks.
                            </p>
                            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.8' }}>
                                As a proprietorship run by owner <strong>S Gopinath</strong>, we hold an unwavering commitment to quality, hygiene, and absolute customer satisfaction. Our ingredients are locally sourced, and our recipes are carefully curated to ensure every bite brings joy to our community.
                            </p>

                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2rem 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>🎂</div>
                                    <span style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>Cakes</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>🥖</div>
                                    <span style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>Breads</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>🥨</div>
                                    <span style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>Snacks</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <img
                            src="/sr_bakery_real.jpg"
                            alt="S R Bakery Interior"
                            style={{
                                width: '100%',
                                borderRadius: '16px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                objectFit: 'cover',
                                minHeight: '450px'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
