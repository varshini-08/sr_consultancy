import React from 'react';

const Contact = () => {
    return (
        <div className="contact-page" style={{ padding: '4rem 0', backgroundColor: '#fff' }}>
            <div className="container">
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <h2 className="section-title">Contact Us</h2>
                    <p className="section-subtitle">We'd love to hear from you</p>
                </div>

                <div style={{ marginBottom: '3rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <img
                        src="/sr_bakery_exterior.jpg"
                        alt="SR Bakery Storefront"
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                    />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>

                    {/* Contact Information & Map */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div style={{
                            backgroundColor: 'var(--background-color)',
                            padding: '3rem',
                            borderRadius: '16px',
                            height: '100%',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                        }}>
                            <h3 style={{ color: 'var(--secondary-color)', marginBottom: '2rem', fontSize: '1.5rem' }}>Get in Touch</h3>

                            <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
                                <div style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginRight: '1rem', marginTop: '2px' }}>📍</div>
                                <div>
                                    <strong style={{ color: 'var(--secondary-color)', fontSize: '1.1rem' }}>S R Bakery</strong><br />
                                    <span style={{ fontSize: '0.9rem', color: '#7f8c8d', display: 'block', marginBottom: '5px' }}>Proprietorship</span>
                                    <span style={{ color: '#555', lineHeight: '1.6' }}>
                                        Ground Floor, Building No: SF NO-233/1A1<br />
                                        Sundhram & N. Ramanathan Building<br />
                                        Dindigul Palani Road<br />
                                        Nearby Landmark: Keerthi Supermarket<br />
                                        Oddanchatram, Dindigul<br />
                                        Tamil Nadu – 624619
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginRight: '1rem' }}>👤</div>
                                <div style={{ color: '#555' }}><strong style={{ color: 'var(--secondary-color)' }}>Proprietor:</strong> S Gopinath</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginRight: '1rem' }}>📞</div>
                                <div style={{ color: '#555' }}>+91 XXXXX XXXXX</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginRight: '1rem' }}>✉️</div>
                                <div><a href="mailto:contact@srbakery.com" style={{ color: '#555', textDecoration: 'none' }}>contact@srbakery.com</a></div>
                            </div>

                            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', height: '250px' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.6330103737237!2d77.75135111533664!3d10.45037996530635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9db3ad4f392dd%3A0xea8ee0b75a13c9e6!2sOddanchatram%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1689408759020!5m2!1sen!2sin"
                                    style={{ width: '100%', height: '100%', border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '3rem',
                            borderRadius: '16px',
                            height: '100%',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            border: '1px solid #eee'
                        }}>
                            <h3 style={{ color: 'var(--secondary-color)', marginBottom: '2rem', fontSize: '1.5rem' }}>Send us a Message</h3>
                            <form>
                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1', minWidth: '200px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>Name</label>
                                        <input type="text" placeholder="Your Name" required style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }} />
                                    </div>
                                    <div style={{ flex: '1', minWidth: '200px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>Email address</label>
                                        <input type="email" placeholder="contact@srbakery.com" required style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>Phone Number</label>
                                    <input type="tel" placeholder="+91 XXXXX XXXXX" style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }} />
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' }}>Message</label>
                                    <textarea rows="6" placeholder="How can we help you today?" required style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical', outline: 'none' }}></textarea>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <button type="button" className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1rem', borderRadius: '30px', cursor: 'pointer', border: 'none' }}>
                                        Submit Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
